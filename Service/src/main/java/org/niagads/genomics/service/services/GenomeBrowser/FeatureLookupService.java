package org.niagads.genomics.service.services.GenomeBrowser;

import static org.gusdb.fgputil.FormatUtil.NL;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;
import javax.ws.rs.DefaultValue;
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

@Path("track/feature")
public class FeatureLookupService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(FeatureLookupService.class);
    private static final String ID_PARAM = "id";
    private static final String FLANK_PARAM = "flank";

    // TODO add variant lookup back in

    private static final String ID_CTE = "WITH lookup AS (SELECT ?::text AS id, ?::int AS flank)";

    private static final String VARIANT_ID_CTE = "variantId AS (" + NL
            + "SELECT lookup.flank, find_variant_primary_key(lookup.id) AS mapped_pk" + NL
            + "FROM lookup)";

    private static final String VARIANT_LOC_CTE = "variant AS (" + NL
            + "SELECT variantId.flank, v.details->>'chromosome' AS chr," + NL
            + "v.details->>'location' AS span" + NL
            + "FROM variantId," + NL
            + "get_variant_display_details(variantId.mapped_pk) v)";

    private static final String GENE_LOOKUP_SQL = "SELECT jsonb_build_object(" + NL
            + "'chromosome', chromosome," + NL
            + "'start', location_start - lookup.flank, " + NL
            + "'end', location_end + lookup.flank) AS location" + NL
            + "FROM CBIL.GeneAttributes, lookup" + NL
            + "WHERE lower(gene_symbol) = lower(lookup.id)" + NL
            + "OR source_id = lookup.id" + NL
            + "OR annotation->>'entrez_id' = lookup.id";

    private static final String VARIANT_LOOKUP_SQL = VARIANT_ID_CTE + "," + NL
            + VARIANT_LOC_CTE + NL
            + "SELECT jsonb_build_object(" + NL
            + "'chromosome', chr," + NL
            + "'start'," + NL
            + "CASE WHEN span LIKE '%-%'" + NL
            + "THEN split_part(span, ' - ', 1)::int" + NL
            + "ELSE span::int END - flank," + NL
            + "'end'," + NL
            + "CASE WHEN span LIKE '%-%'" + NL
            + "THEN split_part(span, ' - ', 2)::int" + NL
            + "ELSE span::int END + flank) AS location" + NL
            + "FROM variant";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.track.feature.get-response")
    public Response buildResponse(String body, @DefaultValue("0") @QueryParam(FLANK_PARAM) int flank,
            @QueryParam(ID_PARAM) String id) throws WdkModelException {

        LOG.info("Starting 'TrackConfig' Service");
        String response = "[{}]";
        try {
            // replace chr:pos:ref/alt or chr:pos:ref_alt with chr:pos:ref:alt
            String[] values = id.split(":");

            if (values.length == 2) {
                String chromosome = values[0].contains("chr") ? values[0] : "chr" + values[0];
                int start = values[1].contains("-") ? Integer.valueOf(values[1].split("-")[0])
                        : Integer.valueOf(values[1]);
                int end = values[1].contains("-") ? Integer.valueOf(values[1].split("-")[1]) : start;
                JSONObject rJson = new JSONObject();
                rJson.put("chromosome", chromosome);
                rJson.put("start", start - flank);
                rJson.put("end", end + flank);
                JSONArray rArray = new JSONArray();
                rArray.put(rJson);
                return Response.ok(rArray).build();
            } else {
                response = lookup(id, flank);
            }

            LOG.debug("query result: " + response);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    // first pass -- variant only if positional, b/c some genes start w/RS
    private String lookup(String id, int flank) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        if (id.contains(":")) {
            id = id.replace("_", ":").replace("/", ":")
                    .replace("chr", "").replace("CHR", "");
        }

        String sql = "SELECT jsonb_agg(location)::text AS result" + NL
                + "FROM (" + NL
                + ID_CTE + "," + NL
                + VARIANT_LOOKUP_SQL + NL
                + "UNION ALL" + NL
                + GENE_LOOKUP_SQL + NL
                + ") a";

        LOG.debug("Featuere Lookup SQL: " + sql);

        SQLRunner runner = new SQLRunner(ds, sql, "track-feature-lookup-query");

        runner.executeQuery(new Object[] { id, flank }, handler);

        List<Map<String, Object>> results = handler.getResults();
        String resultStr = null;
        if (!results.isEmpty())
            resultStr = (String) results.get(0).get("result");

        if (resultStr == null) {
            return "[{}]";
        } else {
            return resultStr;
        }
    }

}
