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


@Path("dataset/reference")
public class DatasetModelRefService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(DatasetModelRefService.class);
    private static final String SEARCH_RECORD_TYPE_PARAM = "record_type";
    private static final String SEARCH_TARGET_TYPE_PARAM = "target_type";
    private static final String SEARCH_TARGET_NAME_PARAM = "target_name";

    private static final String SEARCH_QUERY = "SELECT jsonb_agg(dataset)::text AS result FROM (" + NL
        + "SELECT jsonb_build_object('dataset_id', da.accession, 'name', da.name || ' (' || da.attribution || ')', 'description', da.description) AS dataset" + NL
        + "FROM CBIL.DatasetModelRef dmr," + NL
        + "NIAGADS.DatasetAttributes da" + NL
        + "WHERE record_type = ?" + NL
        + "AND target_type = ?" + NL
        + "AND target_name = ?" + NL
        + "AND da.accession = dmr.accession" + NL
        + "ORDER BY da.accession) a";

    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.search.sitesearch.get-response")
    public Response buildResponse(String body
        , @QueryParam(SEARCH_RECORD_TYPE_PARAM) String recordType
        , @QueryParam(SEARCH_TARGET_TYPE_PARAM) String targetType
        , @QueryParam(SEARCH_TARGET_NAME_PARAM) String targetName ) throws WdkModelException {
        
        LOG.info("Starting 'DatasetModelRef' Service");
        String response = "{}";
        try {
            response = lookupDatasets(recordType, targetType, targetName);
            if (response == null) { response = "{}";}
            LOG.debug("query result: " + response);
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }
    
    private String lookupDatasets(String recordType, String targetType, String targetName) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, SEARCH_QUERY, "site-search-query");
        runner.executeQuery(new Object[] {recordType, targetType, targetName}, handler);
        
        List <Map <String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result");
    }
}
