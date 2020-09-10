package org.niagads.genomics.service.services.Manhattan;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import java.util.stream.Stream;

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
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@Path("manhattan/iplot")
public class InteractivePlotService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(InteractivePlotService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String TRACK_PARAM = "track";

    private static final String DATA_QUERY = "SELECT series::text AS series" + NL
            + "FROM NIAGADS.TrackManhattan WHERE track = ? AND chromosome = ?";

    private static final String[] CHROMOSOME_LIST = Stream
            .of(Arrays.stream(IntStream.range(1, 22).toArray()).mapToObj(String::valueOf).toArray(String[]::new),
                    new String[] { "X", "Y", "M" })
            .flatMap(Stream::of).toArray(String[]::new);

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.manhattan.iplot.get-response")
    public Response buildResponse(String body, @QueryParam(TRACK_PARAM) String track,
            @QueryParam(CHROMOSOME_PARAM) String chromosome) throws WdkModelException {
        LOG.info("Starting 'Manhattan Interactive Plot' Service");
        String response = "{}";

        try {
            // query database
            if (chromosome.equals("all")) {
                response = fetchAllSeries(track);
            } else {
                response = fetchSeries(track, chromosome);
            }
            LOG.debug("query result: " + response);
            // return result
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String fetchAllSeries(String track) throws WdkModelException {
        JSONParser parser = new JSONParser();
        JSONArray result = new JSONArray();
        try {
            for (String chr : CHROMOSOME_LIST) {
                LOG.debug(track + ":" + chr);
                String series = fetchSeries(track, chr);
                if (series != null) {
                    JSONArray seriesJson = (JSONArray) parser.parse(series);
                    result.addAll(seriesJson);
                }
            }
        } catch (ParseException ex) {
            throw new WdkModelException(ex);
        }

        return result.toString();
    }

    private String fetchSeries(String track, String chromosome) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, DATA_QUERY, "manhattan-iplot-data-query");
        runner.executeQuery(new Object[] { track, chromosome }, handler);

        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return null;
        }
        return (String) results.get(0).get("series");
    }

}