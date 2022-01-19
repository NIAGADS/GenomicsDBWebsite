package org.niagads.genomics.service.services.Ontology;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.ArrayList;
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

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.json.JSONObject;
import org.gusdb.wdk.service.service.AbstractWdkService;

@Path("ndd/validate")
public class DataDictionaryValidationService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(DataDictionaryValidationService.class);

    private static final String TERM_PARAM = "term";
    private static final String ID_PARAM = "id";
    private static final String SEARCH_QUERY = "WITH st AS (" + NL
            + "SELECT regexp_replace(TRIM(?), ' +', ' ', 'g') AS term" + NL // replace extra internal spaces
            + ")," + NL
            + "matches AS (" + NL
            + "SELECT * FROM data_dict_validate((SELECT term FROM st)))" + NL
            + "SELECT (jsonb_agg(matches)->0)::text AS result" + NL
            + "FROM matches";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.get-response")
    public Response buildResponse(@Context HttpServletRequest request,
            String body, @QueryParam(ID_PARAM) String termSourceId,
            @QueryParam(TERM_PARAM) String term) throws WdkModelException {

        LOG.info("Starting 'Data Dictionary Validation' Service");

        String response = "{}";
        try {
            List<String> missingParams = new ArrayList<>();
            if (term == null) {
                missingParams.add("`term`");
            }
            if (termSourceId == null) {
                missingParams.add("`id`");
            }
            if (!missingParams.isEmpty()) {
                String messageStr = "must supply term and id to lookup";
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new JSONObject().put(
                                "missing required parameter(s): " + StringUtils.join(missingParams, ", "), messageStr))
                        .type(MediaType.APPLICATION_JSON)
                        .build();
            }

            response = validateTerm(term, termSourceId);

            if (response == null) {
                response = "{}";
            }
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String validateTerm(String term, String termSourceId) {
        JSONObject response = new JSONObject();
        String termResult = lookup(term);
        String idResult = lookup(termSourceId);

        /*
         cases:
         - both valid but not equal
         - term valid / id is not valid
         - term is not valid / id valid
         - both invalid
        */

        JSONObject trJson = (termResult != null) ? new JSONObject(termResult) : new JSONObject();
        JSONObject irJson = (idResult != null) ? new JSONObject(idResult) : new JSONObject();
        response.put("matched_term", trJson);
        response.put("matched_id", irJson);

        String suggestedTerm = suggestedTerm(term, trJson);
        response.put("lookup_value", suggestedTerm);

        if (termResult != null && idResult != null) { // both valid
            if (idTermMatch(trJson, irJson)) {
                response.put("result", "SUCCESS");
                response.put("valid_term", true);
                response.put("valid_id", true);
            } else { // mismatch
                response.put("message", "ID does not match submitted ontology term.");
                response.put("result", "MISMATCH");
                response.put("valid_term", true);
                response.put("valid_id", true);
            }
        }

        else if (idResult != null && termResult == null) { // only id invalid
            response.put("message", "ID Valid, but unable to match term.");
            response.put("result", "PARTIAL");
            response.put("valid_term", true);
            response.put("valid_id", false);
        }

        else if (idResult == null && termResult != null) { // only term invalid
            response.put("message", "Term valid, but unable to match ID.");
            response.put("result", "PARTIAL");
            response.put("valid_term", true);
            response.put("valid_id", false);
        }

        else if (idResult == null && termResult == null) { // both invalid
            response.put("message", "Unable to match term or ID");
            response.put("result", "FAIL");
            response.put("valid_term", false);
            response.put("valid_id", false);
        }

        return response.toString();
    }

    private Boolean idTermMatch(JSONObject tJson, JSONObject iJson) {
        if (tJson.length() == 0 || iJson.length() == 0) {
            return false;
        }

        return tJson.getString("ontology_term_id").equals(iJson.getString("ontology_term_id"));
    }


    private String suggestedTerm(String term, JSONObject rJson) {
        if (rJson.length() > 0) {  
            String matchedTerm = rJson.getString("ontology_term");
            return matchedTerm;
        }
        return null;
    }

    private String lookup(String value) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = SEARCH_QUERY;

        SQLRunner runner = new SQLRunner(ds, sql, "ndd-validator-lookup-query");

        runner.executeQuery(new Object[] { value }, handler);

        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return null;
        }
        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null" || resultStr == null) {
            return null;
        }
        return resultStr;
    }

}