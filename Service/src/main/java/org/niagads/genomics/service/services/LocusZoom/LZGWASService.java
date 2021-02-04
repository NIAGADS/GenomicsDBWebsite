package org.niagads.genomics.service.services.LocusZoom;

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
import org.gusdb.fgputil.db.runner.SingleLongResultSetHandler;

import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.gusdb.wdk.service.service.AbstractWdkService;
import org.json.JSONObject;


@Path("locuszoom/gwas")
// @OutSchema("niagads.locuszoom.gwas.get-response")    
public class LZGWASService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(LZGWASService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String LOCATION_START_PARAM = "start";
    private static final String LOCATION_END_PARAM = "end";
    private static final String DATASET_PARAM = "track";

    private static final String DATASET_QUERY = "SELECT protocol_app_node_id" + NL
            + "FROM Study.ProtocolAppNode WHERE source_id = ?";

    private static final String GWAS_QUERY = "WITH gwas AS (" + NL
        + "SELECT variant_gwas_id, variant_record_primary_key," + NL
        + "split_part(variant_record_primary_key, ':', 1)::text AS chromosome," + NL
        + "split_part(variant_record_primary_key, ':', 2)::bigint AS position," + NL
        + "pvalue_display, allele AS test_allele, neg_log10_pvalue" + NL
        + "FROM Results.VariantGWAS" + NL
        + "WHERE protocol_app_node_id = ?" + NL
        + "AND neg_log10_pvalue != 'NaN'" + NL
        + "AND bin_index <@ (SELECT find_bin_index(?, ?, ?))" + NL
        + "AND 'chr' || split_part(variant_record_primary_key, ':', 1)::text = ?" + NL
        + "AND split_part(variant_record_primary_key, ':', 2)::bigint" + NL
        + "<@ int8range(?, ?))" + NL
        + "SELECT jsonb_build_object('data', jsonb_build_object('chromosome', jsonb_agg(chromosome)," + NL
        + "'position', jsonb_agg(position ORDER BY variant_gwas_id)," + NL
        + "'id', jsonb_agg(variant_record_primary_key ORDER BY variant_gwas_id)," + NL
        + "'pvalue', jsonb_agg(pvalue_display ORDER BY variant_gwas_id)," + NL
        + "'neg_log10_pvalue', jsonb_agg(neg_log10_pvalue ORDER BY variant_gwas_id)," + NL
        + "'testAllele', jsonb_agg(test_allele ORDER BY variant_gwas_id)))::text AS result" + NL
        + "FROM gwas";
  
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.locuszoom.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(DATASET_PARAM) String dataset,
            @QueryParam(CHROMOSOME_PARAM) String chromosome, @QueryParam(LOCATION_END_PARAM) int locEnd,
            @QueryParam(LOCATION_START_PARAM) int locStart) throws WdkModelException {
        LOG.info("Starting 'Locus Zoom GWAS' Service");
        String response = null;

        try {
            Long protocolAppNodeId = validateDataset(dataset);

            // TODO: Error Checking
            if (protocolAppNodeId < 0) {
                LOG.debug("ProtocolAppNode not found: " + dataset);
                response = new JSONObject().put("message", "No dataset associated with id: " + dataset + ".").toString();
            } 
         
            response = lookup(protocolAppNodeId, chromosome, locStart, locEnd);
          
            // LOG.debug("query result: " + response);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }


    private Long validateDataset(String dataset) {
        LOG.debug("Validating dataset:" + dataset);

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        long result = new SQLRunner(ds, DATASET_QUERY, "validate-dataset")
          .executeQuery(new Object[] {dataset}, new SingleLongResultSetHandler())
				.orElse((long) -1);

        return result;
    }


    private String lookup(Long protocolAppNodeId, String chromosome, int locStart, int locEnd) {

        LOG.debug("Fetching GWAS for dataset with protocol app node: " + protocolAppNodeId + "; in window: " + chromosome + ":" + locStart + "-" + locEnd);

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, GWAS_QUERY, "gwas-query");
        runner.executeQuery(new Object[] {protocolAppNodeId, chromosome, locStart, locEnd, chromosome, locStart, locEnd }, handler);

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