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


@Path("track/gene")
public class GeneTrackService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(GeneTrackService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String LOCATION_START_PARAM = "start";
    private static final String LOCATION_END_PARAM = "end";

    private static final String CHROMOSOME_SQL = "SELECT feature_json->>? AS result" + NL
        + "FROM NIAGADS.GTFGeneTrack g" + NL
        + "WHERE chromosome = ? AND feature_type = 'chromosome'";

    private static final String SPAN_SQL = "WITH RefLocation AS (" + NL
        + "SELECT ? as chrm, ? as location_start, ? as location_end," +  NL
        + "find_bin_index(?, ?, ?) AS bin_index)" + NL 
        + "SELECT json_agg(feature_json order by track_feature_id)::text AS result" + NL 
        + "FROM RefLocation r, NIAGADS.GTFGeneTrack gt" + NL
        + "WHERE r.bin_index @> gt.bin_index" + NL
        + "AND int8range(r.location_start, r.location_end, '[]') @> int8range(gt.location_start, gt.location_end, '[]')";

 
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.gene.get-response")
    public Response buildResponse(String body,
            @QueryParam(CHROMOSOME_PARAM) String chromosome,
            @QueryParam(LOCATION_START_PARAM) Long locationStart,
            @QueryParam(LOCATION_END_PARAM) Long locationEnd) throws WdkModelException {
        LOG.info("Starting 'Gene Track' Service");

        JSONObject response = new JSONObject();
      
        try {
            if (chromosome != "all") {
                JSONArray data = (locationStart == null) ? lookupChr(chromosome) : lookupSpan(chromosome, locationStart, locationEnd);
                response.put("data", data);
            }
            else { // no response for all chrs
                response.put("data", new JSONArray()); 
            }
            //LOG.debug("query result: " + data.toString());         
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }


    private JSONArray lookupChr(String chromosome) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, CHROMOSOME_SQL, "track-full-chr-gene-data-query");
        runner.executeQuery(new Object[] { chromosome, chromosome }, handler);
        
        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return new JSONArray();
        }

        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null" || resultStr == null) {
            return new JSONArray();
        }

        //LOG.debug("RESULT:  " + resultStr);
        return new JSONArray(resultStr);
    }

    private JSONArray lookupSpan(String chromosome, Long locationStart, Long locationEnd) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        LOG.debug("SQL: " + SPAN_SQL);
        SQLRunner runner = new SQLRunner(ds, SPAN_SQL, "track-gene-data-query");
        runner.executeQuery(new Object[] { chromosome, locationStart, locationEnd, chromosome, locationStart, locationEnd }, handler);
        
        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return new JSONArray();
        }

        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null" || resultStr == null) {
            return new JSONArray();
        }

        LOG.debug("RESULT:  " + resultStr);
        return new JSONArray(resultStr);
    }
}