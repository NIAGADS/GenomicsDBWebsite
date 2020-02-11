package org.niagads.genomics.model.report.summaryview.genomeview;

import org.gusdb.wdk.model.answer.AnswerValue;
import static org.gusdb.fgputil.FormatUtil.NL;

/**
 * @author ega
 */

 public class VariantGenomeViewReporter extends IdeogramJSONReporter {

    public VariantGenomeViewReporter(AnswerValue answerValue) {
        super(answerValue);
    }

    @Override
    public String prepareSql(String idSql) {
        String sql = "WITH ids AS (" + idSql + ")"  + NL
            + "SELECT replace(v.chromosome, 'chr', '') AS chromosome," + NL
            + "jsonb_agg(jsonb_build_object('record_primary_key', ids.source_id," + NL
            + "'record_type', 'variant'," + NL 
            + "'display_label', CASE WHEN v.source_id LIKE 'rs%' THEN v.source_id" + NL
                    + "ELSE CASE WHEN length(v.metaseq_id) > 30 THEN" + NL
                    + "substr(v.metaseq_id, 27) || '...' ELSE v.metaseq_id END END," + NL
            + "'location_start', v.location_start," + NL
            + "'location_end', v.location_end," + NL 
            + "'span_length', v.location_end - v.location_start) ORDER BY location_start)::text AS feature_json" + NL
            + "FROM NIAGADS.Variant v, ids" + NL
            + "WHERE v.record_pk = ids.source_id" + NL
            + "GROUP BY chromosome";
        return sql;
    }

    @Override
    public String getDisplayRecordType() {
        return "Variant";
    }
  }