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
import org.gusdb.fgputil.db.runner.SingleLongResultSetHandler.Status;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.gusdb.wdk.service.service.AbstractWdkService;
import org.json.JSONObject;

@Path("locuszoom/gwas")
public class GWASService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(GWASService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String LOCATION_START_PARAM = "locStart";
    private static final String LOCATION_END_PARAM = "locEnd";
    private static final String DATASET_PARAM = "dataset";

    private static final String DATASET_QUERY = "SELECT protocol_app_node_id" + NL
            + "FROM Study.ProtocolAppNode WHERE source_id = ?";

    private static final String GWAS_QUERY = "SELECT jsonb_build_object(" + NL
            + "  'chr', jsonb_agg(replace(chromosome, 'chr', ''))" + NL
            + ", 'position', jsonb_agg(position ORDER BY v.variant_id)" + NL
            + ", 'id', jsonb_agg(record_pk ORDER BY v.variant_id)" + NL
            + ", 'pvalue', jsonb_agg(pvalue_display ORDER BY v.variant_id)" + NL
            + ", 'neg_log10_pvalue', jsonb_agg(neg_log10_pvalue ORDER BY v.variant_id)" + NL
            + ", 'testAllele', jsonb_agg(allele ORDER BY v.variant_id))::text AS result_json" + NL
            + "FROM" + NL
            + "(SELECT chromosome, variant_id, record_pk, position" + NL
            + "FROM NIAGADS.Variant" + NL
            + "WHERE bin_index <@ (SELECT find_bin_index(?, ?, ?))" + NL 
            + "AND position BETWEEN ? AND ?) v" + NL
            + "LEFT JOIN LATERAL" + NL
            + "(SELECT variant_id, pvalue_display, allele, neg_log10_pvalue FROM Results.VariantGWAS" + NL
            + "WHERE protocol_app_node_id = ? AND variant_id = v.variant_id) g" + NL
            + "ON TRUE" + NL
            + "WHERE pvalue_display IS NOT NULL";


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.locuszoom.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(DATASET_PARAM) String dataset,
            @QueryParam(CHROMOSOME_PARAM) String chromosome, @QueryParam(LOCATION_END_PARAM) int locEnd,
            @QueryParam(LOCATION_START_PARAM) int locStart) throws WdkModelException {
        LOG.info("Starting 'Locus Zoom GWAS' Service");
        String response = "{}";

        try {
            // query database for ld

            Long protocolAppNodeId = getProtocolAppNodeId(dataset);
            if (protocolAppNodeId < 0) {
                response = new JSONObject().put("message", "No dataset associated with id: " + dataset + ".")
                        .toString();
            }
         
            response = fetchGWAS(protocolAppNodeId, chromosome, locStart, locEnd);
            LOG.debug("query result: " + response);
            // return result
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }


    private Long getProtocolAppNodeId(String dataset) {
        LOG.debug("Validating dataset:" + dataset);

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        long result = new SQLRunner(ds, DATASET_QUERY, "validate-dataset")
          .executeQuery(new Object[] {dataset}, new SingleLongResultSetHandler())
				.orElse((long) -1);

        return result;
    }


    private String fetchGWAS(Long protocolAppNodeId, String chromosome, int locStart, int locEnd) {

        LOG.debug("Fetching GWAS for dataset with protocol app node: " + protocolAppNodeId + "; in window: " + chromosome + ":" + locStart + "-" + locEnd);

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();


        SQLRunner runner = new SQLRunner(ds, GWAS_QUERY, "gwas-query");
        runner.executeQuery(new Object[] {chromosome, locStart, locEnd, locStart, locEnd, protocolAppNodeId }, handler);

        List<Map<String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result_json");
    }

}