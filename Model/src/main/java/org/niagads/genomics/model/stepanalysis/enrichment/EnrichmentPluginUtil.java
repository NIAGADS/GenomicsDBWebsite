package org.niagads.genomics.model.stepanalysis.enrichment;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.Map;

import org.gusdb.fgputil.FormatUtil;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkUserException;
import org.gusdb.wdk.model.analysis.ValidationErrors;
import org.gusdb.wdk.model.answer.AnswerValue;

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
  public static String getSingleAllowableValueParam(String paramKey, Map<String, String[]> formParams,
      ValidationErrors errors) {
    String[] values = formParams.get(paramKey);
    if ((values == null || values.length != 1) && errors != null) {
      errors.addParamMessage(paramKey, "Missing required parameter, or more than one provided.");
      return null;
    }
    return values[0];
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
  public static String getArrayParamValueAsString(String paramKey, Map<String, String[]> formParams,
      ValidationErrors errors) {
    String[] values = formParams.get(paramKey);
    if ((values == null || values.length == 0) && errors != null) {
      errors.addParamMessage(paramKey, "Missing required parameter.");
    }
    return "'" + FormatUtil.join(values, "','") + "'";
  }

  public static String getOrgSpecificIdSql(AnswerValue answerValue, Map<String, String[]> params)
      throws WdkModelException, WdkUserException {
    // must wrap idSql with code that filters by the passed organism param

    String idSQL = "SELECT ga.source_id FROM " + GENE_ATTRIBUTES_TABLE + " ga," + NL + "(" + answerValue.getIdSql()
        + ") r" + NL + "WHERE ga.source_id = r.source_id" + NL + "AND ga.organism ='"
        + params.get(ORGANISM_PARAM_KEY)[0] + "'";


    logger.debug("ORGANISM-SPECIFIC SQL: " + idSQL);
    return idSQL;
  }

  public static String getPvalueCutoff(Map<String, String[]> params) {
    logger.debug(PVALUE_PARAM_KEY);
    logger.debug(params.toString());
    return params.get(PVALUE_PARAM_KEY)[0];
  }

}
