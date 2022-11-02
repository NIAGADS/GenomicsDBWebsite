package org.niagads.genomics.service.services.GenomeBrowser;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.gusdb.wdk.service.service.AbstractWdkService;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.common.base.Enums;

@Path("track/config")
public class TrackConfigService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(TrackConfigService.class);
    private static final String TYPE_PARAM = "feature_type";
    private static final String TRACK_PARAM = "track";
    private static final String DATASOURCE_PARAM = "source";
    private static final String GENOME_BUILD = "assembly";

    private static final String GWAS_TRACK_TYPE = "gwas_service";
    private static final String VARIANT_TRACK_TYPE = "variant_service";
    private static final String FUNCTIONAL_GENOMICS_TRACK_TYPE = "annotation";

    private static final String GENE_TRACK_SQL = "GeneTracks AS (" + NL
            + "SELECT track, 'gene'::text AS track_type, source AS datasource," + NL
            + "jsonb_build_object(" + NL
            + "'track', track," + NL
            + "'feature_type', 'Gene'," + NL
            + "'track_type_display', 'Gene Annotation'," + NL
            + "'track_type', 'annotation'," + NL // refseq
            + "'endpoint', '@SERVICE_BASE_URI@/track/gene'," + NL
            + "'label', label," + NL
            + "'source', source," + NL
            + "'name', name," + NL
            + "'description', description" + NL
            + "FROM NIAGADS.GenomeBrowserTrackConfig WHERE feature_type = 'gene'"
            + ") AS track_config)";

    private static final String VARIANT_TRACK_SQL = "VariantTracks AS (" + NL
            + "SELECT track, 'variant'::text AS track_type, CASE WHEN track LIKE 'ADSP%' THEN 'ADSP' ELSE 'DBSNP' END AS datasource,"
            + NL
            + "jsonb_build_object(" + NL
            + "'track', track," + NL
            + "'feature_type', feature_type," + NL
            + "'track_type_display', 'Variant Annotation'," + NL
            + "'track_type', '" + VARIANT_TRACK_TYPE + "'," + NL
            + "'endpoint', '@SERVICE_BASE_URI@/track/variant'," + NL
            + "'label', label," + NL
            + "'name', name," + NL
            + "'source', CASE WHEN track LIKE 'ADSP%' THEN 'ADSP' ELSE 'DBSNP' END," + NL
            + "'description', description) AS track_config" + NL
            + "FROM NIAGADS.GenomeBrowserTrackConfig WHERE track_type = 'variant'"
            + "ORDER BY track)";

    private static final String GWAS_PHENOTYPES_SQL = "SELECT" + NL
            + "DISTINCT jsonb_object_keys(track_config->'biosample_characteristics')" + NL
            + " AS characteristic_types FROM NIAGADS.GWASBrowserTracks";

    private static final String GWAS_TRACK_SQL = "SELECT" + NL
            + "track, track_type, data_source, track_config" + NL
            + "FROM NIAGADS.GWASBrowserTracks";

    private static final String FUNCTIONAL_GENOMICS_SQL = "SELECT" + NL
            + "track, track_type, data_source, track_config" + NL
            + "FROM NIAGADS.FILERBrowserTracks" + NL
            + "WHERE track_type = ?";

    enum TrackType {
        // , TFBS, HISTONE_MOD, ENHANCER, EQTL;
        VARIANT("variant") {
            @Override
            public String getTrackSql() {
                String sql = "WITH" + NL
                        + VARIANT_TRACK_SQL + NL
                        + "SELECT * FROM VariantTracks";
                return sql;
            }
        },
        GENE("gene") {
            @Override
            public String getTrackSql() {
                String sql = "WITH" + NL
                        + GENE_TRACK_SQL + NL
                        + "SELECT * FROM GeneTracks";
                return sql;
            }
        },
        GWAS("gwas") {
            @Override
            public String getTrackSql() {
                String sql = "WITH" + NL
                        + GWAS_TRACK_SQL + NL
                        + "SELECT * FROM GwasTracks";
                return sql;
            }
        },
        ENHANCER("enhancer") {
            @Override
            public String getTrackSql() {
                String sql = "WITH" + NL
                        + ENHANCER_TRACK_SQL + NL
                        + "SELECT * FROM EnhancerTracks";
                return sql;
            }
        },
        ALL("all") {
            @Override
            public String getTrackSql() {
                String sql = "WITH" + NL
                        + VARIANT_TRACK_SQL + ',' + NL
                        + GWAS_TRACK_SQL + ',' + NL
                // + GENE_TRACK_SQL + ',' + NL
                        + ENHANCER_TRACK_SQL + NL
                        + "SELECT * FROM VariantTracks" + NL
                        + "UNION ALL" + NL
                        + "SELECT * FROM GwasTracks" + NL
                // + "UNION ALL" + NL
                // + "SELECT * FROM GeneTracks" + NL
                        + "UNION ALL" + NL
                        + "SELECT * FROM EnhancerTracks";
                return sql;
            }
        };

        TrackType(String _type) {
        };

        public String getTrackSql() {
            return null;
        }
    }

    private boolean isValidTrackType(String name) {
        TrackType tt = Enums.getIfPresent(TrackType.class, name).orNull();
        return (tt == null) ? false : true;
    }

    enum TrackDataSource {
        NIAGADS("NIAGADS") {
            @Override
            public boolean isValidDataSource() {
                return true;
            };
        },
        GENCODE("GENCODE") {
            @Override
            public boolean isValidDataSource() {
                return true;
            };
        },
        ENSEMBL("ENSEMBL") {
            @Override
            public boolean isValidDataSource() {
                return true;
            };
        },
        ADSP("ADSP") {
            @Override
            public boolean isValidDataSource() {
                return true;
            }
        },
        ROADMAP("ROADMAP") {
            @Override
            public boolean isValidDataSource() {
                return true;
            }
        },
        FILER("FILER") {
            @Override
            public boolean isValidDataSource() {
                return true;
            }
        },
        DBSNP("DBSNP") {
            @Override
            public boolean isValidDataSource() {
                return true;
            }
        };

        public boolean isValidDataSource() {
            return false;
        }

        TrackDataSource(String _source) {
        };
    }

    private boolean isValidDataSource(String name) {
        TrackDataSource tds = Enums.getIfPresent(TrackDataSource.class, name).orNull();
        return (tds == null) ? false : true;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.config.get-response")
    public Response buildResponse(String body, @QueryParam(TYPE_PARAM) String trackType,
            @QueryParam(TRACK_PARAM) String tracks, @QueryParam(DATASOURCE_PARAM) String dataSources,
            @QueryParam(GENOME_BUILD) String assembly) throws WdkModelException {

        LOG.info("Starting 'TrackConfig' Service");
        String response = "{}";
        try {

            JSONObject validatedDataSources = validateDataSources(dataSources);
            String dsLookup = null;
            if (validatedDataSources != null && (int) validatedDataSources.get("valid_count") > 0) {
                dsLookup = (String) validatedDataSources.get("valid_string");
            }

            // trackType = validateTrackType(trackType);
            if (trackType == null) {
                trackType = "all";
            }

            String sql = buildQuery(trackType, tracks, dsLookup);
            response = lookup(sql);

            if (response == null) {
                response = "{}";
            }
            ;
            // LOG.debug("query result: " + response);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private JSONObject validateDataSources(String dataSources) {
        JSONArray valid = new JSONArray();
        JSONArray invalid = new JSONArray();
        if (dataSources != null) {
            List<String> sources = Arrays.asList(dataSources.split(","));
            for (String s : sources) {
                if (isValidDataSource(s.toUpperCase())) {
                    valid.put(s.toUpperCase());
                } else {
                    invalid.put(s);
                }
            }

            JSONObject result = new JSONObject();
            if (valid.length() > 0) {
                result.put("valid_string", buildDataSourceString(valid));
            }

            result.put("valid", valid);
            result.put("invalid", invalid); // for error reporting
            result.put("valid_count", valid.length());
            result.put("invalid_count", invalid.length());
            LOG.debug("Datasource Validation Result: " + result.toString());
            return result;
        }

        return null;
    }

    private String buildDataSourceString(JSONArray sources) {

        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < sources.length(); i++) {
            builder.append((String) sources.get(i));
            builder.append("|");
        }
        String dsStr = builder.toString();
        if (dsStr.endsWith("|")) {
            dsStr = dsStr.substring(0, dsStr.length() - 1);
        }
        LOG.debug("Valid Datasources: " + dsStr);
        return dsStr; // remove trailing comma
    }

    private String replaceEndpoints(String sql) {
        String serviceBaseUri = getContextUri() + "/service";
        return sql.replace("@SERVICE_BASE_URI@", serviceBaseUri);
    }

    private String replaceFilerUrl(String sql) throws WdkModelException {
        String filerUrl = getWdkModel().getProperties().get("FILER_TRACK_URL");
        if (filerUrl == null) {
            throw new WdkModelException("Need to specify FILER_TRACK_URL in model.prop");
        }
        LOG.debug(sql.replace("@FILER_TRACK_URL@", filerUrl));
        return sql.replace("@FILER_TRACK_URL@", filerUrl);
    }

    private String replaceVersions(String response) throws WdkModelException {
        String genomeBuild = getWdkModel().getProperties().get("GENOME_BUILD");
        if (genomeBuild == null) {
            throw new WdkModelException("Need to specify GENOME_BUILD in model.prop");
        }

        String gencodeVersion = getWdkModel().getProperties().get("GENCODE_VERSION");
        if (gencodeVersion == null) {
            throw new WdkModelException("Need to specify GENCODE_VERSION in model.prop");
        }

        String dbSnpVersion = getWdkModel().getProperties().get("dbSNP_VERSION");
        if (dbSnpVersion == null) {
            throw new WdkModelException("Need to specify dbSNP_VERSION in model.prop");
        }

        return response.replace("+GENOME_BUILD+", genomeBuild)
                .replace("+GENCODE_VERSION+", gencodeVersion)
                .replace("+DBSNP_VERSION+", dbSnpVersion);
    }

    private String buildQuery(String trackType, String tracks, String dataSources) throws WdkModelException {

        String sql = "SELECT jsonb_agg(track_config)::text AS result FROM (" + NL
                + TrackType.valueOf(trackType.toUpperCase()).getTrackSql() + ") tjson";

        if (dataSources != null) {
            sql = sql + NL + "WHERE datasource ~* '" + dataSources + "'";
        }

        return replaceFilerUrl(replaceEndpoints(sql));
    }

    private String lookup(String querySql) throws WdkModelException {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        // LOG.debug(querySql);
        SQLRunner runner = new SQLRunner(ds, querySql, "track-lookup-query");
        runner.executeQuery(handler);

        List<Map<String, Object>> results = handler.getResults();
        if (!results.isEmpty())
            return replaceVersions((String) results.get(0).get("result"));

        return null;
    }
}
