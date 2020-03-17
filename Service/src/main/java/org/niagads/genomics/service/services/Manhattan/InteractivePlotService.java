package org.niagads.genomics.service.services.Manhattan;

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
import org.gusdb.fgputil.db.runner.SingleLongResultSetHandler;

import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.gusdb.wdk.service.service.AbstractWdkService;
import org.json.JSONObject;

@Path("manhattan/iplot")
public class InteractivePlotService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(InteractivePlotService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String TRACK_PARAM = "track";
  

    private static final String DATA_QUERY = "SELECT series::text AS series" + NL
            + "FROM NIAGADS.TrackManhattan WHERE track = ? AND chromosome = ?";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.manhattan.iplot.get-response")
    public Response buildResponse(String body, @QueryParam(TRACK_PARAM) String track,
            @QueryParam(CHROMOSOME_PARAM) String chromosome) throws WdkModelException {
        LOG.info("Starting 'Manhattan Interactive Plot' Service");
        String response = "{}";

        try {
            // query database 
            response = fetchSeries(track, chromosome);
            LOG.debug("query result: " + response);
            // return result
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String fetchSeries(String track, String chromosome) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();


        SQLRunner runner = new SQLRunner(ds, DATA_QUERY, "manhattan-iplot-data-query");
        runner.executeQuery(new Object[] {track, chromosome }, handler);

        List<Map<String, Object>> results = handler.getResults();
        return (String) results.get(0).get("series");
    }

}