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

    // TODO add variant lookup back in
    private static final String GENE_LOOKUP_SQL = "SELECT jsonb_agg(location)::text AS result" + NL
            + "FROM (" + NL
            + "SELECT jsonb_build_object('chromosome', chromosome," + NL 
            + "'start', location_start, 'end', location_end) AS location" + NL
            + "FROM CBIL.GeneAttributes" + NL
            + "WHERE gene_symbol = ? OR source_id = ? OR annotation->>'entrez_id' = ?) a";

    private static final String VARIANT_POSITION_LOOKUP_SQL = "SELECT jsonb_agg(location)::text AS result" + NL
        + "FROM (" + NL
        + "SELECT jsonb_build_object('chromosome', split_part(?, ':', 1)::text," + NL
        + "'start', split_part(?, ':', 2)::integer - 25," + NL
        + "'end', split_part(?, ':', 2)::integer  + 25) AS location) a";

    private static final String VARIANT_LOOKUP_SQL = "SELECT jsonb_agg(DISTINCT location)::text AS result" + NL
        + "FROM (" + NL
        + "SELECT jsonb_build_object('chromosome', 'chr' || split_part(metaseq_id, ':', 1)::text," + NL
        + "'start', da.location_start - 25," + NL
        + "'end', da.location_end + 25) AS location" + NL
        + "FROM find_variant_by_refsnp(?::text) v," + NL
        + "normalize_alleles(split_part(v.metaseq_id, ':', 3), split_part(v.metaseq_id, ':', 4)) na," + NL
        + "display_allele_attributes(split_part(v.metaseq_id, ':', 3), split_part(v.metaseq_id, ':', 4), na.ref, na.alt, split_part(v.metaseq_id, ':', 2)::int) da" + NL
        + ") a";
        
    @GET    
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.feature.get-response")
    public Response buildResponse(String body
        , @QueryParam(ID_PARAM) String id ) throws WdkModelException {
        
        LOG.info("Starting 'TrackConfig' Service");
        String response = "[{}]";
        try {
            response = lookup(id, isPositionalVariant(id));
            LOG.debug("query result: " + response);
        }
        
        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
        
        return Response.ok(response).build();
    }
    
    private boolean isPositionalVariant(String id) {
        CharSequence delim = ":";
        return id.contains(delim);
    }

    private boolean isRefSnp(String id) {
        return id.toLowerCase().startsWith("rs");
    }

    // first pass -- variant only if positional, b/c some genes start w/RS
    private String lookup(String id, boolean isVariant) {   
        
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        String sql = (isVariant) ? selectVariantQuerySql(id) : GENE_LOOKUP_SQL;
        if (isVariant) {
            LOG.debug(sql);
        }

        SQLRunner runner = new SQLRunner(ds, sql, "track-feature-lookup-query");
   
        if (isVariant && isRefSnp(id)) {
            runner.executeQuery(new Object[] {id}, handler);
        }
        else {
            runner.executeQuery(new Object[] {id, id, id}, handler);
        }
        
        List <Map <String, Object>> results = handler.getResults();
        String resultStr = null;
        if (!results.isEmpty()) 
            resultStr = (String) results.get(0).get("result");

        if (resultStr == null) {
            if (!isVariant && isRefSnp(id))  // not a gene starting w/RS, so assume refSnp ID, end condition for recursion
                return lookup(id, true);
            else
                return "[{}]";
        }
        else {
            return resultStr;
        }    
    }

    private String selectVariantQuerySql(String id) {
        if (isPositionalVariant(id)) {
            return VARIANT_POSITION_LOOKUP_SQL;
        }
        else if (isRefSnp(id)) {
            return VARIANT_LOOKUP_SQL;
        }
        return null;
    }
}
