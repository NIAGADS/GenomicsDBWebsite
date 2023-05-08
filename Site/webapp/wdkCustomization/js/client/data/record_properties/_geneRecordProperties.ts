import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";
import { RecordSectionDocumentation } from "@components/Record/Types";
import { _externalUrls } from "../_externalUrls";

export const _geneDocumentation: { [category: string]: RecordSectionDocumentation[] } = {
    phenomics: [
        {
            text: "This section reports variants contained within ±100kb of this gene that have been associated with a clinical phenotype.",
        },
        { text: "Trait associations have been segregated by datasource:" },
        {
            text: "Section 1.1 reports risk-associations from AD- or AD-related GWAS datasets in the NIAGADS repository.",
            routerLink: "record/dataset/accessions",
        },
        {
            text: "Section 1.2 reports all known phenotype associations (including AD-related) and from manually curated GWAS catalogs",
            routerLink: "record/annotation/variant#phenomics",
        },
        {
            text: "By default, the table is filtered for variants whose risk-association is supported by a p-value ≤ 5e-8.",
        },
    ],
    "data-identity-and-mapping": [
        {
            text:
                "This section provides link outs to related gene resources.  " +
                "GenomicsDB gene records are uniquely identified by Ensembl gene identifiers," +
                "as are any sub features (e.g., transcripts, exons) and protein products. " +
                "Alternative gene (incl. NCBI Gene IDs, UCSC Gene IDs) or protein identifiers " +
                "(UniProtKB IDs) are mapped to Ensembl IDs via the UniProtKB ID mapping file for human genes; " +
                "additional standard gene nomenclature is imported from the HUGO Gene Nomenclature Committee at the European Bioinformatics Institute",
        },
        {
            text: "Details and versioning information for the annotation files are available here:",
            routerLink: "record/annotation/gene#data-identity-and-mapping",
        },
    ],
    "function-analysis": [
        {
            text: "This section provides predictions and annotations of known gene-function from the Gene Ontology",
            link: _externalUrls.GENE_ONTOLOGY_URL,
        },
        {
            text: "GO associations are mapped to Ensembl Gene Identifiers using the UniProtKB GOA and ID mapping files.  Annotation file versions available here:",
            routerLink: "record/annotation/gene#function-analysis",
        },
    ],
    "molecular-interactions-pathways-and-networks": [
        {
            text: "Gene membership in molecular and metabolic pathways is obtained from the Kyoto Encyclopedia of Genes and Genomes (KEGG) and Reactome.  Data source and versioning information available here:",
            routerLink: "record/annotation/gene#molecular-interactions-pathways-and-networks",
        },
    ],
};

export const _geneTableProperties: { [name: string]: TableProperties } = {
    ad_variants_from_gwas: {
        filters: {
            pvalue: "pvalue",
            adsp_variant_flag: "pie",
            gene_impact: "pie",
            gene_consequence: "pie",
            relative_position: "pie",
            population: "pie",
            biomarker: "select",
            tissue: "select",
            covariates: "checkbox_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            { label: "Position", columns: ["relative_position"] },
            { label: "Annotation", columns: ["adsp_variant_flag", "gene_impact", "gene_consequence"] },
            { label: "Phenotype", columns: ["population", "biomarker", "genotype", "tissue", "covariates"] },
        ],
        defaultFilter: "pvalue",
        hiddenColumns: [
            "population",
            "diagnosis",
            "neuropathology",
            "covariates",
            "gender",
            "genotype",
            "biomarker",
            "tissue",
            "track_description",
            "gene_impact",
            "gene_consequence",
        ],
        requiredColumns: ["track_name_link", "variant_link", "pvalue"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: {
            adsp_variant_flag: "BooleanRedCheck",
            pvalue: "ScientificNotation",
            variant_link: "Link",
            track_name_link: "Link",
            gene_impact: "VariantImpact",
            relative_position: "RelativePosition",
        },
    },
    other_variants_from_gwas: {
        filters: {
            pvalue: "pvalue",
            adsp_variant_flag: "pie",
            gene_impact: "pie",
            gene_consequence: "pie",
            relative_position: "pie",
            diagnosis: "pie",
            neuropathology: "pie",
            population: "pie",
            biomarker: "select",
            tissue: "select",
            covariates: "checkbox_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            { label: "Position", columns: ["relative_position"] },
            { label: "Annotation", columns: ["adsp_variant_flag", "gene_impact", "gene_consequence"] },
            {
                label: "Phenotype",
                columns: ["population", "diagnosis", "neuropathology", "biomarker", "genotype", "tissue", "covariates"],
            },
        ],
        defaultFilter: "pvalue",
        hiddenColumns: [
            "gene_consequence",
            "population",
            "covariates",
            "gender",
            "genotype",
            "biomarker",
            "tissue",
            "track_description",
            "gene_impact",
            "diagnosis",
        ],
        requiredColumns: ["track_name_link", "variant_link", "pvalue", "neuropathology"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: {
            adsp_variant_flag: "BooleanRedCheck",
            pvalue: "ScientificNotation",
            variant_link: "Link",
            track_name_link: "Link",
            relative_position: "RelativePosition",
        },
    },
    ad_variants_from_catalog: {
        filters: {
            pvalue: "pvalue",
            adsp_variant_flag: "pie",
            gene_impact: "pie",
            gene_consequence: "pie",
            relative_position: "pie",
            source: "select",
            mapped_efo_trait: "typeahead_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue", "mapped_efo_trait"], defaultOpen: true },
            { label: "Position", columns: ["relative_position"] },
            { label: "Annotation", columns: ["source", "adsp_variant_flag", "gene_impact", "gene_consequence"] },
        ],
        defaultFilter: "pvalue",
        hiddenColumns: [
            "source",
            "sample",
            "replicate_sample",
            "trait",
            "frequency",
            "gene_impact",
            "gene_consequence",
        ],
        requiredColumns: ["variant_link", "pvalue", "mapped_efo_trait", "study", "pubmed_id"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: {
            adsp_variant_flag: "BooleanRedCheck",
            pvalue: "ScientificNotation",
            variant_link: "Link",
            pubmed_id: "Link",
        },
    },
    other_variants_from_catalog: {
        filters: {
            pvalue: "pvalue",
            adsp_variant_flag: "pie",
            gene_impact: "pie",
            gene_consequence: "pie",
            relative_position: "pie",
            source: "select",
            mapped_efo_trait: "typeahead_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue", "mapped_efo_trait"], defaultOpen: true },
            { label: "Position", columns: ["relative_position"] },
            { label: "Annotation", columns: ["source", "adsp_variant_flag", "gene_impact", "gene_consequence"] },
        ],
        hiddenColumns: [
            "source",
            "sample",
            "replicate_sample",
            "trait",
            "frequency",
            "gene_impact",
            "gene_consequence",
        ],
        requiredColumns: ["variant_link", "pvalue", "mapped_efo_trait", "study", "pubmed_id"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: {
            adsp_variant_flag: "BooleanRedCheck",
            pvalue: "ScientificNotation",
            variant_link: "Link",
            pubmed_id: "Link",
            relative_position: "RelativePosition",
        },
    },
    go_terms: {
        filters: {
            go_evidence_code: "select",
            ontology: "select",
        },
        filterGroups: [{ label: "Annotation", columns: ["go_evidence_code", "ontology"], defaultOpen: true }],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: false,
        accessors: { go_accession: "Link" },
    },
    pathways: {
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: false,
        accessors: { accession: "Link" },
    },
};
