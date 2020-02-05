package org.niagads.genomics.service.services.Variant;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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

@Path("variant/linkage")
public class VariantLDService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(VariantLDService.class);

    private static final String VARIANT_PARAM = "variants"; 
    private static final String POPULATION_PARAM = "population";

    private static final String ID_CTE = "SELECT find_variant_primary_key(variant_identifier) AS record_pk, variant_identifier FROM unnest(string_to_array(?, ',')) variant_identifier";
    
    private static final String VARIANT_CTE = "SELECT ids.variant_identifier AS request_variant_id," + NL 
        + "v.variant_id::integer AS variant_id, v.record_pk," + NL
        + "v.source_id AS refsnp_id, v.metaseq_id, v.chromosome" + NL
        + "FROM NIAGADS.Variant v, ids" + NL
        + "WHERE v.record_pk = ids.record_pk";
    
    private static final String VARIANT_DETAILS_JSON_QUERY = "SELECT jsonb_agg(jsonb_build_object(" + NL
        + "'request_id', request_variant_id," + NL 
        + "'record_pk', record_pk," + NL 
        + "'refsnp_id', CASE WHEN v.refsnp_id LIKE 'rs%' THEN refsnp_id ELSE NULL END,"
        + "'display_label'," + NL 
        + "CASE WHEN v.refsnp_id LIKE 'rs%' THEN refsnp_id" + NL 
        + "ELSE CASE WHEN length(metaseq_id) > 30 THEN substr(metaseq_id, 0, 27) || '...'" + NL 
        + "ELSE metaseq_id END END))::text AS details" + NL 
        + "FROM variants v";

    private static final String LD_CTE = "SELECT ld.variants," + NL
        + "ld.r_squared, protocol_app_node_id" + NL
        + "FROM Results.VariantLD ld," + NL
        + "Variants v" + NL
        + "WHERE ld.variants @> ARRAY[v.variant_id]";
        
      
    private static final String LD_RESULT_QUERY = "SELECT DISTINCT jsonb_agg(" + NL 
        + "jsonb_build_object('variant1', v1.record_pk, 'variant2', v2.record_pk, 'value', ld.r_squared))::text AS result" + NL
        + "FROM linkage ld," + NL 
        + "variants v1, variants v2," + NL
        + "Study.ProtocolAppNode pan" + NL
        + "WHERE ld.variants[1] = v1.variant_id" + NL
        + "AND ld.variants[2] = v2.variant_id" + NL
        + "AND pan.source_id = '1000GenomesLD_' || ?" + NL
        + "AND pan.protocol_app_node_id = ld.protocol_app_node_id";
       
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(VARIANT_PARAM) String variants,
                                  @QueryParam(POPULATION_PARAM) String population) throws WdkModelException {
                                      
        LOG.info("Starting 'Variant Linkage' Service");
        JSONArray linkage = null;
        JSONArray variantDetails = null;
        String message = "success";
        JSONObject response = new JSONObject();
        try {
            variantDetails = fetchVariantDetails(variants);
            linkage = fetchResult(variants, population);       
            if (variantDetails == null) {
               message = "Variants could not be mapped to database.";
            }
            else {
                response.put("variants", variantDetails);
            }

            if (linkage == null) {
                message = "No LD exists among the submitted variants.";
            }
            else {
                response.put("data", linkage);
            }
            response.put("message", message);           
        }

        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
          
        return Response.ok(response).build();
    }


    private JSONArray fetchResult(String variants, String population) {   
    
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, prepareLDQuery(), "variant-linkage-query");
        runner.executeQuery(new Object[] {variants, population}, handler);

        List <Map <String, Object>> results = handler.getResults();
        return new JSONArray((String) results.get(0).get("result"));
    }

    private String prepareIdCTE() {
        String sql = "WITH ids AS (" + ID_CTE + ")," + NL
            + "variants AS (" + VARIANT_CTE + ")";

        return sql;
    }

    private String prepareLDQuery() {
        String sql = prepareIdCTE() + ", " + NL
            + "linkage AS (" + LD_CTE + ")" + NL
            + LD_RESULT_QUERY;
        return sql;
    }

    private JSONArray fetchVariantDetails(String variants) {
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = prepareIdCTE() + NL
            + VARIANT_DETAILS_JSON_QUERY;
        SQLRunner runner = new SQLRunner(ds, sql, "variant-details-query");
        runner.executeQuery(new Object[] {variants}, handler);

        List <Map <String, Object>> results = handler.getResults();

        return new JSONArray((String) results.get(0).get("details"));
    }

}
