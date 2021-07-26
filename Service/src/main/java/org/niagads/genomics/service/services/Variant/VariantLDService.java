package org.niagads.genomics.service.services.Variant;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.gusdb.wdk.service.service.AbstractWdkService;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * provides ld triples for a list of variants; expects metaseq_ids, record_pk, or rsids
 * provides no filter on MAF or r2 at this time
 * @author ega
 */

@Path("variant/linkage/block")
public class VariantLDService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(VariantLDService.class);

    private static final String VARIANT_PARAM = "id"; 
    private static final String POPULATION_PARAM = "population";
    private static final String DEFAULT_POPULATION = "EUR";


    private static final String REQUEST_ID_CTE = "SELECT * FROM unnest(string_to_array(?, ',')) request_variant_id";
    private static final String RECORD_PK_CTE = "SELECT find_variant_primary_key(request_variant_id) AS record_primary_key," + NL
        + "request_variant_id FROM request_ids";
    
    private static final String VARIANT_CTE = "SELECT request_variant_id," + NL
        + "record_primary_key," + NL
        + "'chr' || split_part(record_primary_key, ':', 1) AS chromosome," + NL
        + "split_part(record_primary_key, '_', 2) AS ref_snp_id," + NL
        + "split_part(record_primary_key, ':', 2)::bigint AS location," + NL
        + "split_part(record_primary_key, '_', 1) AS metaseq_id" + NL
        + "FROM ids" + NL
        + "WHERE ids.record_primary_key IS NOT NULL";
    
    private static final String VARIANT_DETAILS_JSON_QUERY = "SELECT jsonb_agg(jsonb_build_object(" + NL
        + "'request_id', request_variant_id," + NL 
        + "'record_pk', record_primary_key," + NL 
        + "'refsnp_id', ref_snp_id,"
        + "'display_label'," + NL 
        + "CASE WHEN ref_snp_id IS NOT NULL THEN ref_snp_id" + NL 
        + "ELSE truncate_str(v.metaseq_id, 27) END)" + NL 
        + "ORDER BY chromosome, location)::text AS details" + NL 
        + "FROM Variants v";

    private static final String LD_CTE = "SELECT r.variants," + NL
        + "r.r_squared, population_protocol_app_node_id" + NL
        + "FROM Results.VariantLD r," + NL
        + "Variants v" + NL
        + "WHERE r.variants @> ARRAY[v.ref_snp_id]";
        
      
    private static final String LD_RESULT_QUERY = "Results AS (" + NL
        + "SELECT DISTINCT v1.record_primary_key AS variant1," + NL
        + "v2.record_primary_key AS variant2," + NL
        + "ld.r_squared AS value" + NL
        + "FROM Study.ProtocolAppNode pan," + NL
        + "Variants v1, Variants v2," + NL
        + "Linkage ld" + NL
        + "WHERE ld.variants[1] = v1.ref_snp_id" + NL
        + "AND ld.variants[2] = v2.ref_snp_id" + NL
        + "AND pan.source_id = '1000GenomesLD_' || ?::text" + NL
        + "AND pan.protocol_app_node_id = ld.population_protocol_app_node_id)" + NL
        + "SELECT json_agg(row_to_json(results.*))::text AS result FROM Results";
       
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(VARIANT_PARAM) String variants,
        @DefaultValue(DEFAULT_POPULATION)@QueryParam(POPULATION_PARAM) String population) throws WdkModelException {
                                      
        LOG.info("Starting 'Variant Linkage' Service");
        String linkage = null;
        String variantDetails = null;
        String unmappedVariants = null;
        //Boolean chrCount = null;
        String message = "success";
        JSONObject response = new JSONObject();
        try {
            //chrCount = verifySingleChromosome(variants); -- only necessary if rendering a graphic

            variantDetails = fetchVariantDetails(variants);
      
            if (variantDetails == null) {
               message = "Variants could not be mapped to database.";
            }
            else { // no need to request linkage if variants could not be mapped
                response.put("variants", new JSONArray(variantDetails));

                linkage = fetchResult(variants, population); 
        
                if (linkage == null) {
                    message = "No LD exists among the submitted variants.";
                }
                else {
                    response.put("data", new JSONArray(linkage));
                }
            }

            unmappedVariants = fetchUnmappedVariants(variants);
            JSONObject umvResult = new JSONObject();
            if (unmappedVariants == null) {
                umvResult.put("count", 0);
            }
            else {
                JSONArray umvIds = new JSONArray(unmappedVariants);
                umvResult.put("count", umvIds.length());
                umvResult.put("request_ids", umvIds);
            }

            response.put("unmapped_variants", umvResult);

            response.put("message", message);           
        }

        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
          
        return Response.ok(response).build();
    }

    
    private Boolean verifySingleChromosome(String variants) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, prepareChrCountSql(), "verify-chr-query");
        runner.executeQuery(new Object[] {variants}, handler);

        List <Map <String, Object>> results = handler.getResults();
        return ((Integer) results.get(0).get("chr_count") == 1);
    }

    private String fetchResult(String variants, String population) {   
    
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, prepareLDQuery(), "variant-linkage-query");
        runner.executeQuery(new Object[] {variants, population}, handler);

        List <Map <String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return null;
        }

        return (String) results.get(0).get("result");
    }

    private String prepareIdCTE() {
        String sql = "WITH request_ids AS (" + REQUEST_ID_CTE + ")," + NL
            + "ids AS (" + RECORD_PK_CTE + ")";
        return sql;
    }

    private String prepareChrCountSql() {
        String sql = prepareMappedVariantIdCTE() + NL
            + "SELECT COUNT(DISTINCT chromosome) AS chr_count" + NL
            + "FROM variants";
        return sql;
    }

    private String prepareMappedVariantIdCTE() {
        String sql = prepareIdCTE() + "," + NL
            + "variants AS (" + VARIANT_CTE + ")";
        return sql;
    }

    private String prepareUnmappedVariantQuery() {

        String sql = prepareIdCTE() + NL
            + "SELECT json_agg(ids.request_variant_id)::text AS unmapped_variants" + NL 
            + "FROM ids" + NL
            + "WHERE ids.record_primary_key IS NULL";
        return sql;
    }

    private String prepareLDQuery() {
        String sql = prepareMappedVariantIdCTE() + ", " + NL
            + "linkage AS (" + LD_CTE + ")," + NL
            + LD_RESULT_QUERY;

        return sql;
    }

    private String fetchUnmappedVariants(String variants) {
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = prepareUnmappedVariantQuery();

        SQLRunner runner = new SQLRunner(ds, sql, "unmapped-variants-query");
        runner.executeQuery(new Object[] {variants}, handler);

        List <Map <String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return null;
        }
        return (String) results.get(0).get("unmapped_variants");
    }

    private String fetchVariantDetails(String variants) {
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = prepareMappedVariantIdCTE() + NL
            + VARIANT_DETAILS_JSON_QUERY;

        SQLRunner runner = new SQLRunner(ds, sql, "variant-details-query");
        runner.executeQuery(new Object[] {variants}, handler);

        List <Map <String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return null;
        }
        return (String) results.get(0).get("details");
    }

}
