package org.niagads.genomics.service.services.Variant;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
// import org.gusdb.wdk.service.service.AbstractWdkService;
import org.niagads.genomics.service.services.AbstractPagedWdkService;

@Path("variant")
public class VariantLookupService extends AbstractPagedWdkService {
    private static final Logger LOG = Logger.getLogger(VariantLookupService.class);

    private static final String VARIANT_PARAM = "id";
    private static final String MSC_ONLY_PARAM = "mscOnly";
    private static final String ADSP_QC_PARAM = "adspQC";

    private static final String VARIANT_ID_CTE = "id AS (SELECT search_term, variant_primary_key AS pk FROM get_variant_primary_keys(?))";

    private static final String VARIANT_DETAILS_CTE = "vdetails AS (" + NL 
        + "SELECT id.pk AS variant_primary_key," + NL
        + "split_part(pk, '_', 1) AS metaseq_id," + NL 
        + "split_part(pk, '_', 2) AS ref_snp_id," + NL
        + "'chr' || split_part(pk, ':', 1)::text AS chrm," + NL
        + "search_term" + NL
        + "FROM id)";

    private static final String MSC_ONLY_JSON_OBJECT = "jsonb_build_object(" + NL 
    + "'chromosome', v.chromosome," + NL
    + "'location', v.location," + NL 
    + "'is_adsp_variant', v.is_adsp_variant," + NL
    + "'matched_variant', jsonb_build_object(" + NL
    + "'metaseq_id', v.metaseq_id," + NL
    + "'ref_snp_id', v.ref_snp_id," + NL
    + "'genomicsdb_id', d.variant_primary_key)," + NL
    + "'allele_frequencies', v.allele_frequencies," + NL 
    + "'cadd_scores', v.cadd_scores," + NL
    + "'most_severe_consequence', v.adsp_most_severe_consequence," + NL
    + "'flagged_genomicsdb_datasets', v.other_annotation->'GenomicsDB')";

    private final static String FULL_VEP_JSON_OBJECT = "jsonb_build_object(" + NL
        + "'transcript_consequences', v.adsp_ranked_consequences->'transcript_consequences'," + NL
        + "'regulatory_feature_consequences', v.adsp_ranked_consequences->'regulatory_feature_consequences'," + NL
        + "'motif_consequences', v.adsp_ranked_consequences->'motif_feature_consequences'," + NL
        + "'intergenic_consequences', v.adsp_ranked_consequences->'intergenic_consequences')";

    private final static String ADSP_QC_JSON_OBJECT = "jsonb_build_object(" + NL
        + "'adsp_wgs_qc', v.other_annotation->'ADSP_WGS'," + NL
        + "'adsp_wes_qc', v.other_annotation->'ADSP_WES')";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.variant.get-response")
    public Response buildResponse(@Context HttpServletRequest request, 
            String body, @QueryParam(MSC_ONLY_PARAM) Boolean mscOnly, 
            @QueryParam(ADSP_QC_PARAM) Boolean adspQC,
            @QueryParam(VARIANT_PARAM) String variants,
            @DefaultValue("1")@QueryParam(PAGE_PARAM) Integer currentPage) throws WdkModelException {

        LOG.info("Starting 'Variant Lookup' Service");

        adspQC = validateBooleanParam(request, ADSP_QC_PARAM);
        mscOnly = validateBooleanParam(request, MSC_ONLY_PARAM);

        LOG.debug("adspQC: " + adspQC); // not provided: null, provided: false, 
        LOG.debug("mscOnly: " + mscOnly);

        String response = "{}";
        try {
            initializePaging(variants, currentPage);
            String pagedVariantIds = getPagedFeatureStr();
            response = lookup(pagedVariantIds, mscOnly, adspQC);

            if (response == null) {
                response = "{}";
            }
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    
    private Boolean validateBooleanParam(HttpServletRequest request, String param) {
        if (!request.getParameterMap().containsKey(param)) {
            return false;
        }

        String paramValue = request.getParameterValues(param)[0];
        if (paramValue == "") {
            return true;
        }
        else {
            return Boolean.valueOf(paramValue);
        }
    }    


    private String buildQuery(Boolean mscOnly, Boolean adspQC) {
        String lookupCTE = "annotations AS (SELECT" + NL
            + "jsonb_build_object(d.search_term," + NL
            + MSC_ONLY_JSON_OBJECT + NL;
        
        if (!mscOnly) {
            lookupCTE = lookupCTE + " || " + FULL_VEP_JSON_OBJECT + NL;
        }

        if (adspQC) {
            lookupCTE = lookupCTE + " || " + ADSP_QC_JSON_OBJECT + NL;
        }

        lookupCTE = lookupCTE + ") AS annotation_json" + NL
        + "FROM AnnotatedVDB.Variant v, vdetails d" + NL 
        + "WHERE left(v.metaseq_id, 50) = left(d.metaseq_id, 50)" + NL 
        + "AND v.ref_snp_id = d.ref_snp_id" + NL 
        + "AND v.chromosome = d.chrm)";

        String sql = "WITH" + NL 
            + VARIANT_ID_CTE + "," + NL 
            + VARIANT_DETAILS_CTE + "," + NL 
            + lookupCTE + NL
            + "SELECT jsonb_build_object(" + NL
            + "'page', jsonb_build_oject(" + NL 
            + "'current'," + getCurrentPageDisplay() + "," + NL
            + "'total'," + getNumPages() + ")," + NL
            + "'result', jsonb_object_agg(t.k, t.v))::text AS result" + NL
            + "FROM annotations, jsonb_each(annotation_json) AS t(k,v)";
            
            
        // LOG.debug(sql);

        return sql;
    }

    private String lookup(String variant, Boolean mscOnly, Boolean adspQC) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        // LOG.debug("Fetching details for variant:" + variant);
        // LOG.debug(buildQuery());
        SQLRunner runner = new SQLRunner(ds, buildQuery(mscOnly, adspQC), "variant-lookup-query");

        runner.executeQuery(new Object[] { variant }, handler);

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
