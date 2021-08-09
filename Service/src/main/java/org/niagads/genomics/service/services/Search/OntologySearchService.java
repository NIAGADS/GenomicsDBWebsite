package org.niagads.genomics.service.services.Search;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.json.JSONObject;
import org.gusdb.wdk.service.service.AbstractWdkService;


@Path("dictionary")
public class OntologySearchService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(OntologySearchService.class);

    private static final String TERM_PARAM = "term";
    private static final String CATEGORY_PARAM = "category";

    private static final String SEARCH_QUERY = "WITH st AS (SELECT TRIM(?) AS term)," + NL
    + "matches AS (" + NL
    + "SELECT * FROM ontology_text_search((SELECT term FROM st))" + NL
    + "ORDER BY match_rank, record_type, display ASC)" + NL
    + "SELECT jsonb_agg(matches)::text AS result" + NL
    + "FROM matches";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.get-response")
    public Response buildResponse(@Context HttpServletRequest request, 
            String body, @QueryParam(CATEGORY_PARAM)@DefaultValue("any") String category, 
            @QueryParam(TERM_PARAM) String term) throws WdkModelException {

        LOG.info("Starting 'Ontology Term Lookup' Service");

        String response = "{}";
        try {
            if (term == null) {
                String messageStr = "must supply term to lookup";
                return Response.status(Response.Status.BAD_REQUEST)
                .entity(new JSONObject().put("missing required parameter: `term`", messageStr))
                .type( MediaType.APPLICATION_JSON)
                .build();
            }

            response = lookup(term, category);

            if (response == null) {
                response = "{}";
            }
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

  

    private String lookup(String term, String category) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = SEARCH_QUERY;

        if (!category.equals("any")) {
            sql += NL + "WHERE category = ?";
        }
        
        SQLRunner runner = new SQLRunner(ds, sql, "ontology-term-lookup-query");

        if (!category.equals("any")) {
            runner.executeQuery(new Object[] { term, category }, handler);
        }
        else {
            runner.executeQuery(new Object[] { term }, handler);
        }

        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return "{}";
        }
        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null" || resultStr == null) {
            return "{}";
        }
        return resultStr;
    }

}