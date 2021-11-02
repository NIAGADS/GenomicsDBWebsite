package org.niagads.genomics.model.report.summaryview.genomeview;

import org.gusdb.wdk.model.answer.AnswerValue;
import org.json.JSONArray;
import org.json.JSONObject;

import static org.gusdb.fgputil.FormatUtil.NL;

/**
 * @author ega
 */

public class VariantGenomeViewReporter extends IdeogramJSONReporter {
    final protected String FIELD_CONSEQUENCE = "consequence";
    final protected String FIELD_IMPACT = "impact";
    final protected String FIELD_CADD = "cadd";
    final protected String FIELD_CODING_FLAG = "is_coding";
    final protected String FIELD_PRIMARY_KEY = "record_primary_key";

    public VariantGenomeViewReporter(AnswerValue answerValue) {
        super(answerValue);
    }

    @Override
    public void setIdeogramKeys() {
        _ideogramKeys = new JSONArray();
        if (_binFeatures) {
            setBinnedIdeogramKeys();
        } else {
            setUnbinnedIdeogramKeys();
        }
    }

    private void setBinnedIdeogramKeys() {
        _ideogramKeys.put("name");
        _ideogramKeys.put("start");
        _ideogramKeys.put("length");
        _ideogramKeys.put("trackIndex");
        _ideogramKeys.put("features");
    }

    private void setUnbinnedIdeogramKeys() {
        _ideogramKeys.put("name");
        _ideogramKeys.put("start");
        _ideogramKeys.put("length");
        _ideogramKeys.put("primary_key");
        _ideogramKeys.put("filters");
    }

    @Override
    public  JSONArray buildFeatureAnnotationJson(JSONArray featureList) {
        if (_binFeatures) {
            return buildBinnedFeatureAnnotation(featureList);
        }

        JSONArray annotation = new JSONArray();
        featureList.forEach(element -> {
            JSONObject feature = (JSONObject) element;
            JSONArray featureAnnotation = new JSONArray();
            featureAnnotation.put(feature.get(FIELD_DISPLAY_ID)); // name
            featureAnnotation.put(feature.get(FIELD_START_POSITION)); // location
            featureAnnotation.put(feature.get(FIELD_LENGTH)); // span length
            featureAnnotation.put(feature.get(FIELD_PRIMARY_KEY)); 

            JSONObject filters = new JSONObject();
            filters.put("consequence", feature.get(FIELD_CONSEQUENCE)); 
            filters.put("impact", feature.get(FIELD_IMPACT)); 
            filters.put("cadd", feature.get(FIELD_CADD)); 
            filters.put("is_coding", feature.get(FIELD_CODING_FLAG)); 

            featureAnnotation.put(filters);

            annotation.put(featureAnnotation);
        });

        return annotation;
    }

    private JSONArray buildBinnedFeatureAnnotation(JSONArray featureList) {
        JSONArray annotation = new JSONArray();
        
        featureList.forEach(element -> {
            JSONObject feature = (JSONObject) element;
            JSONArray featureAnnotation = new JSONArray();
            featureAnnotation.put(feature.get(FIELD_DISPLAY_ID)); // name
            featureAnnotation.put(feature.get(FIELD_START_POSITION)); // location
            featureAnnotation.put(feature.get(FIELD_LENGTH)); // span length
            featureAnnotation.put(TRACK_INDEX); // track index
            featureAnnotation.put(feature); // the features themselves

            annotation.put(featureAnnotation);
        });

        return annotation;
    }

    @Override
    public String prepareSql(String idSql) {
        String sql = "WITH ids AS (" + idSql + ")," + NL 
                + "variants AS (SELECT source_id AS record_primary_key," + NL
                + "split_part(source_id, ':', 1)::text AS chromosome," + NL
                + "split_part(source_id, ':', 2)::integer AS position," + NL
                + "split_part(source_id, ':', 3)::text AS ref_allele," + NL
                + "split_part(split_part(source_id, '_', 1), ':', 4)::text AS alt_allele," + NL
                + "split_part(source_id, '_', 1) AS metaseq_id," + NL 
                + "split_part(source_id, '_', 2) AS ref_snp_id" + NL
                + "FROM ids)," + NL 
                + "AnnotatedVariants AS (" + NL 
                + "SELECT v.*, da.*," + NL 
                + "msc.*," + NL
                + "cadd.*" + NL 
                + "FROM variants v," + NL 
                + "normalize_alleles(v.ref_allele, v.alt_allele) na," + NL
                + "adsp_most_severe_consequence(v.record_primary_key) msc," + NL 
                + "cadd(v.record_primary_key) cadd," + NL
                + "display_allele_attributes(v.ref_allele, v.alt_allele, na.ref, na.alt, v.position) da)" + NL
                + "SELECT v.chromosome," + NL
                + "jsonb_agg(jsonb_build_object('record_primary_key', v.record_primary_key," + NL
                + "'record_type', 'variant'," + NL 
                + "'display_label', CASE WHEN v.ref_snp_id IS NOT NULL" + NL
                + "THEN v.ref_snp_id ELSE truncate_str(metaseq_id, 30) END," + NL
                + "'consequence', array_to_string(json_array_cast_to_text((msc->'consequence_terms')::json), ',')," + NL
                + "'impact', msc->>'impact'," + NL 
                + "'is_coding', msc->>'consequence_is_coding'," + NL
                + "'cadd', cadd->>'CADD_phred'," + NL 
                + "'location_start', v.location_start," + NL
                + "'location_end', v.location_end," + NL
                + "'span_length', v.location_end - v.location_start) ORDER BY location_start)::text AS feature_json" + NL
                + "FROM AnnotatedVariants v" + NL 
                + "GROUP BY chromosome";

        return sql;
    }

    @Override
    public String getDisplayRecordType() {
        return "Variant";
    }
}