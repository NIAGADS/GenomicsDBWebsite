package org.niagads.genomics.service.services.GenomeBrowser;

import static org.gusdb.fgputil.FormatUtil.NL;

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


@Path("track/config")
public class TrackConfigService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(TrackConfigService.class);
    private static final String TYPE_PARAM = "type";
    private static final String TRACK_PARAM = "track"; 
    private static final String DATASOURCE_PARAM = "datasource";

    private static final String VARIANT_TRACK_SQL = "VariantTracks AS (" + NL
        + "SELECT track, 'variant'::text AS track_type, CASE WHEN track LIKE 'ADSP%' THEN 'ADSP' ELSE 'DBSNP' END AS datasource," + NL
        + "jsonb_build_object(" + NL
        + "'type', 'variant'," + NL
        + "'track', track," + NL
        + "'name', track_name," +  NL
        + "'description', description) AS track_config" + NL
        + "FROM (SELECT * FROM (VALUES" + NL 
        + "('ADSP', 'ADSP', 'Variants from the Alzheimer''s Disease Sequencing Project (ADSP) Whole Genome Sequencing (WGS) and Whole Exome Sequencing (WES) efforts that passed the ADSP biallelic quality control (QC) criteria. Variants are annotated by the ADSP Annotation Pipeline.')," + NL 
        + "('ADSP_WES', 'ADSP (WES)', 'Variants from the Alzheimer''s Disease Sequencing Project (ADSP) Whole Exome Sequencing (WES) effort - INDELs and SNVs that passed the ADSP biallelic quality control (QC) criteria. Variants are annotated by the ADSP Annotation Pipeline.'), " + NL
        + "('dbSNP', 'dbSNP bld 151', 'All variants from the NCBI dbSNP database of single nucleotide polymorphisms and small-scale variations. Variants are annotated by the ADSP Annotation Pipeline.')," + NL
        + "('dbSNP_COMMON', 'dbSNP bld 151 (COMMON)', 'Variants from the NCBI dbSNP database that are flagged as COMMON. Variants are annotated by the ADSP Annotation Pipeline.')" + NL
        + ") AS t (track, track_name, description))  a" + NL
        + "ORDER BY track)";
    
    private static final String GWAS_TRACK_PHENOTYPE_CTE = "GwasPhenotypes AS (" + NL
        + "SELECT track, 'covariates' AS characteristic_type," + NL 
        + " string_agg(characteristic, ', ') AS characteristic" + NL
        + "FROM NIAGADS.ProtocolAppNodeCharacteristic" + NL
        + "WHERE characteristic_type = 'covariate specification'" + NL
        + "GROUP BY track" + NL
        + "UNION ALL" + NL
        + "SELECT track, characteristic_type, characteristic" + NL
        + "FROM NIAGADS.ProtocolAppNodeCharacteristic" + NL
        + "WHERE characteristic_type != 'covariate specification')";

    private static final String GWAS_TRACK_SQL = GWAS_TRACK_PHENOTYPE_CTE + ", GwasTracks AS (" + NL 
        + "SELECT ta.track, 'gwas_summary_statistics' AS track_type, 'NIAGADS'::text AS datasource," + NL
        + "jsonb_build_object(" + NL
        + "'track', ta.track," + NL
        + "'label', ta.name," + NL
        + "'type', 'gwas_summary_statistics'," + NL
        + "'source', 'NIAGADS'," + NL
        + "'record', 'gwas_summary/' || ta.track," + NL
        + "'description', ta.description," + NL
        + "'name', ta.name || ' (' || ta.attribution || ')'," + NL
        + "'phenotypes', json_agg(jsonb_build_object(p.characteristic_type, p.characteristic))) AS track_config " + NL
        + "FROM GwasPhenotypes p," + NL
        + "NIAGADS.TrackAttributes ta" + NL
        + "WHERE p.track = ta.track" + NL
        + "AND ta.track LIKE 'NG%'" + NL
        + "GROUP BY ta.track, ta.name, ta.description, ta.attribution" + NL
        + "ORDER BY ta.track)";


    enum TrackType {
        //, TFBS, HISTONE_MOD, ENHANCER, EQTL;
        VARIANT("variant") {
            @Override 
            public String getTrackSql() {
                String sql = "WITH" + NL 
                    + VARIANT_TRACK_SQL + NL
                    + "SELECT * FROM VariantTracks";
                return sql;
            }    
        },
        GWAS("gwas") {
            @Override
            public String getTrackSql() {
                String sql =  "WITH" + NL 
                    + GWAS_TRACK_SQL + NL
                    + "SELECT * FROM GwasTracks";
                return sql;
            }
        },
        ALL("all") {
            @Override
            public String getTrackSql() {
                String sql = "WITH" + NL 
                    + VARIANT_TRACK_SQL + ',' + NL
                    + GWAS_TRACK_SQL + NL
                    + "SELECT * FROM VariantTracks" + NL
                    + "UNION ALL" + NL
                    + "SELECT * FROM GwasTracks";
                return sql;
            }
        };

        TrackType(String _type) {};
        public String getTrackSql() {return null;}
    }

    enum TrackDataSource {
        NIAGADS("NIAGADS") {
            @Override
            public boolean isValidDataSource() {return true;};
        },
        ADSP("ADSP") {
            @Override
            public boolean isValidDataSource() {return true;}
        },
        DBSNP ("DBSNP") {
            @Override
            public boolean isValidDataSource() {return true;}
        };

        public boolean isValidDataSource() {return false;}

        TrackDataSource(String _source) {};
    }

    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.config.get-response")
    public Response buildResponse(String body
        , @QueryParam(TYPE_PARAM) String trackType
        , @QueryParam(TRACK_PARAM) String tracks
        , @QueryParam(DATASOURCE_PARAM) String datasources ) throws WdkModelException {
        
        LOG.info("Starting 'TrackConfig' Service");
        String response = "{}";
        try {
            String sql = buildQuery(trackType, tracks, datasources);

            response = lookup(sql);
            if (response == null) { response = "{}";}
            LOG.debug("query result: " + response);
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }


    private String buildQuery(String trackType, String tracks, String dataSources) {
        String sql = "SELECT jsonb_agg(track_config)::text AS result FROM (" + NL 
            + TrackType.valueOf(trackType.toUpperCase()).getTrackSql() + ") tjson";
        return sql;
    }

    private String lookup(String querySql) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, querySql, "track-lookup-query");
        runner.executeQuery(handler);
        
        List <Map <String, Object>> results = handler.getResults();
        if (!results.isEmpty())
            return (String) results.get(0).get("result");
    
        return null;
    }
}
