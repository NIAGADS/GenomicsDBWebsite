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


@Path("track/feature")
public class FeatureLookupService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(FeatureLookupService.class);
    private static final String ID_PARAM = "id";

    private static final String LOOKUP_SQL = "SELECT jsonb_agg(location)::text AS result" + NL
            + "FROM (" + NL
            + "SELECT DISTINCT jsonb_build_object('chromosome', chromosome," + NL 
            + "'start', location_start, 'end', location_end) AS location" + NL
            + "FROM NIAGADS.Variant WHERE source_id = ?" + NL
            + "UNION" + NL
            + "SELECT jsonb_build_object('chromosome', chromosome," + NL 
            + "'start', location_start, 'end', location_end) AS location" + NL
            + "FROM CBIL.GeneAttributes" + NL
            + "WHERE gene_symbol = ? OR source_id = ? OR annotation->>'entrez_id' = ?) a";

    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.feature.get-response")
    public Response buildResponse(String body
        , @QueryParam(ID_PARAM) String id ) throws WdkModelException {
        
        LOG.info("Starting 'TrackConfig' Service");
        String response = "{}";
        try {
            response = lookup(id);
            if (response == null) { response = "{}";}
            LOG.debug("query result: " + response);
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }
    
    private String lookup(String id) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, LOOKUP_SQL, "track-feature-lookup-query");
        runner.executeQuery(new Object[] {id, id, id, id}, handler);
        
        List <Map <String, Object>> results = handler.getResults();
        if (!results.isEmpty())
            return (String) results.get(0).get("result");
    
        return null;
    }
}
