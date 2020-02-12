package org.niagads.genomics.model.report.summaryview.genomeview;

import org.gusdb.wdk.model.answer.AnswerValue;
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
        String sql = "WITH ids AS (" + idSql + ")"  + NL
            + "SELECT replace(ga.chromosome, 'chr', '') AS chromosome," + NL
            + "jsonb_agg(jsonb_build_object('record_primary_key', ids.source_id," + NL
            + "'record_type', 'gene'," + NL
            + "'display_label', ga.gene_symbol," + NL
            + "'location_start', ga.location_start," + NL
            + "'location_end', ga.location_end," + NL
            + "'span_length', ga.location_end - ga.location_start) ORDER BY location_start)::text AS feature_json" + NL
            + "FROM ids, CBIL.GeneAttributes ga" + NL
            + "WHERE ids.source_id = ga.source_id" + NL
            + "GROUP BY chromosome";
        return sql;
    }

    @Override
    public String getDisplayRecordType() {
        return "Gene";
    }
  }