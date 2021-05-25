package org.niagads.genomics.service.services.Variant;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.gusdb.wdk.service.service.AbstractWdkService;

/**
 * performs LD expansion on one or more variants; expects metaseq_ids, record_pk, or rsids
 * provides no filter on MAF or r2 at this time
 * @author ega
 */

@Path("variant/gwas/hits")
public class VariantGWASHitsService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(VariantGWASHitsService.class);

    private static final String VARIANT_PARAM = "id"; 
    private static final String PVALUE_PARAM="pvalueCutoff";

    private static final String DEFAULT_PVALUE_CUTOFF = "0.001";

    private static final String VARIANT_ID_CTE = "ids AS(" + NL
        + "SELECT search_term, variant_primary_key AS pk" + NL
        + "FROM get_variant_primary_keys(?, FALSE))";

   
    private static final String HITS_CTE = "Hits AS (" + NL
        + "SELECT ids.search_term," + NL
        + "h.neg_log10_pvalue," + NL
        + "jsonb_build_object(" + NL
        + "'matched_variant', jsonb_build_object(" + NL
        + "'genomicsdb_id', h.variant_record_primary_key," + NL
        + "'metaseq_id', h.metaseq_id," + NL 
        + "'ref_snp_id', h.ref_snp_id)) AS variant_json," + NL
        + "jsonb_build_object('dataset_id', ta.track, 'name'," + NL
        + "ta.name, 'description', ta.description," + NL
        + "'metadata', jsonb_build_object('tba', 'coming soon')) AS track_info," + NL
        + "jsonb_build_object(" + NL
        + "'track', ta.track," + NL
        + "'test_allele', h.test_allele," + NL
        + "'neg_log10_pvalue', h.neg_log10_pvalue::numeric," + NL
        + "'pvalue', h.pvalue_display) AS result_json" + NL
        + "FROM NIAGADS.VariantGWASTopHits h, ids," + NL
        + "NIAGADS.TrackAttributes ta" + NL
        + "WHERE ids.pk = h.variant_record_primary_key" + NL
        + "AND ta.track = h.dataset_id" + NL
        + "AND h.neg_log10_pvalue >= (-1 * log(?)))";

    private static final String AGG_HITS_CTE = "AggHits AS (SELECT" + NL
        + "jsonb_build_object(search_term," + NL
        + "variant_json || jsonb_build_object(" + NL
        + "'hits', json_agg(result_json ORDER BY neg_log10_pvalue DESC))) AS agg_hits" + NL
        + "FROM hits" + NL
        + "GROUP BY search_term, variant_json)";

    private static final String TRACK_CTE = "Tracks AS (" + NL
        + "SELECT DISTINCT jsonb_object_agg(" + NL
        + "track_info->>'dataset_id', track_info) AS track_json" + NL
        + "FROM hits)";

    private static final String RESULT_CTE = "Result AS (" + NL
        + "SELECT jsonb_object_agg(t.k, t.v) AS result_json" + NL
        + "FROM agghits," + NL
        + "jsonb_each(agg_hits) AS t(k,v))";
 

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(VARIANT_PARAM) String variants,
        @DefaultValue(DEFAULT_PVALUE_CUTOFF)@QueryParam(PVALUE_PARAM) Double pvalueCutoff) throws WdkModelException {
                                      
        LOG.info("Starting 'Variant LD Expansion' Service");
        
        String response = "{}";

        try {
            response = lookup(variants, pvalueCutoff);    
        }

        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
          
        return Response.ok(response).build();
    }


    private String buildQuery() {
        String sql = "WITH" + NL 
        + VARIANT_ID_CTE + "," + NL 
        + HITS_CTE + "," + NL
        + AGG_HITS_CTE + "," + NL
        + TRACK_CTE + "," + NL
        + RESULT_CTE + NL
        + "SELECT jsonb_build_object(" + NL
        + "'tracks', t.track_json," + NL
        + "'result', r.result_json," + NL
        + "'search_parameters', jsonb_build_object(" + NL
        + "'submitted_variants', ?," + NL
        + "'pvalueCutoff', trim(to_char(?, '9.99EEEE'))))::text AS result"  + NL
        + "FROM Result r, Tracks t";
        
        LOG.debug(sql);
        return sql;
    }

    private String lookup(String variants, Double pvalueCutoff) {   
    
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        
        SQLRunner runner = new SQLRunner(ds, buildQuery(), "variant-gwas-hits-query");

        //   bind parameters  id, maf, maf, rsq, protocolappnode, rsq, maf, pop, id
        runner.executeQuery(new Object[] {variants, pvalueCutoff, variants, pvalueCutoff}, handler);

        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return "{}";
        }

        String resultStr = (String) results.get(0).get("result");
        //LOG.debug("RESULT:  " + resultStr);
        return resultStr;
    }

    


}
