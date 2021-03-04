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


@Path("locuszoom/recomb")
public class LZRecombinationService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(LZRecombinationService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String LOCATION_START_PARAM = "start";
    private static final String LOCATION_END_PARAM = "end";
    
    private static final String LOOKUP_SQL = "WITH" + NL
        + "bin AS (SELECT find_bin_index(?::text, ?, ?) AS bin_index)" + NL
        + "SELECT jsonb_build_object('data', " + NL
        + "jsonb_build_object(" + NL
        + "'chromosome', jsonb_agg(replace(fs.chromosome, 'chr', '')::text)," + NL
        + "'id', jsonb_agg('HR'::text)," + NL
        + "'pos_cm', jsonb_agg(position_cm ORDER BY location_start ASC)," + NL
        + "'position', jsonb_agg(location_start ORDER BY location_start ASC)," + NL
        + "'recomb_rate', jsonb_agg(score ORDER BY location_start ASC)))::text" + NL
        + "AS result" + NL
        + "FROM Results.FeatureScore fs," + NL
        + "Study.ProtocolAppNode pan," + NL
        + "bin" + NL
        + "WHERE pan.protocol_app_node_id = fs.protocol_app_node_id" + NL
        + "AND pan.source_id = ?" + NL
        + "AND fs.bin_index <@ bin.bin_index" + NL
        + "AND int8range(?, ?, '[]') && int8range(fs.location_start, fs.location_end, '[]')";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.locuszoom.recomb.get-response")
    public Response buildResponse(String body, 
            @QueryParam(CHROMOSOME_PARAM) String chromosome, @QueryParam(LOCATION_END_PARAM) int locEnd,
            @QueryParam(LOCATION_START_PARAM) int locStart) throws WdkModelException {
 
        LOG.info("Starting 'Locus Zoom Recombination Rate' Service");
        String response = null;

        try {
           response = lookup(chromosome, locStart, locEnd);       
            // LOG.debug("query result: " + response);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String lookup(String chromosome, int locationStart, int locationEnd) throws WdkModelException {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String dataset = wdkModel.getProperties().get("LZRECOMBINATION_RATE_DATASOURCE");
        LOG.debug("Datasource:" + dataset);
        if (dataset == null) {
            throw new WdkModelException("Need to specify LZRECOMBINATION_RATE_DATASOURCE in model.prop");
        }

        SQLRunner runner = new SQLRunner(ds, LOOKUP_SQL, "lz-recomb-rate-data-query");
        runner.executeQuery(new Object[] { chromosome, locationStart, locationEnd, dataset, locationStart, locationEnd }, handler);
        
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
