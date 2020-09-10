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

    private static final String GWAS_TRACK_SQL = "WITH Phenotypes AS (" + NL
        + "SELECT track, 'covariates' AS characteristic_type," + NL 
        + " string_agg(characteristic, ', ') AS characteristic" + NL
        + "FROM NIAGADS.ProtocolAppNodeCharacteristic" + NL
        + "WHERE characteristic_type = 'covariate specification'" + NL
        + "GROUP BY track" + NL
        + "UNION ALL" + NL
        + "SELECT track, characteristic_type, characteristic" + NL
        + "FROM NIAGADS.ProtocolAppNodeCharacteristic" + NL
        + "WHERE characteristic_type != 'covariate specification')," + NL
        + "tracks AS (" + NL 
        + "SELECT jsonb_build_object(" + NL
        + "'track', ta.track," + NL
        + "'label', ta.name," + NL
        + "'type', 'gwas_summary_statistics'," + NL
        + "'source', 'NIAGADS'," + NL
        + "'record', 'gwas_summary/' || ta.track," + NL
        + "'description', ta.description," + NL
        + "'name', ta.name || ' (' || ta.attribution || ')'," + NL
        + "'phenotypes', json_agg(jsonb_build_object(p.characteristic_type, p.characteristic))) AS track_config " + NL
        + "FROM Phenotypes p," + NL
        + "NIAGADS.TrackAttributes ta" + NL
        + "WHERE p.track = ta.track" + NL
        + "AND ta.track LIKE 'NG%'" + NL
        + "GROUP BY ta.track, ta.name, ta.description, ta.attribution)" + NL
        + "SELECT jsonb_agg(track_config)::text AS result FROM tracks";


    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.config.get-response")
    public Response buildResponse(String body
        , @QueryParam(TYPE_PARAM) String trackType, @QueryParam(TRACK_PARAM) String tracks ) throws WdkModelException {
        
        LOG.info("Starting 'TrackConfig' Service");
        String response = "{}";
        try {
            response = lookup(trackType);
            if (response == null) { response = "{}";}
            LOG.debug("query result: " + response);
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }
    
    private String lookup(String trackType) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, GWAS_TRACK_SQL, "track-lookup-query");
        runner.executeQuery(handler);
        
        List <Map <String, Object>> results = handler.getResults();
        if (!results.isEmpty())
            return (String) results.get(0).get("result");
    
        return null;
    }
}
