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
    private static final String RECORD_CLASS_PARAM = "record";
    private static final String CATEGORY_PARAM = "category";

    private static final String SEARCH_QUERY = "SELECT jsonb_agg(jsonb_build_object(" + NL
            + "'record_class', ds.record_class," + NL
            + "'category', ds.website_category," + NL
            + "'name', d.name," + NL
            + "'release_date', r.release_date," + NL
            + "'version', r.version," + NL
            + "'download_url', r.download_url," + NL
            + "'resource_url', r.id_url," + NL
            + "'description' , r.description))::text AS result" + NL
            + "FROM NIAGADS.WebsiteDatasources ds," + NL
            + "SRes.ExternalDatabase d," + NL
            + "SRes.ExternalDatabaseRelease r" + NL
            + "WHERE ds.external_database_release_id = r.external_database_release_id" + NL
            + "AND r.external_database_id = d.external_database_id" + NL
            + "AND ds.record_class = ?" + NL
            + "AND ds.website_category = ?";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.search.sitesearch.get-response")
    public Response buildResponse(String body, @QueryParam(RECORD_CLASS_PARAM) String recordClass,
            @QueryParam(CATEGORY_PARAM) String category) throws WdkModelException {

        LOG.info("Starting 'DatasetModelRef' Service");
        String response = "{}";
        try {
            response = lookup(recordClass, category);
            if (response == null) {
                response = "{}";
            }
            LOG.debug("query result: " + response);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String lookup(String recordClass, String category) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        // LOG.debug("resource query: " + SEARCH_QUERY);
        
        SQLRunner runner = new SQLRunner(ds, SEARCH_QUERY, "site-datasource-lookup-query");
        runner.executeQuery(new Object[] { recordClass, category }, handler);

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
