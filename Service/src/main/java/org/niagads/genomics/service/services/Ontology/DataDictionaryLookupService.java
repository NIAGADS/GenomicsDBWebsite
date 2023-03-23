package org.niagads.genomics.service.services.Ontology;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.ArrayList;
import java.util.Arrays;
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
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.json.JSONObject;

import org.gusdb.wdk.service.service.AbstractWdkService;


@Path("ndd")
public class DataDictionaryLookupService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(DataDictionaryLookupService.class);

    private static final String CATEGORY_PARAM = "category";

    private static final String CATEGORY_VALIDATION_SQL = "SELECT DISTINCT parent_term AS result" + NL 
        + " FROM NIAGADS.DataDictionaryTerms WHERE parent_term = ?";

    private static final String SEARCH_QUERY_BASE = "SELECT jsonb_object_agg(parent_term, term)::text AS result" + NL
        + " FROM (SELECT" + NL
        + "parent_term," + NL
        + "json_agg(jsonb_build_object('term', display_value, 'source_id', source_id, 'definition', definition)) as term" + NL
        + "FROM NIAGADS.DataDictionaryTerms" + NL
        + " WHERE parent_term IN (?)" + NL
        + "GROUP BY parent_term) a";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.get-response")
    public Response buildResponse(@Context HttpServletRequest request, 
            String body, @QueryParam(CATEGORY_PARAM)@DefaultValue("any") String category) throws WdkModelException {

        LOG.info("Starting 'Ontology Term Lookup' Service");

        String response = "{}";
        try {
            if (category == null) {
                String messageStr = "; must supply annotation category (can be comma separated list)";
                return Response.status(Response.Status.BAD_REQUEST)
                .entity(new JSONObject().put("ERROR: missing required parameter: `category`", messageStr))
                .type( MediaType.APPLICATION_JSON)
                .build();
            }

            if (category.equals("biosample")) {
                category = "cell,cell line,tissue";
            }
            else if (!category.equals("cell line")) { // temporary

            JSONObject categoryValidation = validateCategory(category);
            LOG.debug(categoryValidation.toString());
            if (categoryValidation.getString("pass").equals("false")) {
                String messageStr = categoryValidation.getString("invalid");
                return Response.status(Response.Status.BAD_REQUEST)
                .entity(new JSONObject().put("ERROR: invalid parameter value for: `category`", messageStr))
                .type( MediaType.APPLICATION_JSON)
                .build();
            }

        }


            response = lookup(category);

            if (response == null) {
                response = "{}";
            }
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

  
    private JSONObject validateCategory(String category) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String[] categories = category.split(",");   
  
      
        ArrayList<String> invalidCategories = new ArrayList<String>();
        
        for (String c: categories) {
            SQLRunner runner = new SQLRunner(ds, CATEGORY_VALIDATION_SQL, "ontology-category-validation");
            runner.executeQuery(new Object[] { c }, handler);
            List<Map<String, Object>> results = handler.getResults();
            if (results.isEmpty()) {
                invalidCategories.add(c);
            }
            else {
                String resultStr = (String) results.get(0).get("result");
                if (resultStr == "null" || resultStr == null) {
                    invalidCategories.add(c);
                }
            }
        }

        JSONObject status = new JSONObject();
        
        if (invalidCategories.size() > 0) {
            status.put("invalid", invalidCategories.toString());
            status.put("pass", "false");
        }
        else {
            status.put("pass", "true");
        }

        return status;
    }

    private String lookup(String category) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = SEARCH_QUERY_BASE;
        List<String> categoryList = new ArrayList<String>(Arrays.asList(category.split(",")));
        String categories = categoryList.stream()
            .map(term -> term.replaceAll("'", "''"))
            .collect(Collectors.joining("', '"));

        SQLRunner runner = new SQLRunner(ds, sql, "ontology-term-lookup-query");


        runner.executeQuery(new Object[] { categories }, handler);
    
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