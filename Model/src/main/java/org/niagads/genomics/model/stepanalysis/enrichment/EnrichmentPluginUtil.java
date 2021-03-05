package org.niagads.genomics.model.stepanalysis.enrichment;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import org.gusdb.fgputil.FormatUtil;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkUserException;
import org.gusdb.wdk.model.answer.AnswerValue;

import org.gusdb.fgputil.validation.ValidationBundle.ValidationBundleBuilder;
import org.gusdb.wdk.model.query.param.AbstractEnumParam;

import org.apache.log4j.Logger;

public class EnrichmentPluginUtil {

    // static class
  private EnrichmentPluginUtil() {
  }

  private static final String PVALUE_PARAM_KEY = "pvalue_threshold";
  private static final String ORGANISM_PARAM_KEY = "organism";

  private static final String GENE_ATTRIBUTES_TABLE = "CBIL.GeneAttributes";


	private static final Logger logger = Logger.getLogger(EnrichmentPluginUtil.class);

  /**
   * Return value for param where only one value is allowed, but is required
   * 
   * @param paramKey   key used to fetch values from param map
   * @param formParams map of form params
   * @param errors     errors object to append error messages to
   * @return valid param value as String, or null if errors occurred
   */
  // @param errors may be null if the sources have been previously validated.
  public static String getSingleAllowableValueParam(String paramKey, Map<String, String> formParams, ValidationBundleBuilder errors) {
    List<String> values = AbstractEnumParam.convertToTerms(formParams.get(paramKey));
    if (values.isEmpty()) {
      errors.addError(paramKey, "Missing required parameter.");
      return null;
    }
    if (values.size() > 1) {
      errors.addError(paramKey, "Only one value allowed for this parameter.");
      return null;
    }
    return values.get(0);
  }

  /**
   * Utility method to return multiple param values for the given key as an SQL
   * compatible list string (i.e. to be placed in an 'in' clause). Values are
   * assumed to be Strings, and so are single-quoted.
   * 
   * @param paramKey   name of parameter
   * @param formParams form params passed to this plugin
   * @param errors     validation errors object to append additional errors to;
   *                   note this value may be null; if so, no errors will be
   *                   appended
   * @return SQL compatible list string
   */
  public static String getArrayParamValueAsString(String paramKey,
    Map<String, String> formParams, ValidationBundleBuilder errors) {
    List<String> values = AbstractEnumParam.convertToTerms(formParams.get(paramKey));
    if ((values == null || values.isEmpty() || values.size() == 0) && errors != null) {
      errors.addError(paramKey, "Missing required parameter.");
    }
    return "'" + FormatUtil.join(values, "','") + "'";
  }

  public static String getOrgSpecificIdSql(AnswerValue answerValue, Map<String, String> params)
      throws WdkModelException {
    // must wrap idSql with code that filters by the passed organism param
    String organism = AbstractEnumParam.convertToTerms(params.get(ORGANISM_PARAM_KEY)).get(0);

    String idSQL = "SELECT ga.source_id FROM " + GENE_ATTRIBUTES_TABLE + " ga," + NL + "(" + answerValue.getIdSql()
        + ") r" + NL + "WHERE ga.source_id = r.source_id" + NL + "AND ga.organism ='"
        + organism + "'";

    logger.debug("ORGANISM-SPECIFIC SQL: " + idSQL);
    return idSQL;
  }

  public static String getPvalueCutoff(Map<String, String> params) {
    return params.get(PVALUE_PARAM_KEY);
  }

  public static void validatePValue(Map<String, String> formParams, ValidationBundleBuilder errors) {
    if (!formParams.containsKey(PVALUE_PARAM_KEY)) {
      errors.addError(PVALUE_PARAM_KEY, "Missing required parameter.");
    }
    else {
      try {
        float pValueCutoff = Float.parseFloat(AbstractEnumParam.convertToTerms(formParams.get(PVALUE_PARAM_KEY)).get(0));
        if (pValueCutoff <= 0 || pValueCutoff > 1) throw new NumberFormatException();
      }
      catch (NumberFormatException e) {
        errors.addError(PVALUE_PARAM_KEY, "Must be a number greater than 0 and less than or equal to 1.");
      }
    }
  }

}
