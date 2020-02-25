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
import org.json.JSONObject;


@Path("dataset/gwas_stats")
public class GWASSummaryStatisticResultService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(GWASSummaryStatisticResultService.class);
    private static final String DATASET_PARAM = "dataset_track_id";
    //private static final String DUPLICATES_PARAM = "allow_duplicates";
    private static final String PVALUE_PARAM = "min_pvalue";
    private static final String PVALUE_DEFAULT = "0";
    private static final String PAGE_NUMBER_PARAM = "page";
    private static final String PAGE_SIZE_PARAM = "size";
    private static final String GET_RESULT_SIZE_PARAM = "count_only";
    private static final String CHROMOSOME_PARAM = "chr";
    
    private static final String QUERY_SQL="SELECT jsonb_agg(" + NL 
        + "jsonb_build_object('chr', split_part(r.metaseq_id, ':', 1)," + NL
        + "'pos', split_part(r.metaseq_id, ':', 2)," + NL
        + "'variant', r.metaseq_id," + NL
        + "'ref_snp_id', CASE WHEN r.source_id LIKE 'rs%' THEN r.source_id ELSE NULL::text END," + NL
        + "'test_allele', r.allele," + NL
        + "'pvalue', r.pvalue_display," + NL
        + "'neg_log10_pvalue', neg_log10_pvalue))::text AS result " + NL
        + "FROM Results.VariantGWAS r," + NL
        + "Study.ProtocolAppNode pan" + NL
        + "WHERE pan.source_id = ?" + NL
        + "AND pan.protocol_app_node_id = r.protocol_app_node_id";

    private static final String BIN_FILTER = "AND bin_index <@ ?::ltree";

    private static final String PVALUE_FILTER = "AND neg_log10_pvalue >= -1 * log(replace(replace(replace(replace(?::text, ' ', ''), 'x10^', 'e'), 'x10', 'e'), '^', 'e')::numeric)";


    private String _queryStr = "";

    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.dataset.lookup.get-response")
    public Response buildResponse(String body,
         @QueryParam(DATASET_PARAM) String dataset,
         //@QueryParam(PAGE_NUMBER_PARAM) Integer pageNumber,
         //@QueryParam(PAGE_SIZE_PARAM) Integer pageSize,
         @QueryParam(CHROMOSOME_PARAM) String chromosome,
         @QueryParam(GET_RESULT_SIZE_PARAM) Boolean countOnly,
         @DefaultValue(PVALUE_DEFAULT)@QueryParam(PVALUE_PARAM) double minPvalue) 
         throws WdkModelException {
            
        LOG.info("Starting 'FullGWASSummaryStatisticResult' Service");
        String result = "{}";
        try {
            if (chromosome != null && !chromosome.contains("chr")) {
                chromosome = "chr".concat(chromosome);
            }

            if (countOnly != null && countOnly) {
                prepareCountSql(chromosome, minPvalue);
            }
            else {
                prepareSql(chromosome, minPvalue);
            }

            result = getResult(dataset, minPvalue, chromosome);
            
            if (result == null) { 
                result = "{}";
            }
            else if (countOnly) {
                JSONObject jobj = new JSONObject();
                jobj.put("result_size", result);
                result = jobj.toString();
            }
            

        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(result).build();
    }
    
    private void prepareCountSql(String chr, double pvalue) {
        prepareSql(chr, pvalue);
        _queryStr = "SELECT jsonb_array_length(result::jsonb) AS result" + NL
            + "FROM (" + _queryStr + ") a";
    }

    private void prepareSql(String chr, double pvalue) {
        _queryStr = QUERY_SQL;

        if (chr != null) 
           _queryStr += NL + BIN_FILTER;
        
        if (pvalue > 0.0) 
            _queryStr += NL + PVALUE_FILTER;
       
    }

  
    private String getResult(String dataset, double minPvalue, String chromosome) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        Object[] params = null;

        if (minPvalue > 0) {
            if (chromosome != null) 
                params = new Object[] {dataset, chromosome, minPvalue};
            else 
                params = new Object[] {dataset, minPvalue};
        }
        else {
            if (chromosome != null) 
                params = new Object[] {dataset, chromosome};
            else 
                params = new Object[] {dataset};       
        }
  

        SQLRunner runner = new SQLRunner(ds, _queryStr, "dataset-lookup-query");
        runner.executeQuery(params, handler);
       
        List <Map <String, Object>> results = handler.getResults();
        if (!results.isEmpty()) 
           return (String) results.get(0).get("result");
        return null;
    }

      /* private String validateParams(Integer pageNumber, Integer pageSize)  {
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
    } */
    
   
}
