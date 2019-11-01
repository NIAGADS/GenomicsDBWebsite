package org.niagads.genomics.model.stepanalysis.enrichment;

import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.sql.Types;
import java.text.DecimalFormat;
import java.text.NumberFormat;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.sql.DataSource;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.apache.log4j.Logger;

import org.json.JSONArray;
import org.json.JSONObject;

import static org.gusdb.fgputil.FormatUtil.NL;
import static org.gusdb.fgputil.FormatUtil.TAB;

import org.gusdb.fgputil.FormatUtil;

import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.fgputil.db.runner.SingleLongResultSetHandler;

import org.gusdb.fgputil.runtime.GusHome;

import org.gusdb.fgputil.validation.ValidationBundle;
import org.gusdb.fgputil.validation.ValidationBundle.ValidationBundleBuilder;
import org.gusdb.fgputil.validation.ValidationLevel;

import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkUserException;

import org.gusdb.wdk.model.analysis.AbstractSimpleProcessAnalyzer;

import org.gusdb.wdk.model.answer.AnswerValue;

import org.gusdb.wdk.model.user.analysis.IllegalAnswerValueException;


public class GoEnrichmentPlugin extends AbstractSimpleProcessAnalyzer {

	private static final Logger logger = Logger.getLogger(GoEnrichmentPlugin.class);

	private static final String GOA_TRANSITIVE_CLOSURE_TABLE = "CBIL.GOAssociation_TC";
	private static final String GOA_TABLE = "CBIL.GOAssociation";
	private static final String GO_TERM_BACKGROUND_COUNTS_TRANSITIVE_CLOSURE_TABLE = "CBIL.GoTerm_TC";
	// private static final String GO_TERM_BACKGROUND_COUNTS_TABLE = "CBIL.GoTerm";
	private static final String GOA_TOTALS_TABLE = "CBIL.GeneOntologyTotals";
	private static final String GENE_ATTRIBUTE_TABLE = "CBIL.GeneAttributes";

	private static final String GO_TERM_BASE_URL_PROP_KEY = "goTermPageUrl";
	private static final String REVIGO_BASE_URL_PROP_KEY = "revigoBaseUrl";
	private static final String GO_ASSOC_ONTOLOGY_PARAM_KEY = "ontology";
	private static final String ORGANISM_PARAM_KEY = "organism";

	private static final String RESULT_FILE_PREFIX = "go_enrichment";
	private static final String TABBED_RESULT_FILE_NAME = RESULT_FILE_PREFIX + "_internal.txt";
	private static final String DOWNLOAD_TABBED_RESULT_FILE_NAME = RESULT_FILE_PREFIX + "_result.txt";
	private static final String DOWNLOAD_IMAGE_RESULT_FILE_NAME = RESULT_FILE_PREFIX + "_wordcloud.png";
	private static final String INPUT_FILE_PREFIX = "goa_counts";

	public ValidationBundle validateFormParams(Map<String, String[]> formParams) throws WdkModelException {

		ValidationBundleBuilder errors = ValidationBundle.builder(ValidationLevel.SEMANTIC);

		// validate pValueCutoff
		EnrichmentPluginUtil.validatePValue(formParams, errors);

		// validate ontology
		String ontology = EnrichmentPluginUtil.getSingleAllowableValueParam(GO_ASSOC_ONTOLOGY_PARAM_KEY, formParams,
				errors);

		// only validate further if the above pass
		if (!errors.hasErrors()) {
			validateFilteredGoTerms(ontology, errors);
		}

		return errors.build();
	}

	/**
	 * Retrieve total number of genes annotated by a GO term in the background for
	 * the specified GO ontology
	 * 
	 * @param ontology
	 * @return JSON string listing total background and result counts for each
	 *         ontology
	 * @throws WdkModelException
	 * @throws WdkUserException
	 */
	private JSONObject getAnnotatedGeneCountTotals(String ontology) throws WdkModelException, WdkUserException {

		String idSql = EnrichmentPluginUtil.getOrgSpecificIdSql(getAnswerValue(), getFormParams());
		String organism = getFormParams().get(ORGANISM_PARAM_KEY)[0];

		String sql = "SELECT *" + NL + "FROM (" + NL + "SELECT b.ontology_abbrev AS ontology," + NL
				+ "(jsonb_build_object('background', b.num_annotated_genes) || "
				+ "jsonb_build_object('result', r.num_annotated_genes))::text AS tallies" + NL + "FROM  "
				+ GOA_TOTALS_TABLE + " b," + NL
				+ "(SELECT goa_tc.ontology_abbrev AS ontology, COUNT(DISTINCT goa.source_id) AS num_annotated_genes"
				+ NL + "FROM " + GOA_TRANSITIVE_CLOSURE_TABLE + " goa_tc, " + NL + GOA_TABLE + " goa," + NL
				// link through to make sure only get TC counts for terms directly annotated
				+ "(" + idSql + ") ids" + NL + "WHERE ids.source_id = goa.source_id" + NL
				+ "AND ids.source_id = goa_tc.source_id" + NL + "AND goa.ontology_term_id = goa_tc.ontology_term_id"
				+ NL + "AND goa.ontology_abbrev ='" + ontology + "'" + NL + "GROUP BY goa_tc.ontology_abbrev) r" + NL
				+ "WHERE b.ontology_abbrev = r.ontology" + NL + "AND b.organism = ?) a";

		logger.debug("get-annotated-gene-counts SQL:" + sql);

		DataSource ds = getWdkModel().getAppDb().getDataSource();
		BasicResultSetHandler result = new SQLRunner(ds, sql, "count-filtered-go-terms")
				.executeQuery(new Object[] { organism }, new Integer[] { Types.VARCHAR }, new BasicResultSetHandler());

		if (result.getNumRows() < 1) {
			throw new WdkModelException("No result found in count query: " + sql);
		}
		if (result.getNumRows() > 1) {
			throw new WdkModelException("Expected one result, but got " + result.getNumRows() + " from query: " + sql);
		}

		JSONObject counts = new JSONObject((String) result.getResults().get(0).get("tallies"));
		return counts;
	}

	/**
	 * Retrieve enrichment input data (counts of genes per term in result and
	 * background) from the database and write to temp file
	 * 
	 * @param ontology
	 * @return file name
	 * @throws WdkModelException
	 * @throws WdkUserException
	 * @throws IOException
	 */
	private String generateTermCountFile(String ontology) throws WdkModelException, WdkUserException, IOException {

		// TODO get GO Levels for pie Charts

		String idSql = EnrichmentPluginUtil.getOrgSpecificIdSql(getAnswerValue(), getFormParams());
		String organism = getFormParams().get(ORGANISM_PARAM_KEY)[0];

		String sql = "WITH r AS (" + idSql + ")," + NL

				+ "directAnnotation AS (" + NL + "SELECT goa.ontology_term_id," + NL
				+ "string_agg(r.source_id || ';' || ga.gene_symbol, ',') AS gene_list_display," + NL
				+ "string_agg(DISTINCT r.source_id, '//') AS gene_list_id," + NL
				+ "string_agg(DISTINCT ga.gene_symbol, '//') AS gene_list_symbol," + NL
				+ "count(DISTINCT r.source_id) AS result_count" + NL + "FROM r," + NL + GOA_TABLE + " goa," + NL
				+ GENE_ATTRIBUTE_TABLE + " ga" + NL + "WHERE goa.source_id = r.source_id" + NL
				+ "AND goa.ontology_abbrev='" + ontology + "'" + NL + "AND ga.gene_id = goa.gene_id" + NL
				+ "GROUP BY goa.ontology_term_id)," + NL

				+ "tcAnnotation AS (SELECT da.ontology_term_id," + NL
				+ "count(DISTINCT goa_tc.source_id) AS result_count," + NL
				+ "string_agg(goa_tc.source_id || ';' || ga.gene_symbol, ',') AS gene_list_display," + NL
				+ "string_agg(DISTINCT goa_tc.source_id, '//') AS gene_list_id," + NL
				+ "string_agg(DISTINCT ga.gene_symbol, '//' ) AS gene_list_symbol" + NL + "FROM directAnnotation da,"
				+ NL + "r," + NL + GOA_TRANSITIVE_CLOSURE_TABLE + " goa_tc, " + NL + GENE_ATTRIBUTE_TABLE + " ga" + NL
				+ "WHERE goa_tc.ontology_term_id = da.ontology_term_id" + NL + "AND goa_tc.source_id = r.source_id" + NL
				+ "AND ga.gene_id = goa_tc.gene_id" + NL + "GROUP BY da.ontology_term_id)" + NL

				+ "SELECT gtc.go_term_id," + NL + "tc.result_count AS result_count_tc," + NL
				+ "gtc.num_annotated_genes AS background_count," + NL + "gtc.go_term," + NL
				+ "gtc.ontology_abbrev AS ontology," + NL + "da.result_count AS result_count_direct," + NL
				+ "da.gene_list_symbol AS gene_list_symbol_direct," + NL + "da.gene_list_id AS gene_list_id_direct,"
				+ NL + "tc.gene_list_symbol AS gene_list_symbol_tc," + NL + "tc.gene_list_id AS gene_list_id_tc," + NL
				+ "da.gene_list_display AS display_genes_direct," + NL + "tc.gene_list_display AS display_genes_tc" + NL
				+ "FROM DirectAnnotation da," + NL + "tcAnnotation tc," + NL
				+ GO_TERM_BACKGROUND_COUNTS_TRANSITIVE_CLOSURE_TABLE + " gtc" + NL
				+ "WHERE gtc.ontology_term_id = da.ontology_term_id" + NL
				+ "AND tc.ontology_term_id = da.ontology_term_id" + NL + "AND gtc.organism = ?";

		logger.debug("term-counts SQL: " + sql);

		DataSource ds = getWdkModel().getAppDb().getDataSource();
		BasicResultSetHandler handler = new BasicResultSetHandler();

		new SQLRunner(ds, sql).executeQuery(new Object[] { organism }, new Integer[] { Types.VARCHAR }, handler);
		List<Map<String, Object>> results = handler.getResults();

		Path countFile = Files.createTempFile(getStorageDirectory(), INPUT_FILE_PREFIX + "_" + ontology, ".txt");
		logger.debug("COUNT FILE: " + countFile.toString());

		/*
		 * ONTOLOGY, GO_ID, GO_TERM, RESULT_COUNTS, RESULT_RATIO, BACKGROUND_RATIO,
		 * FOLD_ENRICHMENT, P_VALUE, FDR, ADJ_P_VALUE GENES, GENES_TRANSITIVE_CLOSURE
		 */

		try (BufferedWriter writer = Files.newBufferedWriter(countFile, StandardCharsets.UTF_8,
				StandardOpenOption.WRITE)) {

			String[] columns = new String[] { Columns.GO_ID.key(), Columns.GO_TERM.key(),
					Columns.RESULT_COUNTS_TRANSITIVE_CLOSURE.key(), Columns.BACKGROUND_COUNTS.key(),
					Columns.RESULT_COUNTS.key(), Columns.GENES.key(), Columns.GENES_TRANSITIVE_CLOSURE.key(),
					Columns.GENES.key() + "_display", Columns.GENES_TRANSITIVE_CLOSURE.key() + "_display", };

			String header = FormatUtil.join(columns, TAB) + NL;
			writer.write(header);

			for (Map<String, Object> r : results) {
				String oString = r.get("go_term_id") + TAB + r.get("go_term") + TAB + r.get("result_count_tc") + TAB
						+ r.get("background_count") + TAB + r.get("result_count_direct") + TAB
						+ r.get("gene_list_symbol_direct") + TAB + r.get("gene_list_symbol_tc") + TAB
						+ r.get("display_genes_direct") + TAB + r.get("display_genes_tc") + NL;
				writer.write(oString);
			}
			writer.close();

			// set file to group/other readable otherwise tomcat cannot access for command
			Set<PosixFilePermission> perms = PosixFilePermissions.fromString("rw-r--r--");
			Files.setPosixFilePermissions(countFile, perms);

		} catch (IOException e) {
			throw new WdkModelException("Error writing GO Enrichment Analysis input file: " + countFile.toString(), e);
		}

		return countFile.toString();
	}

	private void validateFilteredGoTerms(String ontology, ValidationBundleBuilder errors) throws WdkModelException {

		String idSql = EnrichmentPluginUtil.getOrgSpecificIdSql(getAnswerValue(), getFormParams());
		// check against direct annotations
		String sql = "SELECT COUNT(distinct goa.go_term_id) AS counts" + NL + "FROM " + GOA_TABLE + " goa," + NL + "("
				+ idSql + ") r" + NL + "WHERE goa.source_id = r.source_id" + NL + "AND goa.ontology_abbrev='" + ontology
				+ "'" + NL;

		logger.debug("filtered GO terms SQL: " + sql);

		DataSource ds = getWdkModel().getAppDb().getDataSource();

		long result = new SQLRunner(ds, sql, "count-filtered-go-terms").executeQuery(new SingleLongResultSetHandler())
				.orElseThrow(() -> new WdkModelException("No result found in count query: " + sql));


		if (result < 1) {
			errors.addError(
					"Your result has no GO annotated genes in the selected ontology.  Please try adjusting the parameters.");
		}

	}

	@Override
	protected String[] getCommand(AnswerValue answerValue) throws WdkModelException, WdkUserException {
		Map<String, String[]> params = getFormParams();
		for (String pkey : params.keySet()) {
			logger.debug("param: " + pkey);
			logger.debug("value: " + Arrays.toString(params.get(pkey)));
		}

		String pValueCutoff = EnrichmentPluginUtil.getPvalueCutoff(params);
		String ontology = EnrichmentPluginUtil.getSingleAllowableValueParam(GO_ASSOC_ONTOLOGY_PARAM_KEY, params, null);

		try {
			String inputFile = generateTermCountFile(ontology);

			String qualifiedExe = Paths.get(GusHome.getGusHome(), "bin", "enrichmentAnalysis").toString();

			JSONObject totals = getAnnotatedGeneCountTotals(ontology);

			String[] cmd = new String[] { qualifiedExe, "-p", pValueCutoff, "-r", String.valueOf(totals.get("result")),
					"-b", String.valueOf(totals.get("background")), "-i", inputFile, "-o",
					getResultFilePath(RESULT_FILE_PREFIX).toString(), "--ontology", ontology, "--header" };

			logger.debug("CMD: " + FormatUtil.join(cmd, " "));

			return cmd;
		} catch (IOException e) {
			throw new WdkModelException("Unable to create temp file path for GO enrichment result file", e);
		}
	}

	/**
	 * Make sure only one organism is represented in the results of this step
	 * 
	 * @param answerValue answerValue that will be passed to this step
	 * @throws WdkUserException
	 * @throws IllegalAnswerException if more than one organism is represented in
	 *                                this answer
	 */
	@Override
	public void validateAnswerValue(AnswerValue answerValue)
			throws IllegalAnswerValueException, WdkModelException, WdkUserException {
		logger.info("entering validate answer value");

		String countColumn = "num_genes";
		String idSql = answerValue.getIdSql();
		logger.debug(idSql);
		DataSource ds = getWdkModel().getAppDb().getDataSource();
		BasicResultSetHandler handler = new BasicResultSetHandler();

		// check for non-zero count of genes with GO associations
		String sql = "SELECT COUNT(DISTINCT gts.source_id) as " + countColumn + NL + "FROM "
				+ GOA_TRANSITIVE_CLOSURE_TABLE + " gts, (" + idSql + ") r" + NL + "WHERE gts.source_id = r.source_id";

		logger.info("VALIDATE ANSWER: " + sql);

		new SQLRunner(ds, sql).executeQuery(handler);

		if (handler.getNumRows() == 0)
			throw new WdkModelException("No result found in count query: " + sql);

		Map<String, Object> result = handler.getResults().get(0);

		logger.debug("VALIDATE ANSWER - result: " + result.toString());

		Long count = (Long) result.get(countColumn);

		logger.debug("VALIDATE ANSWER - count: " + count.intValue());

		if (count.intValue() == 0) {
			throw new IllegalAnswerValueException("Your result has no genes that have been annotated by GO terms. "
					+ "Please revise your search and try again.");
		}
	}

	@Override
	public JSONObject getResultViewModelJson() throws WdkModelException {
		List<ResultRow> results = new ArrayList<>();
		Path inputPath = getResultFilePath(TABBED_RESULT_FILE_NAME);
		CSVParser parser = null;
		try {
			StringBuilder revigoInputLists = new StringBuilder();
			parser = new CSVParser(new FileReader(inputPath.toFile()), CSVFormat.TDF.withHeader());
			for (CSVRecord cr : parser) {
				results.add(new ResultRow(cr));
				String revigo = cr.get(Columns.GO_ID.key()) + " " + cr.get(Columns.P_VALUE.key()) + "\n";
				revigoInputLists.append(revigo);
			}
			parser.close();
			String revigoInputList = String.valueOf(revigoInputLists);
			return new ResultViewModel(DOWNLOAD_TABBED_RESULT_FILE_NAME, results, getFormParams(),
					DOWNLOAD_IMAGE_RESULT_FILE_NAME, revigoInputList).toJson(getProperty(GO_TERM_BASE_URL_PROP_KEY),
							getProperty(REVIGO_BASE_URL_PROP_KEY));
		} catch (IOException ioe) {
			throw new WdkModelException("Unable to process result file at: " + inputPath.toString(), ioe);
		}
	}

	private Path getResultFilePath(String file) {
		return Paths.get(getStorageDirectory().toString(), file);
	}

	public static class ResultViewModel {

		private List<ResultRow> _resultData;
		private String _imageDownloadPath;
		private String _downloadPath;
		private Map<String, String[]> _formParams;
		private String _goTermBaseUrl;
		private String _revigoInputList;
		private JSONArray _header;

		public ResultViewModel(String downloadPath, List<ResultRow> resultData, Map<String, String[]> formParams,
				String imageDownloadPath, String revigoInputList) {
			this._downloadPath = downloadPath;
			this._formParams = formParams;
			this._resultData = resultData;
			this._imageDownloadPath = imageDownloadPath;
			this._revigoInputList = revigoInputList;
		}

		public JSONArray buildHeader() {
			_header = new JSONArray();

			_header.put(Columns.GO_ID.toJson());
			// _header.put(Columns.ONTOLOGY.toJson());
			_header.put(Columns.GO_TERM.toJson());
			_header.put(Columns.RESULT_COUNTS.toJson());
			_header.put(Columns.RESULT_COUNTS_TRANSITIVE_CLOSURE.toJson());
			_header.put(Columns.RESULT_PERCENT.toJson());
			_header.put(Columns.BACKGROUND_COUNTS.toJson());
			_header.put(Columns.BACKGROUND_PERCENT.toJson());
			_header.put(Columns.FOLD_ENRICHMENT.toJson());
			_header.put(Columns.P_VALUE.toJson());
			_header.put(Columns.ADJ_P_VALUE.toJson());
			_header.put(Columns.FDR.toJson());
			_header.put(Columns.GENES.toJson());
			_header.put(Columns.GENES_TRANSITIVE_CLOSURE.toJson());
			return _header;
		}

		public JSONArray getHeader() {
			return _header;
		}

		public List<ResultRow> getResultData() {
			return _resultData;
		}

		public String getDownloadPath() {
			return _downloadPath;
		}

		public String getImageDownloadPath() {
			return _imageDownloadPath;
		}

		public String getPvalueCutoff() {
			return EnrichmentPluginUtil.getPvalueCutoff(_formParams);
		}

		public String getGoOntologies() {
			return FormatUtil.join(_formParams.get(GoEnrichmentPlugin.GO_ASSOC_ONTOLOGY_PARAM_KEY), ", ");
		}

		public String getGoTermBaseUrl() {
			return _goTermBaseUrl;
		}

		public String getRevigoInputList() {
			return _revigoInputList;
		}

		JSONObject toJson(String goTermBaseUrl, String revigoBaseUrl) {
			JSONObject json = new JSONObject();
			json.put("header", buildHeader());

			JSONArray results = new JSONArray();
			for (ResultRow rr : getResultData())
				results.put(rr.toJson());
			json.put("resultData", results);

			json.put("downloadPath", getDownloadPath());
			json.put("imageDownloadPath", getImageDownloadPath());
			json.put("pvalueCutoff", getPvalueCutoff());
			json.put("goOntologies", getGoOntologies());
			json.put("revigoInputList", getRevigoInputList());

			json.put("goTermBaseUrl", goTermBaseUrl);
			json.put("revigoBaseUrl", revigoBaseUrl);

			return json;
		}
	}

	public static class ResultRow {
		Map<String, String> _fields;

		/*
		 * ONTOLOGY, GO_ID, GO_TERM, RESULT_COUNTS, RESULT_RATIO, BACKGROUND_RATIO,
		 * GENES_TRANSITIVE_CLOSURE, GENES, FOLD_ENRICHMENT, P_VALUE, FDR, ADJ_P_VALUE
		 */
		public ResultRow(CSVRecord cr) {
			_fields = new HashMap<String, String>();

			String goID = cr.get(Columns.GO_ID.key());
			_fields.put(Columns.GO_ID.key(), goID);
			_fields.put(Columns.GO_TERM.key(), cr.get(Columns.GO_TERM.key()));
			_fields.put(Columns.RESULT_COUNTS.key(), cr.get(Columns.RESULT_COUNTS.key()));
			_fields.put(Columns.RESULT_COUNTS_TRANSITIVE_CLOSURE.key(),
					cr.get(Columns.RESULT_COUNTS_TRANSITIVE_CLOSURE.key()));
			_fields.put(Columns.RESULT_PERCENT.key(), cr.get(Columns.RESULT_PERCENT.key()));
			_fields.put(Columns.BACKGROUND_COUNTS.key(), cr.get(Columns.BACKGROUND_COUNTS.key()));
			_fields.put(Columns.BACKGROUND_PERCENT.key(), cr.get(Columns.BACKGROUND_PERCENT.key()));
			_fields.put(Columns.FOLD_ENRICHMENT.key(), cr.get(Columns.FOLD_ENRICHMENT.key()));
			_fields.put(Columns.P_VALUE.key(), cr.get(Columns.P_VALUE.key()));
			_fields.put(Columns.ADJ_P_VALUE.key(), cr.get(Columns.ADJ_P_VALUE.key()));
			_fields.put(Columns.FDR.key(), cr.get(Columns.FDR.key()));

			String geneStr = generateGeneLinks(cr.get(Columns.GENES.key() + "_display"), goID);
			_fields.put(Columns.GENES.key(), geneStr);
			geneStr = generateGeneLinks(cr.get(Columns.GENES_TRANSITIVE_CLOSURE.key() + "_display"), goID);
			_fields.put(Columns.GENES_TRANSITIVE_CLOSURE.key(), geneStr);
		}

		public ResultRow() {
			_fields = new HashMap<String, String>();
		}

		public void setField(String field, String value) {
			_fields.put(field, value);
		}

		public String getFieldValue(String field) {
			return (String) _fields.get(field);
		}

		public JSONObject toJson() {
			JSONObject result = new JSONObject();
			for (String key : _fields.keySet()) {
				result.put(key, _fields.get(key));
			}
			return result;
		}

		/**
		 * @param x string containing decimal value to be formatted
		 * @return value formatted in scientific notation (unless zero or one)
		 */
		@Deprecated
		private String toScientificNotation(String x) {
			float value = Float.valueOf(x);
			logger.debug("convert " + x + "to " + String.valueOf(value));
			if (value == 1 || value == 0) {
				return x;
			} else {
				NumberFormat formatter = new DecimalFormat("0.##E0");
				formatter.setMaximumFractionDigits(2);
				logger.debug("convert " + x + "to " + formatter.format(value));
				return formatter.format(value);
			}
		}

		/**
		 * @param geneStr string of comma-separated id;symbol pairs
		 * @param goId    GO accession (id) associated with the gene list
		 * @return a single link if number of genes = 1, otherwise a link to run a
		 *         GeneUpload query to fetch the gene list
		 */
		private String generateGeneLinks(String geneStr, String goId) {
			String[] geneIds = geneStr.split(",");
			String link = null;
			if (geneIds.length > 1) {
				String pKeys = "";
				for (String gene : geneIds) {
					String[] ids = gene.split(";");
					pKeys += ids[0] + ",";
				}
				link = "processQuestion.do?" + "questionFullName=GeneQuestions.GeneUpload"
						+ "&ds_gene_identifiers_type=data" + "&array(include_synonyms)=No"
						+ "&ds_gene_identifiers_data=" + pKeys + "&ds_gene_identifiers_parser=list" + "&customName="
						+ goId;

				link = "<a href=\"" + link + "\">View</a>";
			} else {
				String[] ids = geneIds[0].split(";");
				link = "<a href=\"app/record/gene/" + ids[0] + "\">" + ids[1] + "</a>";
			}
			return link;
		}
	}

	/**
	 * Column names for input/result file headers and final result header
	 *
	 */
	public enum Columns {
		/*
		 * ONTOLOGY, GO_ID, TERM, RESULT_COUNTS, RESULT_RATIO, BACKGROUND_RATIO,
		 * GENES_TRANSITIVE_CLOSURE, GENES, FOLD_ENRICHMENT, P_VALUE, FDR, ADJ_P_VALUE
		 */
		ONTOLOGY("ONTOLOGY", "Ontology",
				"one of Biological Process (BP), Cellular Component (CC), or Molecular Function (MF)", null, true,
				null),
		GO_ID("ID", "ID", "Gene Ontology ID", "html", true, "htmlText"),
		GO_TERM("TERM", "Term", "Gene Ontology Term", "html", true, null),
		RESULT_COUNTS("COUNT", "Result Count",
				"Number of genes in your result directly annotated by this term, "
						+ "not including those inferred by transitive closure (see methods for more information)",
				null, true, "number"),
		RESULT_COUNTS_TRANSITIVE_CLOSURE("COUNT_INCL_CLOSURE", "Result Count (TC)",
				"Number of genes in your result annotated by this term, "
						+ "including those inferred by transitive closure (see methods for more information)",
				null, true, "number"),
		BACKGROUND_COUNTS("BACKGROUND_COUNT", "Background Count",
				"Number of genes in the background  annotated by this term, "
						+ "including those inferred by transitive closure (see methods for more information)",
				null, true, "number"),
		RESULT_RATIO("RESULT_RATIO", "Result Ratio",
				"Ratio of the annotated genes in your result set annotated by this term to total number of annotated genes in the result set, "
						+ "inclding those inferred by transitive closure (see methods for more information)",
				null, true, null),
		BACKGROUND_RATIO("BACKGROUND_RATIO", "Background Ratio",
				"Ratio of genes annotated by this gene in the background set to total number of annotated genes in the background set, "
						+ "inclding those inferred by transitive closure (see methods for more information)",
				null, true, null),
		RESULT_PERCENT("RESULT_PERCENT", "Result Percent",
				"Fraction of the annotated genes in your result set annotated by this term, "
						+ "inclding those inferred by transitive closure (see methods for more information)",
				"float_1", true, "number"),
		BACKGROUND_PERCENT("BACKGROUND_PERCENT", "Background Percent",
				"Fraction of genes annotated by this gene in the background set, "
						+ "inclding those inferred by transitive closure (see methods for more information)",
				"float_1", true, "number"),
		GENES_TRANSITIVE_CLOSURE("GENES_INCL_CLOSURE", "Genes (TC)",
				"All genes in your result annotated by this term, including those inferrred via transitive closure (see methods for more information)",
				"html", false, null),
		GENES("GENES", "Genes",
				"Genes in your result directly annotated by this term, not including those inferred via transitive closure (see methods for more information)",
				"html", false, null),
		FOLD_ENRICHMENT("FOLD_ENRICHMENT", "Fold Enrichment",
				"odds ratio of the fraction of genes annotated by this term in your result set to the fraction of genes annotated by the term in the background",
				"float_2", true, "number"),
		P_VALUE("P_VALUE", "p-value", "", "scientific", true, "number"),
		FDR("FDR", "FDR", "Benjamini-Hochberg false discovery rate (FDR)", "scientific", true, "number"),
		ADJ_P_VALUE("ADJ_P", "Adj p-value", "Bonferroni adjusted p-value", "scientific", true, "number");

		private final String _display;
		private final String _key;
		private final String _help;
		private final String _type;
		private final Boolean _sortable;
		private final String _sortType;

		private Columns(final String key, final String display, final String help, final String type,
				final Boolean sortable, final String sortType) {
			this._key = key;
			this._help = help;
			this._display = display;
			this._type = type;
			this._sortable = sortable;
			this._sortType = sortType;
		}

		public String display() {
			return _display;
		}

		public String key() {
			return _key;
		}

		public String help() {
			return _help;
		}

		public JSONObject toJson() {
			JSONObject details = new JSONObject();
			details.put("key", _key);
			details.put("name", _display);
			details.put("helpText", _help);
			if (_type != null) {
				details.put("type", _type);
			}
			details.put("sortable", _sortable);
			if (_sortType != null) {
				details.put("sortType", _sortType);
			}

			return details;
		}
	}

}
