package org.niagads.genomics.service.services.Variant;

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

@Path("variant")
public class VariantLookupService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(VariantLookupService.class);

    private static final String VARIANT_PARAM = "id";
    private static final String FULL_VEP_PARAM = "full_vep";

    private static final String VARIANT_ID_CTE = "id AS (SELECT search_term, variant_primary_key AS pk FROM get_variant_primary_keys(?))";

    private static final String VARIANT_DETAILS_CTE = "vdetails AS (" + NL 
        + "SELECT id.pk AS variant_primary_key," + NL
        + "split_part(pk, '_', 1) AS metaseq_id," + NL 
        + "split_part(pk, '_', 2) AS ref_snp_id," + NL
        + "'chr' || split_part(pk, ':', 1)::text AS chrm," + NL
        + "search_term" + NL
        + "FROM id)";

    private static final String LOOKUP_CTE = "annotations AS (SELECT jsonb_build_object(" + NL 
        + "'chromosome', v.chromosome," + NL
        + "'search_term', d.search_term," + NL 
        + "'location', v.location," + NL 
        + "'is_adsp_variant', v.is_adsp_variant," + NL
        + "'metaseq_id', v.metaseq_id," + NL
        + "'ref_snp_id', v.ref_snp_id," + NL
        + "'allele_frequencies', v.allele_frequencies," + NL 
        + "'cadd_scores', v.cadd_scores," + NL
        + "'most_severe_consequence', v.adsp_most_severe_consequence," + NL
        + "'transcript_consequences', v.adsp_ranked_consequences->'transcript_consequences'," + NL
        + "'regulatory_feature_consequences', v.adsp_ranked_consequences->'regulatory_feature_consequences'," + NL
        + "'motif_consequences', v.adsp_ranked_consequences->'motif_feature_consequences'," + NL
        + "'intergenic_consequences', v.adsp_ranked_consequences->'intergenic_consequences'," + NL
        + "'genomicsdb_flags', v.other_annotation->'GenomicsDB'," + NL
        + "'adsp_wgs_qc', v.other_annotation->'ADSP_WGS'," + NL
        + "'adsp_wes_qc', v.other_annotation->'ADSP_WES') AS aJson" + NL
        + "FROM AnnotatedVDB.Variant v, vdetails d" + NL 
        + "WHERE left(v.metaseq_id, 50) = left(d.metaseq_id, 50)" + NL 
        + "AND v.ref_snp_id = d.ref_snp_id" + NL 
        + "AND v.chromosome = d.chrm)";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.get-response")
    public Response buildResponse(String body, @QueryParam(FULL_VEP_PARAM) Boolean fullVep,
            @QueryParam(VARIANT_PARAM) String variant) throws WdkModelException {

        LOG.info("Starting 'Variant Lookup' Service");
        String response = "{}";
        try {

            response = fetchResult(variant);
            if (response == null) {
                response = "[]";
            }
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String buildQuery() {
        String sql = "WITH" + NL 
            + VARIANT_ID_CTE + "," + NL 
            + VARIANT_DETAILS_CTE + "," + NL 
            + LOOKUP_CTE + NL
            + "SELECT json_agg(aJson)::text AS result FROM annotations";
        LOG.debug(sql);

        return sql;
    }

    private String fetchResult(String variant) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        // LOG.debug("Fetching details for variant:" + variant);
        LOG.debug(buildQuery());
        SQLRunner runner = new SQLRunner(ds, buildQuery(), "variant-lookup-query");

        runner.executeQuery(new Object[] { variant }, handler);

        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return null;
        }
        return (String) results.get(0).get("result");
    }
}
