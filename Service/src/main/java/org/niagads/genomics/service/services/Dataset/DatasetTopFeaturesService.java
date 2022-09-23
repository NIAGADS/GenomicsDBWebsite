package org.niagads.genomics.service.services.Dataset;

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
import org.json.JSONObject;


@Path("dataset/gwas/top")
public class DatasetTopFeaturesService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(DatasetTopFeaturesService.class);

    private static final String DATASET_PARAM = "track";
    private static final String LIMIT_PARAM = "limit";
    private static final String FLANK_PARAM = "flank";

    private static final String TOP_HITS_CTE_SQL = "SELECT * FROM" + NL
        + "NIAGADS.DatasetTopFeatures" + NL
        + "WHERE track = ?" + NL
        + "AND per_chr_rank <= 3" + NL
        + "ORDER BY rank";

    private static final String BUILD_JSON_SQL = "SELECT jsonb_agg(" + NL
        + "jsonb_build_object(" + NL
        + "'hit', hit_display_value," + NL 
        + "'feature_type', hit_type," + NL
        + "'ld_reference_variant', ld_reference_variant," + NL
        + "'chromosome', chromosome," + NL
        + "'start', location_start - ?," + NL
        + "'end', location_end + ?," + NL
        + "'neg_log10_pvalue', neg_log10_pvalue" + NL
        + ") ORDER BY rank)::text AS result" + NL
        + "FROM topFeatures";


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.dataset.top.get-response")
    public Response buildResponse(String body, 
            @QueryParam(DATASET_PARAM) String track,
            @QueryParam(LIMIT_PARAM) int limit,
            @QueryParam(FLANK_PARAM) boolean flank
            ) throws WdkModelException {
 
        LOG.info("Starting 'GWAS Summary Statistics Top Hits' Service");
        String response = null;


        try {

            if (track == null) {
                String messageStr = "Must supply track";
                return Response.status(Response.Status.BAD_REQUEST)
                .entity(new JSONObject().put("missing required parameter: `track`", messageStr))
                .type( MediaType.APPLICATION_JSON)
                .build();
            }
            String isValidTrack = validateTrack(track);
            if (!isValidTrack.equals("true")) {
                String accession = track.split("_", 1)[0];
                String messageStr = isValidTrack.equals("Invalid Accession") ?
                "invalid accession supplied as first part of track" + track + "(" + accession + ")"
                : "invalid track";
                                
                return Response.status(Response.Status.BAD_REQUEST)
                .entity(new JSONObject().put("invalid value: `track`", messageStr).put("valid tracks for this accession (" + accession + ")", isValidTrack.replace('"',' ')))
                .type( MediaType.APPLICATION_JSON)
                .build();
            }
            boolean flankRanges = getRequest().getRequestParamMap().containsKey(FLANK_PARAM);
            LOG.debug(flank + " - " + flankRanges);
            response = lookup(track, limit, flankRanges);       
            // LOG.debug("query result: " + response);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String buildQuery(int limit) {
        String cteSql = (limit > 0) ? TOP_HITS_CTE_SQL + NL + "LIMIT " + limit + NL : TOP_HITS_CTE_SQL;
        String sql = "WITH topFeatures AS (" + NL + cteSql + ")" + NL + BUILD_JSON_SQL;
        return sql;
    }

    private String validateTrack(String track) {
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        String sql = "SELECT CASE WHEN ? = ANY(array_agg(track))" + NL
        + "THEN true ELSE false END AS is_valid_track," + NL
        + "jsonb_agg(track)::text AS valid_tracks" + NL
        + "FROM NIAGADS.TrackAttributes" + NL
        + "WHERE dataset_accession  = split_part(?, '_', 1)";

        SQLRunner runner = new SQLRunner(ds, sql, "validate-track-query");
        runner.executeQuery(new Object[] {track, track}, handler);
        List<Map<String, Object>> results = handler.getResults();
        
        if (results.isEmpty()) {
            return "Invalid Accession";
        }

        Boolean isValidTrack = (Boolean) results.get(0).get("is_valid_track");
        String validTracks = (String) results.get(0).get("valid_tracks");
        if (validTracks == "null" || validTracks == null) {
            return "Invalid Accession";
        }
        else {
            if (isValidTrack) {
                return "true";
            }
            else {
                return validTracks;
            }
        }
    }

    private String lookup(String track, int limit, boolean flankRanges) throws WdkModelException {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        int flank = (flankRanges) ? Integer.parseInt(wdkModel.getProperties().get("FLANK_LOCUSZOOM")) : 0;
        LOG.debug("Flank:" + flank);
        if (flank == 0 && flankRanges) {
            throw new WdkModelException("Need to specify FLANK_LOCUSZOOM in model.prop");
        }

        String sql = buildQuery(limit);
        LOG.debug("SQL: " + sql);
        SQLRunner runner = new SQLRunner(ds, sql, "dataset-top-hits-data-query");
        runner.executeQuery(new Object[] {track, flank, flank}, handler);
        
        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return "[]";
        }

        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null" || resultStr == null) {
            return "[]";
        }

        //LOG.debug("RESULT:  " + resultStr);
        return resultStr;
    }
}
