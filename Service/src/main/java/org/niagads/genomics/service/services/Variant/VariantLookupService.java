package org.niagads.genomics.service.services.Variant;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.gusdb.fgputil.db.runner.BasicResultSetHandler;
import org.gusdb.fgputil.db.runner.SQLRunner;
import org.gusdb.wdk.model.WdkModel;
import org.gusdb.wdk.model.WdkModelException;
import org.gusdb.wdk.model.WdkRuntimeException;
import org.gusdb.wdk.service.service.AbstractWdkService;


@Path("variant")
public class VariantLookupService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(VariantLookupService.class);

    private static final String VARIANT_PARAM = "id";

    private static final String VARIANT_DETAILS_SQL = "WITH marker AS (" +NL
        + "SELECT find_variant_primary_key(?) AS record_pk)," + NL
        + "Details AS (" + NL
        + "SELECT v.record_pk AS variant, v.source_id AS ref_snp_id, v.metaseq_id," + NL 
        + "v.variant_class_abbrev AS variant_class, v.source AS variant_source," + NL 
        + "v.is_adsp_variant, v.is_adsp_wes, v.is_adsp_wgs, v.is_multi_allelic," + NL
        + "v.most_severe_consequence," + NL
        + "(v.annotation->'VEP_MS_CONSEQUENCE'->>'impact')::text AS most_severe_consequence_impact," + NL
        + "(v.annotation->>'GWAS')::boolean AS is_associated_with_NIAGADS_dataset," + NL
        + "(v.annotation->'VEP_MS_CONSEQUENCE'->>'gene_id')::text || ' // ' || (v.annotation->'VEP_MS_CONSEQUENCE'->>'gene_symbol')::text AS impacted_gene" + NL
        + "FROM marker, NIAGADS.Variant v" + NL
        + "WHERE v.record_pk = marker.record_pk)" + NL
        + "SELECT (json_agg(details)->0)::text AS result FROM details";

        @GET
        @Produces(MediaType.APPLICATION_JSON)
        // @OutSchema("niagads.variant.get-response")
        public Response buildResponse(String body, @QueryParam(VARIANT_PARAM) String variant) throws WdkModelException {
                                          
            LOG.info("Starting 'Variant Lookup' Service");
            String response = "{}";
            try {

                response = fetchResult(variant);
                if (response == null) {
                    response = "{}";
                }
            }
    
            catch(WdkRuntimeException ex) {
                throw new WdkModelException(ex);
            }
              
            return Response.ok(response).build();
        }

        private String fetchResult(String variant) {   
    
            WdkModel wdkModel = getWdkModel();
            DataSource ds = wdkModel.getAppDb().getDataSource();
            BasicResultSetHandler handler = new BasicResultSetHandler();
            
            LOG.debug("Fetching details for variant:" + variant);
    
          
            SQLRunner runner = new SQLRunner(ds, VARIANT_DETAILS_SQL, "variant-lookup-query");
    
           
            runner.executeQuery(new Object[] {variant}, handler);
           
            List <Map <String, Object>> results = handler.getResults();
            return (String) results.get(0).get("result");
        }
}