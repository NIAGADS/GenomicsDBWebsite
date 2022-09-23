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
    
    private static final String SEARCH_QUERY = "WITH st AS (SELECT TRIM(?) AS term)," + NL
        + "matches AS (" + NL
        + "SELECT * FROM gene_text_search((SELECT term FROM st))" + NL
        + "UNION SELECT * FROM variant_text_search((SELECT term FROM st))" + NL
       // + "UNION SELECT * FROM niagads_dataset_text_search((SELECT term FROM st))" + NL
        + "UNION SELECT * FROM gwas_dataset_text_search((SELECT term FROM st))" + NL
       // + "UNION SELECT * FROM span_feature_search((SELECT term FROM st))" + NL
        + "ORDER BY match_rank, record_type, display ASC)" + NL
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