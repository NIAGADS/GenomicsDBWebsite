package org.niagads.genomics.service.services.Search;

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

@Path("search/site")
public class SiteSearchService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(SiteSearchService.class);
    private static final String SEARCH_TERM_PARAM = "term";
    
    private static final String SEARCH_QUERY = "WITH st AS (SELECT replace(?, ':', '_')::text AS term)," + NL
    + "matches AS (SELECT source_id AS primary_key," + NL
    + "gene_symbol AS display," + NL 
    + "CASE WHEN source_id @@ to_tsquery((SELECT term FROM st) || ':*') THEN source_id" + NL 
    + "WHEN gene_symbol @@ to_tsquery((SELECT term FROM st) || ':*') THEN gene_symbol" + NL
    + "WHEN (annotation->>'name')::text @@ to_tsquery((SELECT term FROM st) || ':*') THEN (annotation->>'name')::text" + NL
    + "ELSE 'EntrezID:' || (annotation->>'entrez_id')::text END AS matched_term," + NL
    + "'gene' AS record_type," + NL
    + "2 AS match_rank" + NL
    + "FROM CBIL.GeneAttributes WHERE source_id || ' ' ||  gene_symbol || ' ' || (annotation->>'entrez_id')::text || (annotation->>'name')::text" + NL 
    + "ILIKE '%' || (SELECT term FROM st) || '%'" + NL
    
    + "UNION ALL" + NL
    
    + "SELECT v.record_pk AS primary_key," + NL 
    + "CASE WHEN v.source_id IS NOT NULL THEN v.source_id" + NL
    + "WHEN length(split_part(v.record_pk, '_', 1)) > 30 THEN substr(split_part(v.record_pk, '_', 1), 0, 27) ELSE split_part(v.record_pk, '_', 1) END AS display," + NL
    + "replace(mv.term, '_', ':') AS matched_term," + NL
    + "'variant' AS record_type," + NL
    + "1 AS match_rank" + NL
    + "FROM NIAGADS.Variant v," + NL
    + "(SELECT st.term, find_variant_primary_key(replace(replace(st.term, '_', ':'), '/', ':')) AS record_pk FROM st) mv" + NL
    + "WHERE v.record_pk = mv.record_pk" + NL
    
    + "UNION ALL" + NL
    
    + "SELECT v.record_pk AS primary_key," + NL 
    + "CASE WHEN v.source_id IS NOT NULL THEN v.source_id" + NL
    + "WHEN length(split_part(v.record_pk, '_', 1)) > 30 THEN substr(split_part(v.record_pk, '_', 1), 0, 27) ELSE split_part(v.record_pk, '_', 1) END AS display," + NL
    + "replace(st.term, '_', ':') AS matched_term," + NL
    + "'variant' AS record_type," + NL
    + "1 AS match_rank" + NL
    + "FROM NIAGADS.Variant v, st" + NL
    + "WHERE (st.term ~ '^[0-9]' AND st.term LIKE '%_%' AND array_length(regexp_split_to_array(st.term, '_'),1) = 2) AND (v.chromosome = 'chr' || split_part(st.term, '_', 1)" + NL
    + "AND v.position = split_part(st.term, '_', 2)::integer AND v.has_annotation)" + NL
    
    + "UNION ALL" + NL
    
    + "SELECT accession AS primary_key," + NL
    + "name AS display," + NL
    + "CASE WHEN name @@ to_tsquery((SELECT term FROM st) || ':*') THEN name" + NL
    + "WHEN description @@ to_tsquery((SELECT term FROM st) || ':*') THEN description" + NL
    + "WHEN accession @@ to_tsquery((SELECT term FROM st) || ':*') THEN accession" + NL
    + "ELSE attribution END AS matched_term," + NL
    + "'dataset' AS record_type," + NL
    + "3 AS match_rank" + NL
    + "FROM NIAGADS.DatasetAttributes" + NL
    + "WHERE accession || ' ' || name || ' ' || description || ' ' || attribution ILIKE '%' || (SELECT term FROM st) || '%'" + NL
    
    + "UNION ALL" + NL
    
    + "SELECT track AS primary_key," + NL
    + "name AS display," + NL
    + "CASE WHEN name @@ to_tsquery((SELECT term FROM st) || ':*') THEN name" + NL
    + "WHEN description @@ to_tsquery((SELECT term FROM st) || ':*') THEN description" + NL
    + "WHEN track @@ to_tsquery((SELECT term FROM st) || ':*') THEN track" + NL
    + "ELSE attribution END AS matched_term," + NL
    + "'gwas_summary' AS record_type," + NL
    + "4 AS match_rank" + NL
    + "FROM NIAGADS.TrackAttributes" + NL
    + "WHERE track || ' ' || name || ' ' || description || ' ' || attribution ILIKE '%' || (SELECT term FROM st) || '%'" + NL
    + "ORDER BY match_rank ASC, matched_term)" + NL
    
    + "SELECT jsonb_agg(matches)::text AS result" + NL
    + "FROM matches";
    
    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.search.sitesearch.get-response")
    public Response buildResponse(String body, @QueryParam(SEARCH_TERM_PARAM) String term) throws WdkModelException {
        LOG.info("Starting 'SiteSearch' Service");
        String response = "{}";
        try {
            response = lookupTerm(term);
            LOG.debug("query result: " + response);
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }
    
    private String lookupTerm(String term) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        
        LOG.debug("Looking up term for site search: " + term);
        
        SQLRunner runner = new SQLRunner(ds, SEARCH_QUERY, "site-search-query");
        runner.executeQuery(new Object[] {term}, handler);
        
        List <Map <String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result");
    }
    
}