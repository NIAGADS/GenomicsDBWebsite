import { DocumentationItem } from "./Documentation";

const questions: DocumentationItem[] = [
    {
        anchor: "lift-over",
        title: "Many of the GRCh38 summary statistics datasets in the GenomicsDB were lifted over from GRCh37.  How was this done?",
        text: 'If variants were identified by dbSNP refSNP IDs, GRCh38/hg38 coordinates are determined by mapping the refSNP identifier against the GenomicsDB variant reference set for GRCh37/hg19, with checks made for deprecated or synonymized rsIDs. In all other cases a two-stage lift over process was used.  A bed file capturing GRCh37 variant coordinates was generated for each dataset, which was then run through the UCSC Genome Browser liftOver script. Any unmapped or non-uniquely mapped variants were then submitted to the NCBI coordinate remapping service (<a href="https://www.ncbi.nlm.nih.gov/genome/tools/remap" target="_blank">Remap</a>). Any features left unmapped were dropped, as well as long-indels, which were not lifted over from GRCh37/hg19 to GRCh38/hg38 as there any lift over would have low confidence that the full sequence was conserved; that the allele sequences are most likely no longer valid on the newer assembly',
    },
    {
        anchor: "linkage",
        title: "How was Linkage Disequilibrium calculated and for which populations is it available?",
        text: 'Linkage-disequilibrium (LD) structure for 1000 Genomes super populations (GRCh37/hg19: phase 3 version 1 [11 May 2011] ; GRCh38/hg38: 1000 Genomes 30x ) were estimated using <a href="https://www.cog-genomics.org/plink/" target="_blank">PLINK v1.90b2i 64-bit</a>. Only LD-scores with r<sup>2</sup> ≥ 0.2 are stored in the GenomicsDB. Also available are LD-estimates for the European (non-Hispanic white) subset of the ADSP R3 17k whole genome sequencing (WGS) samples. These were calculated using <a href="https://github.com/statgen/emeraLD" target="_blank">emeraLD</a>. Updated LD estimates for ADSP populations will be made available along with future releases of ADSP variants called from WGS. ADSP WGS results are not available for GRCh37/hg19',
    },
    {
        anchor: "user-tracks",
        title: "How can I load my own tracks on the NIAGADS Genome Browser?",
        text: "URL parameters can be used to create customized genome browser views.  The following URL parameters are allowed: <ul><li><strong>locus</strong>: specify the locus by name (e.g., Ensembl ID or official gene symbol or chrN:start-end)</li><li><strong>track</strong>: comma separated list of built-in track keys; e.g., ADSP_17K,NG00075_GRCh38_STAGE1</li><li><strong>file</strong>: comma separated list of remote-hosted tracks; e.g. https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/DNase-seq/broadpeak/hg38/ENCFF003VHV.bed.gz,https://tf.lisanwanglab.org/GADB/Annotationtracks/GTEx/v8/v8_signif_association/bed16/hg38/Kidney_Cortex.v8.signif_variant_gene_pairs.bed.gz</li><li><strong>indexed</strong>: flag indicating if remote-hosted tracks are paired with .tbi files</li></ul><br/><a href='https://www.niagads.org/genomics/app/visualizations/browser?locus=ABCA7&track=NG00075_GRCh38_STAGE1&file=https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/DNase-seq/broadpeak/hg38/ENCFF003VHV.bed.gz,https://tf.lisanwanglab.org/GADB/Annotationtracks/GTEx/v8/v8_signif_association/bed16/hg38/Kidney_Cortex.v8.signif_variant_gene_pairs.bed.gz&indexed' target='_blank'>Example browser view loaded with URL parameters</a>"
    },
    {
        anchor: "browser-response",
        title: "Why does it take so long to load the annotated variant tracks (ADSP/dbSNP) when viewing larger spans?",
        text: "There is a lot of data contained within the annotated variant tracks.  The data is retrieved quickly but can take a while to render because the NIAGADS IGV Genome Browser is a client-side, not a server side browser.  This means that the performance depends on your system resources (how much memory your web-browser can use) and the web browser you are using.  Although the GenomicsDB website works well with most modern web browsers, the Genome Browser performs best when using <strong>Chrome</strong>."
    }
];

//
//file=https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/DNase-seq/broadpeak/hg38/ENCFF003VHV.bed.gz,https://tf.lisanwanglab.org/GADB/Annotationtracks/GTEx/v8/v8_signif_association/bed16/hg38/Kidney_Cortex.v8.signif_variant_gene_pairs.bed.gz&indexed"}

export default questions;
