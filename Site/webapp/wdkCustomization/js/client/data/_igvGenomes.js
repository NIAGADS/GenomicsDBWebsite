export const _genomes = [
  {
    "id": "chm13v2.0",
    "name": "Human (T2T CHM13-v2.0)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/chm13v2.0/chm13v2.0.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/chm13v2.0/chm13v2.0.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/chm13v2.0/CHM13_v2.0.cytoBandMapped.bed",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/chm13v2.0/GCA_009914755.4.chromAlias.txt",
    "tracks": [
      {
        "id": "catLiftOffGenesV1",
        "name": "CAT/Liftoff Genes",
        "format": "bigbed",
        "description": " <a target = \"_blank\" href = \"https://hgdownload.soe.ucsc.edu/hubs/GCA/009/914/755/GCA_009914755.4/html/GCA_009914755.4_CHM13_T2T_v2.0.catLiftOffGenesV1.html\">CAT + Liftoff Gene Annotations</a>",
        "url": "https://hgdownload.soe.ucsc.edu/hubs/GCA/009/914/755/GCA_009914755.4/bbi/GCA_009914755.4_T2T-CHM13v2.0.catLiftOffGenesV1/catLiftOffGenesV1.bb",
        "displayMode": "EXPANDED",
        "height": 200,
        "visibilityWindow": -1,
        "supportsWholeGenome": false,
        "order": 1000000
      },
      {
        "id": "augustus",
        "name": "Augustus",
        "format": "bigbed",
        "description": " <a target = \"_blank\" href = \"https://hgdownload.soe.ucsc.edu/hubs/GCA/009/914/755/GCA_009914755.4/html/GCA_009914755.4_CHM13_T2T_v2.0.augustus\">Augustus Gene Predictions</a>",
        "url": "https://hgdownload.soe.ucsc.edu/hubs/GCA/009/914/755/GCA_009914755.4/bbi/GCA_009914755.4_T2T-CHM13v2.0.augustus.bb",
        "displayMode": "EXPANDED",
        "color": "rgb(180,0,0)",
        "height": 200,
        "visibilityWindow": -1,
        "supportsWholeGenome": false,
        "order": 1000001
      }
    ]
  },
  {
    "id": "chm13v1.1",
    "name": "Human (T2T CHM13-v1.1)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/t2t-chm13-v1.1/GCA_009914755.3_CHM13_T2T_v1.1_genomic.fna",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/t2t-chm13-v1.1/GCA_009914755.3_CHM13_T2T_v1.1_genomic.fna.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/t2t-chm13-v1.1/cytoBandIdeo.bed",
    "tracks": [
      {
        "name": "Annotations",
        "type": "annotation",
        "format": "bigbed",
        "url": "https://s3.amazonaws.com/igv.org.genomes/t2t-chm13-v1.1/CHM13.combined.v4.bb",
        "supportsWholeGenome": false,
        "height": 200,
        "displayMode": "EXPANDED",
        "order": 1000000,
        "description": "Annotations from <a target='_blank' href='https://genome.ucsc.edu/cgi-bin/hgTracks?db=hub_2395475_t2t-chm13-v1.1'>UCSC</a>.<br/>blue - protein coding<br/>green - non coding<br/>pink - psuedo gene",
        "visibilityWindow": -1
      }
    ]
  },
  {
    "id": "hg38",
    "name": "Human (GRCh38/hg38)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/hg38/hg38_alias.tab",
    "tracks": [
      {
        "name": "Genes (RefSeq)",
        "id": "REFSEQ_GENE",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.txt.gz.tbi",
        "visibilityWindow": -1,
        "supportsWholeGenome": false,
        "removable": false,
        "order": 1000000,
        "infoURL": "https://www.ncbi.nlm.nih.gov/gene/?term=$$"
      }
    ],
    "chromosomeOrder": "chr1, chr2, chr3, chr4, chr5, chr6, chr7, chr8, chr9, chr10, chr11, chr12, chr13, chr14, chr15, chr16, chr17, chr18, chr19, chr20, chr21, chr22, chrX, chrY"
  },
  {
    "id": "hg38_1kg",
    "name": "Human (hg38 1kg/GATK)",
    "compressedFastaURL": "https://s3.amazonaws.com/igv.org.genomes/hg38/Homo_sapiens_assembly38.fasta.gz",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg38/hg38.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz.tbi",
        "visibilityWindow": -1,
        "supportsWholeGenome": false,
        "removable": false,
        "order": 1000000,
        "infoURL": "https://www.ncbi.nlm.nih.gov/gene/?term=$$"
      }
    ],
    "chromosomeOrder": "chr1, chr2, chr3, chr4, chr5, chr6, chr7, chr8, chr9, chr10, chr11, chr12, chr13, chr14, chr15, chr16, chr17, chr18, chr19, chr20, chr21, chr22, chrX, chrY"
  },
  {
    "id": "hg19",
    "name": "Human (GRCh37/hg19)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/cytoBand.txt",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/hg19/hg19_alias.tab",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "id": "hg19_genes",
        "url": "https://s3.amazonaws.com/igv.org.genomes/hg19/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/hg19/ncbiRefSeq.sorted.txt.gz.tbi",
        "visibilityWindow": -1,
        "supportsWholeGenome": false,
        "removable": false,
        "order": 1000000,
        "infoURL": "https://www.ncbi.nlm.nih.gov/gene/?term=$$"
      }
    ],
    "chromosomeOrder": "chr1, chr2, chr3, chr4, chr5, chr6, chr7, chr8, chr9, chr10, chr11, chr12, chr13, chr14, chr15, chr16, chr17, chr18, chr19, chr20, chr21, chr22, chrX, chrY"
  },
  {
    "id": "hg18",
    "name": "Human (hg18)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg18/hg18.fasta",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg18/hg18.fasta.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/hg18/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/hg18/refGene.txt.gz",
        "indexed": false,
        "visibilityWindow": -1,
        "removable": false,
        "order": 1000000,
        "searchable": true
      }
    ],
    "chromosomeOrder": "chr1, chr2, chr3, chr4, chr5, chr6, chr7, chr8, chr9, chr10, chr11, chr12, chr13, chr14, chr15, chr16, chr17, chr18, chr19, chr20, chr21, chr22, chrX, chrY"
  },
  {
    "id": "mm39",
    "name": "Mouse (GRCm39/mm39)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/mm39/mm39.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/mm39/mm39.fa.fai",
    "cytobandURL": "https://hgdownload.soe.ucsc.edu/goldenPath/mm39/database/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/mm39/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/mm39/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "mm10",
    "name": "Mouse (GRCm38/mm10)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/mm10/mm10.fa",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/mm10/mm10.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.broadinstitute.org/annotations/mm10/cytoBandIdeo.txt.gz",
    "order": 1000000,
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/mm10/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/mm10/ncbiRefSeq.sorted.txt.gz.tbi",
        "order": 1000000,
        "removable": false,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "mm9",
    "name": "Mouse (NCBI37/mm9)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/mm9/mm9.fasta",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/mm9/mm9.fasta.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/mm9/cytoBandIdeo.txt.gz",
    "order": 1000000,
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/mm9/refGene.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/mm9/refGene.sorted.txt.gz.tbi",
        "order": 1000000,
        "removable": false,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "rn7",
    "name": "Rat (rn7) ",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/rn7/rn7.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/rn7/rn7.fa.fai",
    "cytobandURL": "https://hgdownload.soe.ucsc.edu/goldenPath/rn7/database/cytoBandIdeo.txt.gz",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/rn7/chrAlias.tab.gz",
    "tracks": [
      {
        "name": "Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/rn7/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/rn7/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "rn6",
    "name": "Rat (RGCS 6.0/rn6)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/rn6/rn6.fa",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/rn6/rn6.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/rn6/cytoBand.txt.gz",
    "order": 1000000,
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/rn6/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/rn6/ncbiRefSeq.sorted.txt.gz.tbi",
        "order": 1000000,
        "removable": false,
        "supportsWholeGenome": false,
        "visibilityWindow": -1
      }
    ]
  },
  {
    "id": "gorGor6",
    "name": "Gorilla (Kamilah_GGO_v0/gorGor6) ",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/gorGor6/gorGor6.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/gorGor6/gorGor6.fa.fai",
    "cytobandURL": "https://hgdownload.soe.ucsc.edu/goldenPath/gorGor6/database/cytoBandIdeo.txt.gz",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/gorGor6/chrAlias.tab.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/gorGor6/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/gorGor6/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "gorGor4",
    "name": "Gorilla (gorGor4.1/gorGor4)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/gorGor4/gorGor4.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/gorGor4/gorGor4.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/gorGor4/cytoBandIdeo.txt.gz",
    "chromosomeOrder": "chr1,chr2A,chr2B,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/gorGor4/refGene.txt.gz",
        "indexed": false,
        "order": 1000000,
        "removable": false,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "panTro6",
    "name": "Chimp (panTro6) (panTro6)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/panTro6/panTro6.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panTro6/panTro6.fa.fai",
    "cytobandURL": "https://hgdownload.soe.ucsc.edu/goldenPath/panTro6/database/cytoBandIdeo.txt.gz",
    "chromosomeOrder": "chr1,chr2A,chr2B,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/panTro6/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panTro6/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "panTro5",
    "name": "Chimp (panTro5) (panTro5)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/panTro5/panTro5.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panTro5/panTro5.fa.fai",
    "cytobandURL": "https://hgdownload.soe.ucsc.edu/goldenPath/panTro5/database/cytoBandIdeo.txt.gz",
    "chromosomeOrder": "chr1,chr2A,chr2B,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/panTro5/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panTro5/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "panTro4",
    "name": " Chimp (SAC 2.1.4/panTro4)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/panTro4/panTro4.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panTro4/panTro4.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/panTro4/cytoBandIdeo.txt.gz",
    "chromosomeOrder": "chr1,chr2A,chr2B,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX,chrY",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/panTro4/refGene.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panTro4/refGene.sorted.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "macFas5",
    "name": "Macaca fascicularis (macFas5)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/macFas5/macFas5.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/macFas5/macFas5.fa.fai",
    "cytobandURL": "https://hgdownload.soe.ucsc.edu/goldenPath/macFas5/database/cytoBandIdeo.txt.gz",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/macFas5/chrAlias.tab.gz",
    "tracks": [
      {
        "name": "Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/macFas5/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/macFas5/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "visibilityWindow": -1,
        "supportsWholeGenome": false,
        "order": 1000000
      }
    ]
  },
  {
    "id": "panPan2",
    "name": "Bonobo (MPI-EVA panpan1.1/panPan2)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/panPan2/panPan2.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panPan2/panPan2.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/panPan2/cytoBandIdeo.txt.gz",
    "chromosomeOrder": "chr1,chr2A,chr2B,chr3,chr4,chr5,chr6,chr7,chr8,chr9,chr10,chr11,chr12,chr13,chr14,chr15,chr16,chr17,chr18,chr19,chr20,chr21,chr22,chrX",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/panPan2/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/panPan2/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "canFam3",
    "name": "Dog (Broad CanFam3.1/canFam3)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/canFam3/canFam3.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/canFam3/canFam3.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/canFam3/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/canFam3/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/canFam3/ncbiRefSeq.sorted.txt.gz.tbi",
        "indexed": false,
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "canFam5",
    "name": "Dog (canFam5) ",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/canFam5/canFam5.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/canFam5/canFam5.fa.fai",
    "cytobandURL": "https://hgdownload.soe.ucsc.edu/goldenPath/canFam5/database/cytoBandIdeo.txt.gz",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/canFam5/chrAlias.tab.gz",
    "tracks": [
      {
        "name": "Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/canFam5/refGene.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/canFam5/refGene.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "bosTau9",
    "name": "Cow (ARS-UCD1.2/bosTau9)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau9/bosTau9.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau9/bosTau9.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau9/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/bosTau9/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau9/ncbiRefSeq.sorted.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "bosTau8",
    "name": "Cow (UMD_3.1.1/bosTau8)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau8/bosTau8.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau8/bosTau8.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau8/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/bosTau8/refGene.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/bosTau8/refGene.sorted.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "susScr11",
    "name": "Pig (SGSC Sscrofa11.1/susScr11)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/susScr11/susScr11.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/susScr11/susScr11.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/susScr11/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/susScr11/refGene.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/susScr11/refGene.sorted.txt.gz.tbi",
        "indexed": false,
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "galGal6",
    "name": " Chicken (galGal6)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/galGal6/galGal6.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/galGal6/galGal6.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/galGal6/cytoBandIdeo.txt",
    "tracks": [
      {
        "name": "NCBI Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/galGal6/ncbiRefSeq.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/galGal6/ncbiRefSeq.txt.gz.tbi",
        "removable": false,
        "order": 1000000,
        "searable": true
      }
    ]
  },
  {
    "id": "danRer11",
    "name": "Zebrafish (GRCZ11/danRer11)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/danRer11/danRer11.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/danRer11/danRer11.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/danRer11/cytoBandIdeo.txt.gz",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/danRer11/chromAlias.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/danRer11/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/danRer11/ncbiRefSeq.sorted.txt.gz.tbi",
        "order": 1000000,
        "removable": false,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "danRer10",
    "name": "Zebrafish (GRCZ10/danRer10)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/danRer10/danRer10.fa",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/danRer10/danRer10.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/danRer10/cytoBandIdeo.txt.gz",
    "order": 1000000,
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/danRer10/ncbiRefSeq.sorted.txt.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/danRer10/ncbiRefSeq.sorted.txt.gz.tbi",
        "order": 1000000,
        "removable": false,
        "visibilityWindow": -1,
        "supportsWholeGenome": false
      }
    ]
  },
  {
    "id": "ce11",
    "name": "C. elegans (ce11)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/ce11/ce11.fa",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/ce11/ce11.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/ce11/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/ce11/refGene.sorted.txt.gz",
        "indexed": false,
        "order": 1000000,
        "removable": false,
        "searchable": true
      }
    ]
  },
  {
    "id": "dm6",
    "name": "D. melanogaster (dm6)",
    "fastaURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/dm6/dm6.fa",
    "indexURL": "https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/dm6/dm6.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/dm6/cytoBandIdeo.txt.gz",
    "tracks": [
      {
        "name": "Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/dm6/ncbiRefSeq.txt.gz",
        "indexed": false,
        "order": 1000000,
        "removable": false,
        "searable": true
      }
    ]
  },
  {
    "id": "dm3",
    "name": "D. melanogaster (dm3)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/dm3/dm3.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/dm3/dm3.fa.fai",
    "cytobandURL": "https://s3.amazonaws.com/igv.org.genomes/dm3/cytoBand.txt.gz",
    "tracks": [
      {
        "name": "UCSC Refseq Genes",
        "format": "refgene",
        "url": "https://s3.amazonaws.com/igv.org.genomes/dm3/refGene.txt.gz",
        "indexed": false,
        "order": 1000000,
        "removable": false,
        "searchable": true
      }
    ]
  },
  {
    "id": "dmel_r5.9",
    "name": "D. melanogaster (dmel_r5.9)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/dmel_r5.9/dmel-all-chromosome-r5.9.fasta",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/dmel_r5.9/dmel-all-chromosome-r5.9.fasta.fai",
    "tracks": [
      {
        "name": "Transcripts",
        "format": "gff3",
        "url": "https://s3.amazonaws.com/igv.org.genomes/dmel_r5.9/dmel-r5.9.transcripts.sorted.gff.gz",
        "indexed": false,
        "order": 1000000,
        "removable": false,
        "searable": true
      }
    ]
  },
  {
    "id": "sacCer3",
    "name": "S. cerevisiae (sacCer3)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/sacCer3/sacCer3.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/sacCer3/sacCer3.fa.fai",
    "tracks": [
      {
        "name": "Refseq Genes",
        "type": "annotation",
        "format": "refgene",
        "displayMode": "EXPANDED",
        "url": "https://s3.amazonaws.com/igv.org.genomes/sacCer3/ncbiRefGene.txt.gz",
        "indexed": false,
        "searable": true
      }
    ]
  },
  {
    "id": "ASM294v2",
    "name": "S. pombe (ASM294v2)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/ASM294v2/Schizosaccharomyces_pombe_all_chromosomes.fa",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/ASM294v2/Schizosaccharomyces_pombe_all_chromosomes.fa.fai",
    "tracks": [
      {
        "name": "Pombase forward strand",
        "type": "annotation",
        "format": "gff3",
        "displayMode": "EXPANDED",
        "url": "https://s3.amazonaws.com/igv.org.genomes/ASM294v2/Schizosaccharomyces_pombe_all_chromosomes.plus.gff3.gz",
        "indexed": false,
        "supportsWholeGenome": true,
        "labelAllFeatures": true,
        "height": 150,
        "color": "rgb(5,75,180)"
      },
      {
        "name": "Pombase reverse strand",
        "type": "annotation",
        "format": "gff3",
        "displayMode": "EXPANDED",
        "url": "https://s3.amazonaws.com/igv.org.genomes/ASM294v2/Schizosaccharomyces_pombe_all_chromosomes.minus.gff3.gz",
        "indexed": false,
        "supportsWholeGenome": true,
        "height": 150,
        "color": "rgb(7,123,220)"
      }
    ]
  },
  {
    "id": "ASM985889v3",
    "name": "Sars-CoV-2 (ASM985889v3)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/ASM985889v3/GCF_009858895.2_ASM985889v3_genomic.fna",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/ASM985889v3/GCF_009858895.2_ASM985889v3_genomic.fna.fai",
    "order": 1000000,
    "tracks": [
      {
        "name": "Annotations",
        "url": "https://s3.amazonaws.com/igv.org.genomes/ASM985889v3/GCF_009858895.2_ASM985889v3_genomic.gff.gz",
        "displayMode": "EXPANDED",
        "nameField": "gene",
        "height": 150
      }
    ]
  },
  {
    "id": "tair10",
    "name": "A. thaliana (TAIR 10)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/tair10/TAIR10_chr_all.fas",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/tair10/TAIR10_chr_all.fas.fai",
    "aliasURL": "https://s3.amazonaws.com/igv.org.genomes/tair10/TAIR10_alias.tab",
    "tracks": [
      {
        "name": "Genes",
        "format": "gff3",
        "url": "https://s3.amazonaws.com/igv.org.genomes/tair10/TAIR10_GFF3_genes.gff",
        "indexed": false,
        "removable": false,
        "order": 1000000,
        "searable": true
      }
    ]
  },
  {
    "id": "GCA_003086295.2",
    "name": "Peanut (GCA_003086295.2)",
    "fastaURL": "https://s3.amazonaws.com/igv.org.genomes/GCA_003086295.2/GCF_003086295.2_arahy.Tifrunner.gnm1.KYV3_genomic.fna",
    "indexURL": "https://s3.amazonaws.com/igv.org.genomes/GCA_003086295.2/GCF_003086295.2_arahy.Tifrunner.gnm1.KYV3_genomic.fna.fai",
    "tracks": [
      {
        "name": "Annotations",
        "format": "gff3",
        "url": "https://s3.amazonaws.com/igv.org.genomes/GCA_003086295.2/GCF_003086295.2_arahy.Tifrunner.gnm1.KYV3_genomic.gff.gz",
        "indexURL": "https://s3.amazonaws.com/igv.org.genomes/GCA_003086295.2/GCF_003086295.2_arahy.Tifrunner.gnm1.KYV3_genomic.gff.gz.tbi",
        "removable": false,
        "order": 1000000,
        "visibilityWindow": -1,
        "supportsWholeGenome": false,
        "displayMode": "EXPANDED",
        "height": 300
      }
    ]
  }
]