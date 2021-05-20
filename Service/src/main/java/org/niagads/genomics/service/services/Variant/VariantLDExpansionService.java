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
import org.gusdb.fgputil.db.runner.SingleLongResultSetHandler;
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

@Path("variant/linkage/expansion")
public class VariantLDExpansionService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(VariantLDExpansionService.class);

    private static final String VARIANT_PARAM = "id"; 
    private static final String POPULATION_PARAM = "population";
    private static final String MAF_PARAM="minMaf";
    private static final String RSQ_PARAM="minRsq";

    private static final String DEFAULT_POPULATION = "EUR";
    private static final String DEFAULT_MAF = "0.0";
    private static final String DEFAULT_RSQ = "0.2";

    private static final String VARIANT_ID_CTE = "ids AS(" + NL
        + "SELECT search_term, variant_primary_key AS source_id" + NL
        + "FROM get_variant_primary_keys(?))";

    private static final String VARIANT_DETAILS_CTE = "variant AS (" + NL
        + "SELECT DISTINCT search_term, source_id," + NL
        + "'chr' || split_part(source_id, ':', 1)::text AS chromosome," + NL
        + "split_part(source_id, '_', 1) AS metaseq_id," + NL
        + "split_part(source_id, ':', 2)::integer AS position," + NL
        + "CASE WHEN split_part(source_id, '_', 2) IS NULL" + NL
        + "THEN split_part(source_id, '_', 1)" + NL
        + "ELSE split_part(source_id, '_', 2) END AS pattern," + NL
        + "split_part(source_id, '_', 2) AS ref_snp_id" + NL
        + "FROM ids)";

    private static final String PARAM_SUMMARY_CTE = "searchParams AS (" + NL
        + "SELECT source_id, chromosome, position, pattern, search_term," + NL
        + "jsonb_build_object(" + NL
        + "'genomicsdb_id', v.source_id," + NL
        + "'ref_snp_id', v.ref_snp_id," + NL
        + "'metaseq_id', v.metaseq_id) AS matched_variant" + NL
        + "FROM Variant v)";

    private static final String FULL_LD_RESULT_CTE = "LDResult AS (" + NL
        + "SELECT v.search_term, v.chromosome, v.position," + NL
    
        + "CASE WHEN r.variants[1] = v.pattern" + NL
        + "THEN r.minor_allele_frequency[1]" + NL
        + "ELSE r.minor_allele_frequency[2] END AS maf," + NL
    
        + "CASE WHEN r.minor_allele_frequency[1]::numeric >= ? AND r.minor_allele_frequency[2]::numeric >= ?" + NL
        + "THEN TRUE ELSE FALSE END AS passes_maf_filter," + NL
    
        + "CASE WHEN r.r_squared >= ?" + NL 
        + "THEN TRUE ELSE FALSE END AS passes_rsquared_filter," + NL
    
        + "r.r_squared," + NL
    
        + "jsonb_build_object(" + NL
        + "'linked_variant', CASE WHEN r.variants[1] = v.pattern THEN r.variants[2] ELSE r.variants[1] END," + NL
        + "'location', replace(v.chromosome, 'chr', '')::text || (CASE WHEN r.variants[1] = v.pattern THEN r.locations[2] ELSE r.locations[1] END)::text," + NL
        + "'maf', CASE WHEN r.variants[1] = v.pattern THEN r.minor_allele_frequency[2]::numeric ELSE r.minor_allele_frequency[1]::numeric END," + NL
        + "'distance', r.distance," + NL
        + "'r_squared', r.r_squared::numeric," + NL
        + "'d_prime', r.d_prime::numeric) AS linkage_json" + NL
        + "FROM Results.VariantLD r, SearchParams v" + NL
        + "WHERE r.variants @> ARRAY[v.pattern]" + NL
        + "AND r.population_protocol_app_node_id = ?)";

    private static final String FILTERED_AGG_RESULT_CTE = "AggResult AS (" + NL
        + "SELECT v.search_term," + NL
        + "jsonb_build_object('ld_expansion', jsonb_agg(r.linkage_json ORDER BY r_squared DESC)," + NL
        + "'matched_variant', " + NL
        + "v.matched_variant || jsonb_build_object('maf', r.maf)) AS linkage_json" + NL
        + "FROM LDResult r, SearchParams v" + NL
        + "WHERE v.search_term = r.search_term" + NL
        + "AND r.passes_maf_filter" + NL
        + "AND r.passes_rsquared_filter" + NL
        + "GROUP BY v.matched_variant, r.maf, v.search_term)";

    private static final String INDEXED_RESULT_CTE = "indexedResult AS (SELECT" + NL
        + "jsonb_build_object(v.search_term," + NL
        + "CASE WHEN linkage_json IS NULL" + NL
        + "THEN jsonb_build_object('matched_variant', v.matched_variant, 'ld_expansion', '[]')" + NL
        + "ELSE linkage_json END) AS linkage_json_obj" + NL
        + "FROM SearchParams v LEFT OUTER JOIN AggResult r" + NL
        + "ON v.search_term = r.search_term)";
    
    private static final String AGG_INDEXED_RESULT_CTE = "aggIndexedResult AS (" + NL
        + "SELECT jsonb_object_agg(t.k, t.v) AS agg_json" + NL
        + "FROM indexedResult," + NL
        + "jsonb_each(linkage_json_obj) AS t(k,v))"; 

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(VARIANT_PARAM) String variants,
        @DefaultValue(DEFAULT_POPULATION)@QueryParam(POPULATION_PARAM) String population,
        @DefaultValue(DEFAULT_MAF)@QueryParam(MAF_PARAM) Double mafFilter, 
        @DefaultValue(DEFAULT_RSQ)@QueryParam(RSQ_PARAM) Double rsqFilter) throws WdkModelException {
                                      
        LOG.info("Starting 'Variant LD Expansion' Service");
        
        String response = "{}";

        try {
            long protocolAppNodeId = getPopulationProtocolAppNode(population);
            response = lookup(variants, population, mafFilter, rsqFilter, protocolAppNodeId);    
        }

        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
          
        return Response.ok(response).build();
    }


    private String buildQuery() {
        String sql = "WITH" + NL 
        + VARIANT_ID_CTE + "," + NL 
        + VARIANT_DETAILS_CTE + "," + NL 
        + PARAM_SUMMARY_CTE + "," + NL
        + FULL_LD_RESULT_CTE + "," + NL
        + FILTERED_AGG_RESULT_CTE + "," + NL
        + INDEXED_RESULT_CTE + "," + NL
        + AGG_INDEXED_RESULT_CTE + NL
      
        + "SELECT jsonb_build_object(" + NL
        + "'search_parameters', jsonb_build_object(" + NL
        + "'minRsq', ?," + NL
        + "'minMaf', ?," + NL
        + "'population', ?," + NL
        + "'submitted_variants', ?)," + NL
        + "'result', r.agg_json)::text AS result" + NL
        + "FROM AggIndexedResult r";

        LOG.debug(sql);
        return sql;
    }

    private String lookup(String variants, String population, double mafFilter, double rsqFilter, long popProtocolAppNodeId) {   
    
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        
        SQLRunner runner = new SQLRunner(ds, buildQuery(), "ld-expansion-query");

        //   bind parameters  id, maf, maf, rsq, protocolappnode, rsq, maf, pop, id
        runner.executeQuery(new Object[] {variants, mafFilter, mafFilter, rsqFilter, popProtocolAppNodeId, rsqFilter, mafFilter, population, variants}, handler);

        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return "{}";
        }

        String resultStr = (String) results.get(0).get("result");
     
        //LOG.debug("RESULT:  " + resultStr);
        return resultStr;
    }

    private long getPopulationProtocolAppNode(String population) throws WdkModelException {

        DataSource ds = getWdkModel().getAppDb().getDataSource();
        String sql = "SELECT protocol_app_node_id FROM Study.ProtocolAppNode WHERE source_id = '1000GenomesLD_" + population + "'";
        long result = new SQLRunner(ds, sql, "lz-linkage-pop-lookup").executeQuery(new SingleLongResultSetHandler())
        .orElseThrow(() -> new WdkModelException("No match found for the population: " + population));

        return result;
    }


}
