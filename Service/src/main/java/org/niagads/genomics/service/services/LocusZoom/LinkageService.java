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
public class LinkageService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(LinkageService.class);

    private static final String REFERENCE_VARIANT_PARAM = "variant";
    private static final String RANGE_START_PARAM = "start";
    private static final String RANGE_END_PARAM = "end";
    private static final String POPULATION_PARAM = "population";
    private static final String SCORE_PARAM = "score";

    private static final String SCORE_DPRIME = "dprime";
    private static final String SCORE_RSQUARED = "r2";

    private static final String LINKAGE_QUERY = "WITH linkage AS (" + NL
        + "SELECT unnest(ld.variants) AS variant_id, r_squared" + NL
        + "FROM Results.VariantLD ld," + NL
        + "Study.ProtocolAppNode pan," + NL
        + "NIAGADS.Variant v" + NL
        + "WHERE v.record_pk = ?" + NL
        + "AND ld.variants @> ARRAY[v.variant_id::integer]" + NL
	+ "AND ld.chromosome = ? " + NL
        + "AND pan.source_id = '1000GenomesLD_' || ?" + NL
        + "AND ld.protocol_app_node_id = pan.protocol_app_node_id)," + NL
        + "Result AS (" + NL
        + "SELECT v.record_pk AS variant, l.r_squared" + NL 
        + "FROM linkage l," + NL
        + "NIAGADS.Variant v" + NL
        + "WHERE v.variant_id = l.variant_id" + NL
        + "AND v.record_pk != ?" + NL
        + "UNION" + NL
        + "SELECT ? AS variant, 1.0 AS r_squared)" + NL
        + "SELECT jsonb_build_object('data'," + NL
        + "jsonb_build_object('id2', jsonb_agg(variant ORDER BY variant)) ||" + NL
        + "jsonb_build_object('value', jsonb_agg(r_squared ORDER BY variant)))::text AS result_json" + NL
        + "FROM result";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.locuszoom.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(REFERENCE_VARIANT_PARAM) String variant, 
                                 /*@QueryParam(RANGE_START_PARAM) int start, 
                                 @QueryParam(RANGE_END_PARAM) int end,*/
                                 @QueryParam(POPULATION_PARAM) String population,
                                 @QueryParam(SCORE_PARAM) String scoreType) throws WdkModelException {
        LOG.info("Starting 'Locus Zoom Linkage' Service");
        String response = "{}";
        try {
            // query database for ld
            response = fetchLinkage(variant, population);
            LOG.debug("query result: " + response);
            // return result
        }

        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
          
        return Response.ok(response).build();
    }

    private String fetchLinkage(String variant, String population) {   
    
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        
        LOG.debug("Fetching linkage for variant:" + variant + "; population: " + population);

	String[] vDetails = variant.split(":", 2);
	String chromosome = "chr" + vDetails[0];

        SQLRunner runner = new SQLRunner(ds, LINKAGE_QUERY, "linkage-query");
        runner.executeQuery(new Object[] {variant, chromosome, population, variant, variant}, handler);

        List <Map <String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result_json");
    }

}
