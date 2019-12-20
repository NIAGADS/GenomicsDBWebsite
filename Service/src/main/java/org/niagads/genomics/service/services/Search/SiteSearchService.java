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

    + "GeneMatches AS (" + NL
    + "SELECT source_id AS primary_key," + NL
    + "gene_symbol AS display," + NL
    + "gene_type," + NL
    + "(annotation->>'name')::text AS gene_name," + NL
    + "(annotation->>'location')::text AS location," + NL
    + "(annotation->>'entrez_id')::text AS entrez_id," + NL
    + "string_to_array(annotation->>'prev_symbol', '|') || string_to_array(annotation->>'alias_symbol', '|') AS aliases" + NL
    + "FROM CBIL.GeneAttributes WHERE source_id || ' ' ||  gene_symbol || ' ' " + NL
    + "|| COALESCE((annotation->>'entrez_id')::text, '')" + NL
    + "|| COALESCE((annotation->>'name')::text,  '')" + NL
    + "|| COALESCE (array_to_string(string_to_array(annotation->>'prev_symbol', '|') || string_to_array(annotation->>'alias_symbol', '|'), ', '), '')" + NL
    + "ILIKE '%' || (SELECT term FROM st) || '%')," + NL

    + "matches AS (" + NL

    + "SELECT primary_key," +NL
    + "display," + NL
    + "CASE WHEN primary_key @@ to_tsquery((SELECT term FROM st) || ':*') THEN primary_key" + NL
    + "WHEN display ILIKE '%' || (SELECT term FROM st) || '%'THEN display" + NL
    + "WHEN gene_name ILIKE '%' || (SELECT term FROM st) || '%'THEN gene_name" + NL
    + "WHEN array_to_string(aliases, ' ') ILIKE '%' || (SELECT term FROM st) || '%'" + NL
    + "THEN  (SELECT 'alias: ' || string_agg(a, ', ') FROM unnest(aliases) AS a, st WHERE a ILIKE '%' || st.term || '%')" + NL
    + "ELSE 'EntrezID: ' || entrez_id END AS matched_term," + NL
    + "'GENE // ' || gene_type || COALESCE(' // ' || gene_name, '')" + NL
    + "|| COALESCE(' // Also Known As: ' || array_to_string(aliases, ', '), '')"+ NL
    + "|| COALESCE(' // Location: ' || location,  '') AS description,"  + NL
    + "'gene' AS record_type," + NL
    + "2 AS match_rank" + NL
    + "FROM GeneMatches" + NL

    + "UNION ALL" + NL
    
    + "SELECT v.record_pk AS primary_key," + NL 
    + "CASE WHEN v.source_id IS NOT NULL THEN v.source_id" + NL
    + "WHEN length(split_part(v.record_pk, '_', 1)) > 30 THEN substr(split_part(v.record_pk, '_', 1), 0, 27) ELSE split_part(v.record_pk, '_', 1) END AS display," + NL
    + "CASE WHEN mv.term LIKE 'rs%' AND v.source_id != mv.term THEN 'merged from: ' || mv.term ELSE replace(mv.term, '_', ':') END AS matched_term," + NL
    + "CASE WHEN v.is_adsp_variant THEN ' ADSP VARIANT' ELSE 'VARIANT' END" + NL
    + "|| ' // ' || variant_class_abbrev" + NL
    + "|| ' // Alleles: ' || display_allele" + NL
    + "|| COALESCE(' // ' || v.most_severe_consequence, '')" + NL
    + "|| COALESCE(' // ' || (v.annotation->'VEP_MS_CONSEQUENCE'->>'impact')::text, '') AS description," + NL
    + "'variant' AS record_type," + NL
    + "1 AS match_rank" + NL
    + "FROM NIAGADS.Variant v," + NL
    + "(SELECT st.term, find_variant_primary_key(replace(replace(st.term, '_', ':'), '/', ':')) AS record_pk FROM st) mv" + NL
    + "WHERE v.record_pk = mv.record_pk" + NL
    
    + "UNION ALL" + NL
    
    + "SELECT v.record_pk AS primary_key," + NL 
    + "CASE WHEN v.source_id IS NOT NULL THEN v.source_id" + NL
    + "WHEN length(split_part(v.record_pk, '_', 1)) > 30 THEN substr(split_part(v.record_pk, '_', 1), 0, 27) ELSE split_part(v.record_pk, '_', 1) END AS display," + NL
    + "CASE WHEN st.term LIKE 'rs%' AND v.source_id != st.term THEN 'merged from: ' || st.term ELSE replace(st.term, '_', ':') END   AS matched_term,"  + NL
    + "CASE WHEN v.is_adsp_variant THEN ' ADSP VARIANT' ELSE 'VARIANT' END" + NL
    + "|| ' // ' || variant_class_abbrev" + NL
    + "|| ' // Alleles: ' || display_allele" + NL
    + "|| COALESCE(' // ' || v.most_severe_consequence, '')" + NL
    + "|| COALESCE(' // ' || (v.annotation->'VEP_MS_CONSEQUENCE'->>'impact')::text, '') AS description," + NL
    + "'variant' AS record_type," + NL
    + "1 AS match_rank" + NL
    + "FROM NIAGADS.Variant v, st" + NL
    + "WHERE (st.term ~ '^[0-9]' AND st.term LIKE '%_%' AND array_length(regexp_split_to_array(st.term, '_'),1) = 2) AND (v.chromosome = 'chr' || split_part(st.term, '_', 1)" + NL
    + "AND v.position = split_part(st.term, '_', 2)::integer AND v.has_annotation)" + NL
    
    + "UNION ALL" + NL
    
    + "SELECT accession AS primary_key," + NL
    + "accession || ': ' || COALESCE(name || ' (' || attribution ||  ')', name) AS display," + NL
    + "CASE WHEN accession || ': ' || COALESCE(name || ' (' || attribution ||  ')', name) @@ to_tsquery((SELECT term FROM st) || ':*')" + NL 
    + "THEN accession || ': ' || COALESCE(name || ' (' || attribution ||  ')', name)" + NL
    + "ELSE description END AS matched_term," + NL
    + "'NIAGADS ACCESSION // ' || substr(description, 1, 130)" + NL
    + "|| CASE WHEN length(description) <= 130 THEN '' ELSE '...' END AS description," + NL
    + "'dataset' AS record_type," + NL
    + "3 AS match_rank" + NL
    + "FROM NIAGADS.DatasetAttributes" + NL
    + "WHERE accession || ' ' || name || ' ' || description || ' ' || attribution ILIKE '%' || (SELECT term FROM st) || '%'" + NL
    
    + "UNION ALL" + NL
    
    + "SELECT track AS primary_key," + NL
    + "split_part(track, '_', 1) || ': ' || name || ' (' || attribution || ')' AS display," + NL
    + "CASE WHEN split_part(track, '_', 1) || ': ' || name || ' (' || attribution || ')' @@ to_tsquery((SELECT term FROM st) || ':*')" + NL 
    + "THEN split_part(track, '_', 1) || ': ' || name || ' (' || attribution || ')'" + NL
    + "ELSE description END AS matched_term," + NL
    + "'TRACK // ...' || replace(replace(replace(substr(description, 1, 130), 'summary statistics from ', ''), 'Summary statistics from ', ''), 'summary statistics for ', '')" + NL
    + "|| CASE WHEN length(description) <= 130 THEN '' ELSE '...' END AS description," + NL
    + "'gwas_summary' AS record_type," + NL
    + "4 AS match_rank" + NL
    + "FROM NIAGADS.TrackAttributes" + NL
    + "WHERE split_part(track, '_', 1) || ' ' || name || ' ' || description || ' ' || attribution ILIKE '%' || (SELECT term FROM st) || '%'" + NL
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
            if (response == null) { response = "{}";}
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
        LOG.debug("SiteSearch Query: " + SEARCH_QUERY);
        SQLRunner runner = new SQLRunner(ds, SEARCH_QUERY, "site-search-query");
        runner.executeQuery(new Object[] {term}, handler);
        
        List <Map <String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result");
    }
    
}