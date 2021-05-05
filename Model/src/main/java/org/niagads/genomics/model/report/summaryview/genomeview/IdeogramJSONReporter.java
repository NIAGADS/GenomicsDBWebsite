package org.niagads.genomics.model.report.summaryview.genomeview;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONWriter;
import org.gusdb.fgputil.db.SqlUtils;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.fgputil.json.JsonWriter;
import static org.gusdb.fgputil.FormatUtil.NL;

import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.answer.AnswerValue;
import org.gusdb.wdk.model.report.AbstractReporter;
import org.gusdb.wdk.model.report.Reporter;
import org.gusdb.wdk.model.report.ReporterConfigException;

/**
 * @author EGA
 * 
 *         abstract class defining the Ideogram JSON Reporter underlying the
 *         GenomeView prepareSql will need to be overridden for different
 *         feature types returns json object with two elements: keys: ["name",
 *         "start", "length", "trackIndex", "features": {"num":<nfeatures>,
 *         "ids": <comma separated list of features assigned to the span"}]
 * 
 *         annot: [{"chr": <chrNo>, "annots":[[<name>, <start>, <length>,
 *         <features>], [], [], ..., []]}
 */

public abstract class IdeogramJSONReporter extends AbstractReporter {
    private static final Logger logger = Logger.getLogger(IdeogramJSONReporter.class);

    final private static String BIN_FEATURES_OPTION = "bin_features";

    final private static String EXCEEDS_LIMIT_PROP = "exceeds_limit";
    final private static double MAX_FEATURE_LIMIT = 5000;

    final private static String COLUMN_FEATURE_JSON = "feature_json";
    final private static String COLUMN_CHROMOSOME = "chromosome";

    final protected static String FIELD_PRIMARY_KEY = "record_primary_key";
    final protected static String FIELD_DISPLAY_ID = "display_label";
    final protected static String FIELD_START_POSITION = "location_start";
    final protected static String FIELD_LENGTH = "span_length";

    final private static double MIN_FEATURE_PERCENT_GAP = 0.004;
    final protected static int TRACK_INDEX = 0;
    final private static int REGION_TRACK_INDEX = 1;

    protected JSONArray _ideogramKeys = null;

    protected Boolean _binFeatures = false;

    public abstract String prepareSql(String idSql);
    public abstract String getDisplayRecordType();
    public abstract void setIdeogramKeys();
    public abstract JSONArray buildFeatureAnnotationJson(JSONArray featureList);

    public IdeogramJSONReporter(AnswerValue answerValue) {
        super(answerValue);
    }

    @Override
    public Reporter configure(JSONObject config) throws ReporterConfigException, WdkModelException {
        if (config.has(BIN_FEATURES_OPTION)) {
            _binFeatures = (Boolean) config.get(BIN_FEATURES_OPTION);
        }
        return this;
    }

    @Override
    public String getDownloadFileName() {
        return _baseAnswer.getAnswerSpec().getQuestion().getName() + "_ideogram.json";
    }

    @Override
    protected void write(OutputStream out) throws WdkModelException {
        try (JsonWriter writer = new JsonWriter(out)) {
            writeJson(_baseAnswer, writer);
        } catch (IOException e) {
            throw new WdkModelException("Unable to write reporter result to output stream", e);
        }
    }

   

    /*
     * (non-Javadoc)
     * 
     * @see org.gusdb.wdk.view.SummaryViewHandler#process(org.gusdb.wdk.model.user
     * .Step)
     */

    private void writeJson(AnswerValue answerValue, JSONWriter writer) throws WdkModelException {
        logger.debug("Entering IdeogramJSONReporter...");

        DataSource dataSource = answerValue.getAnswerSpec().getQuestion().getWdkModel().getAppDb().getDataSource();
        writer.object();

        writer.key("record_type").value(getDisplayRecordType());

        // don't render
        if (answerValue.getResultSizeFactory().getResultSize() > MAX_FEATURE_LIMIT) {
            writer.key(EXCEEDS_LIMIT_PROP).value(true);
            writer.endObject();
            return;
        }

        else {
            writer.key(EXCEEDS_LIMIT_PROP).value(false);

            setIdeogramKeys();
            JSONObject annotation = new JSONObject();
            annotation.put("keys", _ideogramKeys);

            JSONArray featureAnnotation = null;
            ResultSet features = null;
            try {
                // compose an sql to get all sequences from the feature id query.
                String idSql = answerValue.getIdSql();
                String sql = prepareSql(idSql);
                features = SqlUtils.executeQuery(dataSource, sql, "genome-view", 2000);

                if (_binFeatures)
                    featureAnnotation = buildBinnedAnnotationJson(dataSource, features);
                else
                    featureAnnotation = buildAnnotationJson(features);

                annotation.put("annots", featureAnnotation);
                writer.key("ideogram_annotation").value(annotation);
                writer.endObject();
            }

            catch (SQLException ex) {
                logger.error(ex);
                ex.printStackTrace();
                throw new WdkModelException(ex);
            }

            finally {
                SqlUtils.closeResultSetAndStatement(features, null);
            }
        }

    }

    private JSONArray buildBinnedAnnotationJson(DataSource dataSource, ResultSet results) throws SQLException {

        JSONArray annotation = new JSONArray();

        JSONObject chrSizes = fetchChromosomeSizes(dataSource);

        while (results.next()) {
            JSONObject chrAnnotation = new JSONObject();

            String chr = results.getString(COLUMN_CHROMOSOME);
            chrAnnotation.put("chr", results.getString(COLUMN_CHROMOSOME));
            Integer size = (Integer) chrSizes.get(chr);

            List<Region> regions = createRegions(chr, size.longValue(),
                    new JSONArray(results.getString(COLUMN_FEATURE_JSON)));
            chrAnnotation.put("annots", buildRegionAnnotationJson(regions));

            annotation.put(chrAnnotation);
        }
        return annotation;
    }

    private JSONArray buildRegionAnnotationJson(List<Region> regions) {
        JSONArray annotation = new JSONArray();
        for (Region region : regions) {
            int numFeatures = region.getNumFeatures();
            JSONArray regionAnnotation = new JSONArray();

            if (numFeatures == 1) { // then treat as a feature annotation
                JSONObject feature = (JSONObject) region.getFeatures().get(0);
                regionAnnotation.put(feature.get(FIELD_DISPLAY_ID)); // name
                regionAnnotation.put(feature.get(FIELD_START_POSITION)); // location
                regionAnnotation.put(feature.get(FIELD_LENGTH)); // locatiorn
                regionAnnotation.put(TRACK_INDEX); // track index
                regionAnnotation.put(feature); // the features themselves
            } else {
                regionAnnotation.put(region.getName());
                regionAnnotation.put(region.getStart());
                regionAnnotation.put(region.getLength());
                regionAnnotation.put(REGION_TRACK_INDEX);
                regionAnnotation.put(region.getFeatures());
            }

            annotation.put(regionAnnotation);
        }
        return annotation;
    }

    private List<Region> createRegions(String chromosome, long chrSize, JSONArray featureList) {
        /* name, start, length, trackIndex, features {name/display/start} */
        List<Region> regions = new ArrayList<Region>();

        // features are already ordered in the featureList by location_start
        Region region = null;
        Iterator<Object> iterator = featureList.iterator();
        while (iterator.hasNext()) {
            JSONObject feature = (JSONObject) iterator.next();
            Integer fStart = (Integer) feature.get(FIELD_START_POSITION);
            if (region == null
                    || ((fStart.longValue() - region.getEnd()) / (double) chrSize) > MIN_FEATURE_PERCENT_GAP) {
                if (region != null) {
                    regions.add(region); // region exists but is too far from next feature, so time to create a new one
                }
                region = new Region(chromosome);
            }
            region.addFeature(feature);
        }

        regions.add(region); // done w/features but did not hit the region end mark

        return regions;
    }

    private JSONArray buildAnnotationJson(ResultSet results) throws SQLException {
        JSONArray annotation = new JSONArray();
        Set<String> uniqueChrs = new HashSet<String>();
        while (results.next()) {
            JSONObject chrAnnotation = new JSONObject();
            chrAnnotation.put("chr", results.getString(COLUMN_CHROMOSOME));
            uniqueChrs.add(results.getString(COLUMN_CHROMOSOME));

            JSONArray features = new JSONArray(results.getString(COLUMN_FEATURE_JSON));
            JSONArray featureAnnotation = buildFeatureAnnotationJson(features);
            chrAnnotation.put("annots", featureAnnotation);

            annotation.put(chrAnnotation);
        }

        return annotation;
    }

  
    private JSONObject fetchChromosomeSizes(DataSource dataSource) {
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = "SELECT json_object_agg(replace(chromosome, 'chr', ''), upper(location))::text AS chr_map" + NL
                + "FROM AnnotatedVDB.BinIndexRef WHERE level = 0";

        SQLRunner runner = new SQLRunner(dataSource, sql, "chromosome-query");
        runner.executeQuery(handler);

        List<Map<String, Object>> results = handler.getResults();
        return new JSONObject((String) results.get(0).get("chr_map"));
    }

} // end class
