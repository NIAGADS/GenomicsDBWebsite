import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";
import { RecordSectionDocumentation } from "@components/Record/Types";
import { _externalUrls } from "../_externalUrls";

export const _geneDocumentation: { [category: string]: RecordSectionDocumentation[] } = {
    overview: [
        {
            text: "The gene report header provides basic information about a gene.  Gene model reference, standard nomenclature, and gene types are obtained from the following resources:",
            dataSourceKey: "gene|overview",
        },
    ],

    phenomics: [
        {
            text: "This section reports variants contained within ±100kb of this gene that have been associated with a clinical phenotype.  Trait associations are segregated by original data source.  <strong>Section 1.1</strong> reports risk-associations from AD- or AD-related GWAS datasets in the NIAGADS Repository.  <strong>Section 1.2</strong> reports known associations (including AD-related) from manually curated GWAS Catalogs</strong>",
        },
        {
            text: "By default, the tables is filtered for variants whose risk-association is supported by a p-value ≤ 5e-8.",
        },
        { text: "Trait associations are pulled from the following resources", dataSourceKey: "variant|gwas" },
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
            text: "Annotation files used to map identifiers are as follows:",
            dataSourceKey: "gene|identity",
        },
    ],
    "function-analysis": [
        {
            text: "This section provides predictions and annotations of known gene-function from the Gene Ontology (GO). GO associations (GOA) are mapped to Ensembl Gene Identifiers using the UniProtKB GOA and ID mapping files.",
        },
        {
            text: "Current versions of the association and annotation files used in the GenomicsDB are as follows",
            dataSourceKey: "gene|function",
        },
    ],
    "molecular-interactions-pathways-and-networks": [
        {
            text: "This section provides lists of known pathway memberships for the gene.  Gene membership in molecular and metabolic pathways is obtained from the following resources:" ,
            dataSourceKey: "gene|interaction",
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
    record_link_outs: {
        defaultOpen: true,
        canFilter: false,
        canToggleColumns: false
    }
};
