package org.niagads.genomics.service.services.LocusZoom;

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

@Path("locuszoom/linkage")
// @OutSchema("niagads.locuszoom.linkage.get-response")   
public class LZLinkageService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(LZLinkageService.class);

    private static final String REFERENCE_VARIANT_PARAM = "variant";
    private static final String POPULATION_PARAM = "population";

    private static final String LINKAGE_QUERY = "WITH id AS (SELECT ?::text AS source_id)," + NL
        + "variant AS (SELECT source_id," + NL
        + "'chr' || split_part(source_id, ':', 1)::text AS chromosome," + NL
        + "CASE WHEN split_part(source_id, '_', 2) IS NULL THEN split_part(source_id, '_', 1)" + NL
        + "ELSE split_part(source_id, '_', 2) END AS pattern," + NL
        + "split_part(source_id, '_', 2) AS ref_snp_id" + NL
        + "FROM id)," + NL
        + "LDResult AS (" + NL
        + "SELECT CASE WHEN v.pattern = r.variants[1]" + NL
        + "THEN find_variant_primary_key(r.variants[2])" + NL
        + "ELSE find_variant_primary_key(r.variants[1])" + NL
        + "END AS variant, r.r_squared" + NL
        + "FROM Results.VariantLD r," + NL
        + "variant v," + NL
        + "Study.ProtocolAppNode pan" + NL
        + "WHERE r.variants @> ARRAY[v.pattern]" + NL
        + "AND r.chromosome = ?" + NL
        + "AND pan.protocol_app_node_id = r.population_protocol_app_node_id" + NL
        + "AND pan.source_id = '1000GenomesLD_' || ?::text" + NL
        + "UNION" + NL
        + "SELECT id.source_id AS variant, 1.0 AS r_squared FROM id)" + NL
        + "SELECT jsonb_build_object('data'," + NL
        + "jsonb_build_object('id2', jsonb_agg(variant ORDER BY variant)) || " + NL
        + "jsonb_build_object('value', jsonb_agg(r_squared ORDER BY variant)))::text AS result" + NL
        + "FROM LDResult";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.locuszoom.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(REFERENCE_VARIANT_PARAM) String variant, 
                                 @QueryParam(POPULATION_PARAM) String population) throws WdkModelException {
        LOG.info("Starting 'Locus Zoom Linkage' Service");
        String response = null;
        try {
            // query database for ld
            response = lookup(variant, population);
            //LOG.debug("query result: " + response);
        }

        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
          
        return Response.ok(response).build();
    }

    private String lookup(String variant, String population) {   
    
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        
        String variantLoc[] = variant.split(":");
        String chromosome = "chr" + variantLoc[0];
        LOG.debug("Fetching linkage for variant:" + variant + "; population: " + population + "; on chromosome: " + chromosome);

        SQLRunner runner = new SQLRunner(ds, LINKAGE_QUERY, "linkage-query");
        runner.executeQuery(new Object[] {variant, chromosome, population}, handler);

        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return "{}";
        }

        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null" || resultStr == null) {
            return "{}";
        }

        //LOG.debug("RESULT:  " + resultStr);
        return resultStr;
    }

}
