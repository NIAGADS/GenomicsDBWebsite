export const _genomes = [
    {
        id: "hg38",
        name: "Human (GRCh38/hg38)",
        fastaURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa",
        indexURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa.fai",
        cytobandURL: "https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz",
        aliasURL: "https://s3.amazonaws.com/igv.org.genomes/hg38/hg38_alias.tab",
        tracks: [
            {
                name: "Genes",
                id: "ENSEMBL_GENE",
                track: "ENSEMBL_GENE",
                description: "Gene models from ENSEMBL",
                format: "gff3",
                filterTypes: ["chromosome"],
                url: "@WEBAPP_URL@/files/tracks/gene/hs.GRCh38.108.gff3.gz",
                indexURL: "@WEBAPP_URL@/files/tracks/gene/hs.GRCh38.108.gff3.gz.tbi",
                visibilityWindow: -1,
                supportsWholeGenome: false,
                removable: false,
                order: 1000000,
                colorBy: "biotype",
                color: (feature) => {
                    const value = feature.geneObject ? feature.geneObject.getAttributeValue("biotype") : feature.getAttributeValue("biotype");
                    if (value === undefined) {
                      return "grey";
                    }
                    if (value.includes("antisense")) {
                        return "#891100";
                    }
                    if (value.includes("protein_coding")) {
                        return "#000096";
                    }
                    if (value.includes("retained_intron")) {
                        return "rgb(0, 150, 150)";
                    }
                    if (value.includes("processed_transcript")) {
                        return "purple";
                    }
                    if (value.includes("processed_pseudogene")) {
                        return "#028401";
                    }
                    if (value.includes("unprocessed_pseudogene")) {
                        return "#888501";
                    }
                    if (value.includes("lncRNA")) {
                        return "#ff726e";
                    }
                    if (value === 'snRNA') {
                        return "#ffce6e";
                    }
                    return "grey";
                },
            },
        ],
        chromosomeOrder:
            "chr1, chr2, chr3, chr4, chr5, chr6, chr7, chr8, chr9, chr10, chr11, chr12, chr13, chr14, chr15, chr16, chr17, chr18, chr19, chr20, chr21, chr22, chrX, chrY",
    },
    {
        id: "hg19",
        name: "Human (GRCh37/hg19)",
        fastaURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta",
        indexURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta.fai",
        cytobandURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/cytoBand.txt",
        aliasURL: "https://s3.amazonaws.com/igv.org.genomes/hg19/hg19_alias.tab",
        tracks: [
            {
                name: "Genes (RefSeq)",
                id: "REFSEQ_GENE",
                track: "REFSEQ_GENE",
                description: "Gene models from NCBI Gene (RefSeq)",
                format: "refgene",
                url: "https://s3.amazonaws.com/igv.org.genomes/hg19/ncbiRefSeq.sorted.txt.gz",
                indexURL: "https://s3.amazonaws.com/igv.org.genomes/hg19/ncbiRefSeq.sorted.txt.gz.tbi",
                visibilityWindow: -1,
                supportsWholeGenome: false,
                removable: false,
                order: 1000000,
                infoURL: "https://www.ncbi.nlm.nih.gov/gene/?term=$$",
            },
        ],
        chromosomeOrder:
            "chr1, chr2, chr3, chr4, chr5, chr6, chr7, chr8, chr9, chr10, chr11, chr12, chr13, chr14, chr15, chr16, chr17, chr18, chr19, chr20, chr21, chr22, chrX, chrY",
    },
    {
        id: "mm10",
        name: "Mouse (GRCm38/mm10)",
        fastaURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/mm10/mm10.fa",
        indexURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/mm10/mm10.fa.fai",
        cytobandURL: "https://s3.amazonaws.com/igv.broadinstitute.org/annotations/mm10/cytoBandIdeo.txt.gz",
        order: 1000000,
        tracks: [
            {
                name: "Refseq Genes",
                format: "refgene",
                url: "https://s3.amazonaws.com/igv.org.genomes/mm10/ncbiRefSeq.sorted.txt.gz",
                indexURL: "https://s3.amazonaws.com/igv.org.genomes/mm10/ncbiRefSeq.sorted.txt.gz.tbi",
                order: 1000000,
                removable: false,
                visibilityWindow: -1,
                supportsWholeGenome: false,
            },
        ],
    },
    {
        id: "danRer11",
        name: "Zebrafish (GRCZ11/danRer11)",
        fastaURL: "https://s3.amazonaws.com/igv.org.genomes/danRer11/danRer11.fa",
        indexURL: "https://s3.amazonaws.com/igv.org.genomes/danRer11/danRer11.fa.fai",
        cytobandURL: "https://s3.amazonaws.com/igv.org.genomes/danRer11/cytoBandIdeo.txt.gz",
        aliasURL: "https://s3.amazonaws.com/igv.org.genomes/danRer11/chromAlias.txt.gz",
        tracks: [
            {
                name: "Refseq Genes",
                format: "refgene",
                url: "https://s3.amazonaws.com/igv.org.genomes/danRer11/ncbiRefSeq.sorted.txt.gz",
                indexURL: "https://s3.amazonaws.com/igv.org.genomes/danRer11/ncbiRefSeq.sorted.txt.gz.tbi",
                order: 1000000,
                removable: false,
                visibilityWindow: -1,
                supportsWholeGenome: false,
            },
        ],
    },
    {
        id: "ce11",
        name: "C. elegans (ce11)",
        fastaURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/ce11/ce11.fa",
        indexURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/ce11/ce11.fa.fai",
        cytobandURL: "https://s3.amazonaws.com/igv.org.genomes/ce11/cytoBandIdeo.txt.gz",
        tracks: [
            {
                name: "Refseq Genes",
                format: "refgene",
                url: "https://s3.amazonaws.com/igv.org.genomes/ce11/refGene.sorted.txt.gz",
                indexed: false,
                order: 1000000,
                removable: false,
                searchable: true,
            },
        ],
    },
    {
        id: "dm6",
        name: "D. melanogaster (dm6)",
        fastaURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/dm6/dm6.fa",
        indexURL: "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/dm6/dm6.fa.fai",
        cytobandURL: "https://s3.amazonaws.com/igv.org.genomes/dm6/cytoBandIdeo.txt.gz",
        tracks: [
            {
                name: "Refseq Genes",
                format: "refgene",
                url: "https://s3.amazonaws.com/igv.org.genomes/dm6/ncbiRefSeq.txt.gz",
                indexed: false,
                order: 1000000,
                removable: false,
                searable: true,
            },
        ],
    },
];
