package org.niagads.genomics.model.report.summaryview.genomeview;

import org.gusdb.wdk.model.answer.AnswerValue;
import org.json.JSONArray;
import org.json.JSONObject;

import static org.gusdb.fgputil.FormatUtil.NL;

/**
 * @author ega
 */

public class GeneGenomeViewReporter extends IdeogramJSONReporter {

    public GeneGenomeViewReporter(AnswerValue answerValue) {
        super(answerValue);
    }

    @Override
    public String prepareSql(String idSql) {
        String sql = "WITH ids AS (" + idSql + ")" + NL + "SELECT replace(ga.chromosome, 'chr', '') AS chromosome," + NL
                + "jsonb_agg(jsonb_build_object('record_primary_key', ids.source_id," + NL + "'record_type', 'gene',"
                + NL + "'display_label', ga.gene_symbol," + NL + "'location_start', ga.location_start," + NL
                + "'location_end', ga.location_end," + NL
                + "'span_length', ga.location_end - ga.location_start) ORDER BY location_start)::text AS feature_json"
                + NL + "FROM ids, CBIL.GeneAttributes ga" + NL + "WHERE ids.source_id = ga.source_id" + NL
                + "GROUP BY chromosome";
        return sql;
    }

    @Override
    public void setIdeogramKeys() {
        _ideogramKeys.put("name");
        _ideogramKeys.put("start");
        _ideogramKeys.put("length");
        _ideogramKeys.put("trackIndex");
        _ideogramKeys.put("features");
    }

    @Override
    public JSONArray buildFeatureAnnotationJson(JSONArray featureList) {
        JSONArray annotation = new JSONArray();
        featureList.forEach(element -> {
            JSONObject feature = (JSONObject) element;
            JSONArray featureAnnotation = new JSONArray();
            featureAnnotation.put(feature.get(FIELD_DISPLAY_ID)); // name
            featureAnnotation.put(feature.get(FIELD_START_POSITION)); // location
            featureAnnotation.put(feature.get(FIELD_LENGTH)); // locatiorn
            featureAnnotation.put(TRACK_INDEX); // track index
            featureAnnotation.put(feature); // the features themselves

            annotation.put(featureAnnotation);
        });

        return annotation;
    }

    @Override
    public String getDisplayRecordType() {
        return "Gene";
    }
}