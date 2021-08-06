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
    + "FROM matches WHERE category = ?";

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

    private String buildQuery(Boolean mscOnly, Boolean adspQC) {
        String lookupCTE = "annotations AS (SELECT" + NL
            + "jsonb_build_object(d.search_term," + NL
            + MSC_ONLY_JSON_OBJECT + NL;
        
        if (!mscOnly) {
            lookupCTE = lookupCTE + " || " + FULL_VEP_JSON_OBJECT + NL;
        }

        if (adspQC) {
            lookupCTE = lookupCTE + " || " + ADSP_QC_JSON_OBJECT + NL;
        }

        lookupCTE = lookupCTE + ") AS annotation_json" + NL
        + "FROM AnnotatedVDB.Variant v, vdetails d" + NL 
        + "WHERE left(v.metaseq_id, 50) = d.indexed_metaseq_id" + NL 
        + "AND (v.ref_snp_id = d.ref_snp_id OR d.ref_snp_id IS NULL)" + NL 
        + "AND v.chromosome = d.chrm)";
        /* + "UNION ALL SELECT" + NL
        + "jsonb_build_object(search_term, '{}'::jsonb) AS annotation_json" + NL
        + "FROM unmappedVariants) "; */

        String sql = "WITH" + NL 
            + VARIANT_ID_CTE + "," + NL 
            + VARIANT_DETAILS_CTE + "," + NL 
            + MISSING_VARIANTS_CTE + "," + NL
            + lookupCTE + NL
            + "SELECT jsonb_build_object(" + NL
            + "'paging', jsonb_build_object(" + NL 
            + "'page'," + getCurrentPageDisplay() + "," + NL
            + "'total_pages'," + getNumPages() + ")," + NL
            + "'unmapped_variants', (SELECT json_agg(search_term) FROM unmappedVariants)," + NL
            + "'result', jsonb_object_agg(t.k, t.v)" + NL
            + ")::text AS result" + NL            
            + "FROM annotations, jsonb_each(annotation_json) AS t(k,v)";
            
            
        // LOG.debug(sql);

        return sql;
    }

    private String lookup(String term, String category) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        // LOG.debug("Fetching details for variant:" + variant);
        // LOG.debug(buildQuery());
        SQLRunner runner = new SQLRunner(ds, buildQuery(term, category), "variant-lookup-query");

        runner.executeQuery(new Object[] { term, category }, handler);

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