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
import org.json.JSONArray;


@Path("dataset/summary_plot")
public class DatasetSummaryPlotService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(DatasetSummaryPlotService.class);

    private static final String LOOKUP_SQL = "WITH tcounts AS (" + NL
        + "SELECT category_abbrev, category, count(DISTINCT track) AS n_tracks," + NL
        + "CASE WHEN category_abbrev = 'AD/LOAD' THEN 1" + NL
        //+ "WHEN category_abbrev = 'LOAD' THEN 2" + NL
        + "WHEN category_abbrev = 'PSP' THEN 2" + NL
        + "WHEN category_abbrev =  'FTD' THEN 3" + NL
        + "WHEN category_abbrev = 'LBD' THEN 4" + NL
        + "WHEN category_abbrev = 'VBI' THEN 5" + NL
        + "WHEN category_abbrev = 'PD' THEN 6" + NL
        + "WHEN category_abbrev = 'CSF Biomarker' THEN 7" + NL
        + "WHEN category_abbrev = 'Other Neuropathology' THEN 8" + NL
        + "END AS sort_order" + NL
        + "FROM NIAGADS.NeuropathologyTrackCategories" + NL
        + "GROUP BY category_abbrev, category)" + NL
        + "SELECT jsonb_agg(('[" + '"' + "' || CASE WHEN category_abbrev = 'Other Neuropathology' THEN 'Other ADRD' ELSE category_abbrev END || '" + '"' + ",' || n_tracks::text || '," + '"' + "' || category || '" + '"' + "]')::jsonb ORDER BY sort_order)::text AS series_json" + NL
        + "FROM tcounts";

    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.dataset.lookup.get-response")
    public Response buildResponse(String body) throws WdkModelException {
        
        LOG.info("Starting 'DatasetLookup' Service");
        JSONArray response = null;
        try {
            response = lookup();
            if (response == null) { response = new JSONArray();}
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }
    
    private JSONArray lookup() {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, LOOKUP_SQL, "dataset-summary-plot-lookup-query");
        runner.executeQuery(handler);
        
        List <Map <String, Object>> results = handler.getResults();
       
        
        if (!results.isEmpty()) {
            LOG.debug(results.get(0).get("series_json"));
            return new JSONArray((String) results.get(0).get("series_json"));
        }
        return null;
    }
}
