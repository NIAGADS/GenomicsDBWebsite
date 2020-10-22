package org.niagads.genomics.service.services.GenomeBrowser;

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


@Path("track/gwas")
public class GWASSummaryStatisticsTrackService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(GWASSummaryStatisticsTrackService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String TRACK_PARAM = "track";
    private static final String LOCATION_START_PARAM = "start";
    private static final String LOCATION_END_PARAM = "end";

    private static final String TRACK_INTERNAL_ID_CTE = "SELECT protocol_app_node_id FROM Study.ProtocolAppNode WHERE source_id = ?";
    private static final String BIN_INDEX_CTE = "SELECT find_bin_index(?, ?, ?) AS bin";
    private String DATA_QUERY = buildDataQuery();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.gwas.get-response")
    public Response buildResponse(String body,
            @QueryParam(TRACK_PARAM) String track,
            @QueryParam(CHROMOSOME_PARAM) String chromosome,
            @QueryParam(LOCATION_START_PARAM) Long locationStart,
            @QueryParam(LOCATION_END_PARAM) Long locationEnd) throws WdkModelException {
        LOG.info("Starting 'GWAS Summary Statistics Track' Service");

        JSONObject response = new JSONObject();
        response.put("track", track);

        try {
            JSONArray data = fetchResult(track, chromosome, locationStart, locationEnd);
            //LOG.debug("query result: " + data.toString());
            response.put("data", data);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }


    private JSONArray fetchResult(String track, String chromosome, Long locationStart, Long locationEnd) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        //LOG.debug(DATA_QUERY);
        //LOG.debug("track = " + track + " // chr = " + chromosome + " // start = " + locationStart.toString() + " // end = " + locationEnd.toString());
        SQLRunner runner = new SQLRunner(ds, DATA_QUERY, "track-gwas-summary-stats-data-query");
        runner.executeQuery(new Object[] { track, chromosome, locationStart, locationEnd, locationStart, locationEnd }, handler);
        
        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return new JSONArray();
        }

        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null") {
            return new JSONArray();
        }

        //LOG.debug("RESULT:  " + resultStr);
        return new JSONArray(resultStr);
    }


    private String buildDataQuery() {
        String cteSql = "WITH dataset AS (" + TRACK_INTERNAL_ID_CTE + ")," + NL
            + "bin AS (" + BIN_INDEX_CTE + ")," + NL
            + "variants AS (SELECT jsonb_build_object(" + NL
            + "'neg_log10_pvalue', neg_log10_pvalue," + NL
            + "'pvalue', pvalue_display," + NL
            + "'record_pk', r.variant_record_primary_key," + NL
            + "'variant', split_part(r.variant_record_primary_key, '_', 1)" + NL
            + ") AS rjson" + NL
            + "FROM Results.VariantGWAS r, dataset, bin" + NL 
            + "WHERE r.protocol_app_node_id = dataset.protocol_app_node_id" + NL
            + "AND r.bin_index <@ bin.bin" + NL
            + "AND int8range(?, ?) @> split_part(r.variant_record_primary_key, ':', 2)::bigint)";

        String querySql = cteSql + NL
            + "SELECT jsonb_agg(rjson)::text AS result FROM variants";

        return querySql;
    }
}