package org.niagads.genomics.service.services.LocusZoom;

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


@Path("locuszoom/gene")
public class LZGeneService extends AbstractWdkService {
    private static final Logger LOG = Logger.getLogger(LZGeneService.class);

    private static final String CHROMOSOME_PARAM = "chromosome";
    private static final String LOCATION_START_PARAM = "start";
    private static final String LOCATION_END_PARAM = "end";

    private static final String LOOKUP_SQL = "WITH span AS (" + NL
        + "SELECT ? AS chromosome, ? AS location_start, ? AS location_end," + NL
        + "find_bin_index(?, ?, ?) AS bin_index)," + NL
        
        + "gene AS (" + NL
        + "SELECT ga.source_id," + NL
        + "CASE WHEN ga.is_reversed THEN '-' ELSE '+' END AS strand," + NL
        + "ga.location_start, ga.location_end," + NL
        + "jsonb_build_object(" + NL
        + "'chrom', replace(ga.chromosome, 'chr', '')," + NL
        + "'start', ga.location_start," + NL
        + "'end', ga.location_end," + NL
        + "'gene_name', ga.gene_symbol," + NL
        + "'gene_id', ga.source_id," + NL
        + "'strand', CASE WHEN ga.is_reversed THEN '-' ELSE '+' END," + NL
        + "'gene_type', replace(ga.gene_type, ' ', '_')) AS json_obj" + NL
        + "FROM CBIL.GeneAttributes ga, span" + NL
        + "WHERE span.bin_index @> ga.bin_index" + NL
        + "AND int8range(span.location_start, span.location_end, '[]') && int8range(ga.location_start, ga.location_end, '[]')" + NL
        + ")," + NL
        
        + "exons AS (" + NL
        + "SELECT gene.source_id AS gene_source_id," + NL
        + "e.exon_source_id, " + NL
        + "e.transcript_source_id," + NL
        + "e.location_start, e.location_end, " + NL
        + "jsonb_build_object(" + NL
        + "'chromosome', replace(e.chromosome, 'chr', '')," + NL
        + "'start', e.location_start," + NL
        + "'end', e.location_end," + NL
        + "'strand', gene.strand," + NL
        + "'exon_id', e.exon_source_id) AS json_obj" + NL
        + "FROM NIAGADS.ExonAttributes e, gene" + NL
        + "WHERE gene.source_id = e.gene_source_id)," + NL
        
        + "gene_exons AS (" + NL
        + "SELECT gene_source_id, json_agg(json_obj ORDER BY location_start, location_end) AS json_obj" + NL
        + "FROM (SELECT DISTINCT gene_source_id, json_obj, location_start, location_end FROM exons) AS ue" + NL
        + "GROUP BY gene_source_id)," + NL
        
        + "transcripts AS (" + NL
        + "SELECT gene.source_id AS gene_source_id," + NL
        + "ta.transcript_source_id," + NL
        + "ta.location_start, ta.location_end," + NL
        + "jsonb_build_object(" + NL
        + "'chromosome', replace(ta.chromosome, 'chr', '')," + NL
        + "'start', ta.location_start," + NL
        + "'end', ta.location_end," + NL
        + "'strand', gene.strand," + NL
        + "'transcript_id', ta.transcript_source_id," + NL
        + "'exons', jsonb_agg(exons.json_obj ORDER BY exons.location_start, exons.location_end)" + NL
        + ") AS json_obj" + NL
        + "FROM NIAGADS.TranscriptAttributes ta, gene, exons" + NL
        + "WHERE gene.source_id = ta.gene_source_id" + NL
        + "AND exons.transcript_source_id = ta.transcript_source_id" + NL
        + "GROUP BY gene.source_id, ta.transcript_source_id," + NL
        + "ta.chromosome, ta.location_start, ta.location_end," + NL
        + "gene.strand)," + NL
        
        + "gene_transcripts AS (" + NL
        + "SELECT gene_source_id, json_agg(json_obj ORDER BY location_start, location_end) AS json_obj" + NL
        + "FROM (SELECT DISTINCT gene_source_id, json_obj, location_start, location_end FROM transcripts) AS ut" + NL
        + "GROUP BY gene_source_id)" + NL
        
        + "SELECT replace(jsonb_build_object('data', jsonb_agg(gene.json_obj" + NL 
        + "|| jsonb_build_object('transcripts', gene_transcripts.json_obj, 'exons', gene_exons.json_obj)" + NL
        + "ORDER BY gene.location_start, gene.location_end))::text, 'null', '[]') AS result" + NL
        + "FROM gene, gene_transcripts, gene_exons" + NL
        + "WHERE gene.source_id = gene_transcripts.gene_source_id" + NL
        + "AND gene.source_id = gene_exons.gene_source_id";
  
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @OutSchema("niagads.locuszoom.gene.get-response")
    public Response buildResponse(String body, 
            @QueryParam(CHROMOSOME_PARAM) String chromosome, @QueryParam(LOCATION_END_PARAM) int locEnd,
            @QueryParam(LOCATION_START_PARAM) int locStart) throws WdkModelException {

        
        LOG.info("Starting 'Locus Zoom Gene' Service");
        String response = null;

        try {
           response = lookupSpan(chromosome, locStart, locEnd);       
           // LOG.debug("query result: " + response);
        }

        catch (WdkRuntimeException ex) {
            throw new WdkModelException(ex);
        }

        return Response.ok(response).build();
    }

    private String lookupSpan(String chromosome, int locationStart, int locationEnd) {

        WdkModel wdkModel = getWdkModel();
        DataSource ds = wdkModel.getAppDb().getDataSource();
        BasicResultSetHandler handler = new BasicResultSetHandler();

        SQLRunner runner = new SQLRunner(ds, LOOKUP_SQL, "lz-gene-data-query");
        runner.executeQuery(new Object[] { chromosome, locationStart, locationEnd, chromosome, locationStart, locationEnd }, handler);
        
        List<Map<String, Object>> results = handler.getResults();
        if (results.isEmpty()) {
            return "{data: []}";
        }

        String resultStr = (String) results.get(0).get("result");
        if (resultStr == "null" || resultStr == null) {
            return "{data: []}";
        }

        //LOG.debug("RESULT:  " + resultStr);
        return resultStr;
    }
}
