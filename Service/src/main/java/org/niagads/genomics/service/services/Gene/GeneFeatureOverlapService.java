package org.niagads.genomics.service.services.Gene;

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

@Path("gene/annotation/overlaps")
public class GeneFeatureOverlapService extends AbstractWdkService { 
    private static final Logger LOG = Logger.getLogger(GeneFeatureOverlapService.class);

    private static final String GENE_PARAM = "id";
    private static final String AD_ONLY_PARAM = "adRelevantOnly";

    private static final String TRACK_LOOKUP_SQL = "WITH gene AS (" +NL 
        + "SELECT ga.gene_id, ga.source_id, ga.gene_symbol," + NL
        + "ga.chromosome || ':' || ga.location_start || '-' || ga.location_end AS span" +NL 
        + "FROM gene_text_search(?) r, CBIL.GeneAttributes ga" +NL 
        + "WHERE ga.source_id = r.primary_key LIMIT 1)," + NL
        + "hits AS (" + NL
        + "SELECT filer_track_id, count(gene_feature_overlap_id) AS n_hits" + NL
        + "FROM Results.GeneFeatureOverlap" + NL
        + "WHERE gene_id = (SELECT gene_id FROM Gene)" + NL
        + "GROUP BY filer_track_id)," + NL
        + "annotated_hits AS (" + NL
        + "SELECT jsonb_build_object(" + NL
        + "'track', pan.source_id," + NL
        + "'number_hits', hits.n_hits," + NL
        + "'track_name', pan.name," + NL
        + "'track_info', jsonb_build_object(" + NL
        + "'assay', pan.track_summary->>'assay'," + NL
        + "'biosample', jsonb_build_object('term', pan.track_summary->'biosample'->>'term', 'term_id', pan.track_summary->'biosample'->>'term_id')," + NL
        + "'original_data_source', pan.track_summary->>'data_source')) AS hit_details" + NL
        + "FROM Study.ProtocolAppNode pan, hits" + NL
        + "WHERE hits.filer_track_id = pan.source_id" + NL
        + "ORDER BY n_hits DESC)," + NL
        + "agg_hits AS (SELECT jsonb_agg(hit_details) AS result FROM annotated_hits)" + NL
        + "SELECT jsonb_build_object(" + NL
        + "'search_parameters', jsonb_build_object('id', ?)," + NL
        + "'matched_gene', jsonb_build_object(" + NL
        + "'ensembl_id', gene.source_id," + NL
        + "'symbol', gene.gene_symbol," + NL
        + "'location', gene.span)," + NL
        + "'overlapping_tracks', agg_hits.result)::text AS result" + NL
        + "FROM gene, agg_hits";


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.get-response")
    public Response buildResponse(@Context HttpServletRequest request, 
            String body, @QueryParam(AD_ONLY_PARAM) Boolean adOnly, 
            @QueryParam(GENE_PARAM) String gene) throws WdkModelException {

        LOG.info("Starting 'Gene Feature Overlap' Service");

        adOnly = validateBooleanParam(request, AD_ONLY_PARAM);

        LOG.debug("adOnly: " + adOnly); // not provided: null, provided: false, 

        String response = "{}";
        try {
            if (gene == null) {
                String messageStr = "must supply a gene to the id parameter; acceptable ids are Official Gene Symbol, NCBI (Entrez) Gene ID, Ensembl ID";
                return Response.status(Response.Status.BAD_REQUEST)
                .entity(new JSONObject().put("missing required parameter: `id`", messageStr))
                .type( MediaType.APPLICATION_JSON)
                .build();
            }
            
            response = lookup(gene);

            if (response == null) {
                response = "{}";
            }
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    
    private Boolean validateBooleanParam(HttpServletRequest request, String param) {
        if (!request.getParameterMap().containsKey(param)) {
            return false;
        }

        String paramValue = request.getParameterValues(param)[0];
        if (paramValue == "") {
            return true;
        }
        else {
            return Boolean.valueOf(paramValue);
        }
    }    


    private String lookup(String gene) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        // LOG.debug("Fetching details for variant:" + variant);
        // LOG.debug(buildQuery());
        SQLRunner runner = new SQLRunner(ds, TRACK_LOOKUP_SQL, "gene-feature-overlap-lookup-query");

        runner.executeQuery(new Object[] { gene, gene }, handler);

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
