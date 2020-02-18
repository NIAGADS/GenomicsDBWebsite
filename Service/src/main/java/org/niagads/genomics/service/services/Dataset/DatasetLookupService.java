package org.niagads.genomics.service.services.Dataset;

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


@Path("dataset/lookup")
public class DatasetLookupService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(DatasetLookupService.class);
    private static final String ACCESSION_PARAM = "accession";

    private static final String ACCESSION_CTE = "SELECT accession," + NL 
        + "jsonb_build_object('name', da.name," + NL
        + "'description', da.description," + NL
        + "'accession', da.accession," + NL
        + "'source', da.accession_link->>'url'," + NL
        + "'attribution', da.attribution) AS details" + NL
        + "FROM NIAGADS.DatasetAttributes da" + NL
        + "WHERE da.accession = ?";
    
    private static final String CHAR_CTE = "SELECT track," + NL
        + "jsonb_agg(jsonb_build_object(characteristic_type, characteristic)) AS details" + NL
        + "FROM NIAGADS.ProtocolAppNodeCharacteristic" + NL
        + "GROUP BY track";
    
    private static final String QUERY_SQL="SELECT jsonb_build_object(" + NL
        + "'accession', a.details," + NL
        + "'datasets', jsonb_agg(" + NL
        + "jsonb_build_object('name', ta.name," + NL
        + "'description', ta.description," + NL
        + "'dataset_track_identifier', ta.track," + NL
        + "'phenotypes', c.details)))::text AS result" + NL
        + "FROM accession a," + NL
        + "NIAGADS.TrackAttributes ta," + NL
        + "TrackChars c" + NL
        + "WHERE a.accession = ta.dataset_accession" + NLd
        + "AND c.track = ta.track" + NL
        + "GROUP BY a.details";

    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.dataset.lookup.get-response")
    public Response buildResponse(String body
        , @QueryParam(ACCESSION_PARAM) String accession) throws WdkModelException {
        
        LOG.info("Starting 'DatasetLookup' Service");
        String response = "{}";
        try {
            response = lookupDatasets(accession);
            if (response == null) { response = "{}";}
            LOG.debug("query result: " + response);
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }
    
    private String lookupDatasets(String accession) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = "WITH accession AS (" + ACCESSION_CTE + ")," + NL
            + "TrackChars AS (" + CHAR_CTE + ")" + NL
            + QUERY_SQL;

        SQLRunner runner = new SQLRunner(ds, sql, "dataset-lookup-query");
        runner.executeQuery(new Object[] {accession}, handler);
        
        List <Map <String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result");
    }
}
