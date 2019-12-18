package org.niagads.genomics.service.services.Variant;

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


@Path("variant/ldwindow")
public class LinkageWindowService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(LinkageWindowService.class);

    private static final String RSID_PARAM = "rsid";
    private static final String VARIANT_PARAM = "variant";
    private static final String POPULATION_PARAM = "population";
    private static final String R2_THRESHOLD_PARAM = "r2";
    private static final String MAF_THRESHOLD_PARAM = "maf";
 

    private static final String LD_SQL = "SELECT MIN(position) AS start" + NL
        + ", MAX(position) AS end" + NL
        + ", MAX(REPLACE(chromosome, 'chr', '')) AS chr" + NL
        + ", REPLACE(chromosome, 'chr', '') || ':' || MIN(position)::text || '-' || MAX(position)::text AS ld_block" + NL
        + ", MAX(position) - MIN(position) AS block_size" + NL
        + "FROM NIAGADS.Variant nv, FilteredLinkage ld" + NL
        + "WHERE nv.variant_id = ld.variant_id" + NL
        + "GROUP BY chromosome" + NL

        //-- case if no LD

        + "UNION" + NL
        + "SELECT MIN(position) AS start" + NL
        + ", MAX(position) AS end" + NL
        + ", MAX(REPLACE(chromosome, 'chr', '')) AS chr" + NL
        + ", REPLACE(chromosome, 'chr', '') || ':' || MIN(position)::text || '-' || MAX(position)::text AS ld_block" + NL
        + ", MAX(position) - MIN(position) AS block_size" + NL
        + "FROM NIAGADS.Variant nv, variant v" + NL
        + "WHERE v.variant_id = nv.variant_id" + NL
        + "AND NOT EXISTS (SELECT * FROM FilteredLinkage)" + NL
        + "GROUP BY chromosome";
    

    private String buildFilteredLinkageSql(Boolean filterMaf) {
        String sql = "SELECT DISTINCT unnest(ld.variants) AS variant_id" + NL
            + "FROM Linkage ld, Population p" + NL
            + "WHERE p.protocol_app_node_id = ld.protocol_app_node_id" + NL
            + "AND ld.r_squared >= ?";
        if (filterMaf) {
            sql = sql + " AND minor_allele_frequency <= ARRAY[?::float]";
        }
        return sql;
    }
    
    private String buildQueryCTE() {
        String sql = "WITH Variant AS (" + NL
            + "SELECT ? AS variant_label, variant_id FROM (SELECT find_variant_id(?) AS variant_id) a"
            + ")," + NL
            + "Population AS (" + NL
            + "SELECT protocol_app_node_id FROM Study.ProtocolAppNode WHERE source_id = '1000GenomesLD_' || ?" + NL
            + ")," + NL
            + "Linkage AS (" + NL
            + "SELECT * FROM Results.VariantLD, Variant v" + NL
            + "WHERE ARRAY[v.variant_id::integer] <@ variants" + NL
            + ")," + NL
            + "FilteredLinkage AS (" + buildFilteredLinkageSql() + ")";

            return sql;
    }
    
  
  

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.locuszoom.linkage.get-response")
    public Response buildResponse(String body, @QueryParam(REFERENCE_VARIANT_PARAM) String variant, 
                                 /*@QueryParam(RANGE_START_PARAM) int start, 
                                 @QueryParam(RANGE_END_PARAM) int end,*/
                                 @QueryParam(POPULATION_PARAM) String population,
                                 @QueryParam(SCORE_PARAM) String scoreType) throws WdkModelException {
        LOG.info("Starting 'Locus Zoom Linkage' Service");
        String response = "{}";
        try {
            // query database for ld
            response = fetchLinkage(variant, population);
            LOG.debug("query result: " + response);
            // return result
        }

        catch(WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }
          
        return Response.ok(response).build();
    }

    private String fetchLinkage(String variant, String population) {   
    
        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();
        
        LOG.debug("Fetching linkage for variant:" + variant + "; population: " + population);

	String[] vDetails = variant.split(":", 2);
	String chromosome = "chr" + vDetails[0];

        SQLRunner runner = new SQLRunner(ds, LINKAGE_QUERY, "linkage-query");
        runner.executeQuery(new Object[] {variant, chromosome, population, variant, variant}, handler);

        List <Map <String, Object>> results = handler.getResults();
        return (String) results.get(0).get("result_json");
    }

}
