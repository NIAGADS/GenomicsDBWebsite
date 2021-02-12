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
        String sql = "WITH ids AS (" + idSql + "),"  + NL
            + "variants AS (SELECT source_id AS record_primary_key," + NL
            + "split_part(source_id, ':', 1)::text AS chromosome," + NL
            + "split_part(source_id, ':', 2)::integer AS position," + NL
            + "split_part(source_id, ':', 3)::text AS ref_allele," + NL
            + "split_part(split_part(source_id, '_', 1), ':', 4)::text AS alt_allele," + NL
            + "split_part(source_id, '_', 1) AS metaseq_id," + NL
            + "split_part(source_id, '_', 2) AS ref_snp_id" + NL
            + "FROM ids)," + NL
            + "AnnotatedVariants AS (" + NL
            + "SELECT v.*, da.*" + NL
            + "FROM variants v," + NL
            + "normalize_alleles(v.ref_allele, v.alt_allele) na," + NL
            + "display_allele_attributes(v.ref_allele, v.alt_allele, na.ref, na.alt, v.position) da)" + NL
            + "SELECT v.chromosome," + NL
            + "jsonb_agg(jsonb_build_object('record_primary_key', v.record_primary_key," + NL
            + "'record_type', 'variant'," + NL
            + "'display_label', CASE WHEN v.ref_snp_id IS NOT NULL" + NL
            + "THEN v.ref_snp_id ELSE truncate_str(metaseq_id, 27) END," + NL
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