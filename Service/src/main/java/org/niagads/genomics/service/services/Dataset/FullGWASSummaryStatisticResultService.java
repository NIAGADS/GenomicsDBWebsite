package org.niagads.genomics.service.services.Dataset;

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


@Path("dataset/gwas_stats")
public class FullGWASSummaryStatisticResultService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(FullGWASSummaryStatisticResultService.class);
    private static final String DATASET_PARAM = "dataset_track_id";
    //private static final String DUPLICATES_PARAM = "allow_duplicates";
    private static final String PVALUE_PARAM = "min_pvalue";
    private static final String SORT_PARAM = "sort";
    private static final String PVALUE_DEFAULT = "0";
    private static final String PAGE_NUMBER_PARAM = "page";
    private static final String PAGE_SIZE_PARAM = "size";
    private static final String GET_RESULT_SIZE_PARAM = "count_only";
    
    private static final String QUERY_SQL="SELECT split_part(r.metaseq_id, ':', 1) AS chromosome," + NL
        + "split_part(r.metaseq_id, ':', 2) AS position," + NL
        + "r.metaseq_id AS variant," + NL
        + "CASE WHEN r.source_id LIKE 'rs%' THEN r.source_id ELSE NULL END AS ref_snp_id," + NL
        + "r.allele AS test_allele," + NL
        + "r.pvalue_display AS pvalue" + NL
        + "FROM Results.VariantGWAS r," + NL
        + "Study.ProtocolAppNode pan" + NL
        + "WHERE pan.source_id = ?" + NL
        + "AND pan.protocol_app_node_id = r.protocol_app_node_id";

    private static final String BIN_FILTER = "AND bin_index <@ ?";

    private static final String PVALUE_FILTER = "neg_log10_pvalue >=" + NL
        + "-1 * log(replace(replace(replace(replace(?::text, ' ', ''), 'x10^', 'e'), 'x10', 'e'), '^', 'e')::numeric)";


    @GET    
    @Produces(MediaType.TEXT_PLAIN)
    // @OutSchema("niagads.dataset.lookup.get-response")
    public Response buildResponse(String body,
         @QueryParam(DATASET_PARAM) String dataset,
         @QueryParam(PAGE_NUMBER_PARAM) Integer pageNumber,
         @QueryParam(PAGE_SIZE_PARAM) Integer pageSize,
         @DefaultValue(PVALUE_DEFAULT)@QueryParam(PVALUE_PARAM) double minPvalue,
         @QueryParam(SORT_PARAM) Boolean sortResult) throws WdkModelException {
            
        LOG.info("Starting 'FullGWASSummaryStatisticResult' Service");
        String response = "{}";
        try {
            String message = validateParams(pageNumber, pageSize);
            if (message == "") {
                response = message;
            }
            else {
                response = getResult(dataset, minPvalue, sortResult, pageSize, pageNumber);
                if (response == null) { response = "{}";}
            }
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }

    private String validateParams(Integer pageNumber, Integer pageSize)  {
        String message = "";

        if (pageNumber == null && pageSize == null) {
            message = "Must specify one or more of 'page'' (page number to be returned) and 'size' (the number of results returned in a page." + NL;
        }

        if (pageNumber <= 0) {
            message += "'page' must be greater then 0" + NL;
        }

        if (pageSize < 0 || pageSize > 1000) {
            message += "'size' must be greater than 0 and less than 1000";
        }

        return message;
    }
    
    private String getResult(String dataset, double minPvalue, Boolean sortResult, Integer pageSize, Integer pageNumber) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        Boolean applyPvalueFilter = (minPvalue != Double.parseDouble(PVALUE_DEFAULT));

        String sql = prepareSql(applyPvalueFilter, sortResult, pageSize, pageNumber);

        SQLRunner runner = new SQLRunner(ds, sql, "dataset-lookup-query");

        if (applyPvalueFilter) 
            runner.executeQuery(new Object[] {dataset, minPvalue}, handler);
        else    
            runner.executeQuery(new Object[] {dataset}, handler);

        List <Map <String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result");
    }

    private String prepareSql(Boolean pvalueFilter, Boolean sortResult, 
                              Boolean hasLimit, Boolean hasOffset) {
        String sql = QUERY_SQL;
        if (pvalueFilter) {
            sql += NL + PVALUE_FILTER;
        }
        
        sql +=  NL + "ORDER BY bin_index, position"; // TODO: sort numeric chromosomes by value not as string
        
        if (hasLimit)
            sql += NL + "LIMIT ?"; 
        if (hasOffset)
            sql += NL + "OFFSET ?";

        return sql;
    }
}
