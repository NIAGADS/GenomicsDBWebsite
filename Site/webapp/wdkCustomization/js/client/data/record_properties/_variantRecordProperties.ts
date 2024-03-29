import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";
import { RecordSectionDocumentation } from "@components/Record/Types";

export const _variantDocumentation: { [category: string]: RecordSectionDocumentation[] } = {
    overview: [
        {
            text: "The variant report header provides basic information about a variant, including variant type, reference and alternative alleles, and dbSNP rsID, if relevant.  The most damaging variant consequence predicted by the ADSP annotation pipeline is also provided, as well as a flag if the variant was present in an ADSP joint-genotype calling effort.",
            dataSourceKey: "variant|overview",
            comingSoon: "Information about the ADSP annotation pipeline and ADSP variants will be coming soon.",
        },
    ],
    phenomics: [
        {
            text: "This section reports known associations for this variant with a clinical phenotype.  Trait associations are segregated by original data source.  <strong>Section 1.1</strong> reports risk-associations from AD- or AD-related GWAS datasets in the NIAGADS Repository.  <strong>Section 1.2</strong> reports known associations (including AD-related) from manually curated GWAS Catalogs</strong>",
            dataSourceKey: "variant|gwas",
        },
    ],
    "genetic-variation": [
        {
            text: "",
            comingSoon: "Documentation about allele frequencies and linkage disequilibrium is coming soon.",
        },
    ],
    "function-analysis": [
        {
            text: "",
            comingSoon:
                "Function prediction was accomplished using the ADSP Annotation pipeline.  More information coming soon.",
        },
    ],
};

export const _variantTableProperties: { [name: string]: TableProperties } = {
    ad_associations_from_gwas: {
        filters: {
            pvalue: "pvalue",
            population: "pie",
            biomarker: "select",
            tissue: "select",
            covariates: "checkbox_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            { label: "Phenotype", columns: ["population", "biomarker", "genotype", "tissue", "covariates"] },
        ],
        defaultFilter: "pvalue",
        hiddenColumns: [
            "diagnosis",
            "track_description",
            "neuropathology",
            "covariates",
            "gender",
            "genotype",
            "biomarker",
            "tissue",
        ],
        requiredColumns: ["track", "pvalue", "allele"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: { pvalue: "ScientificNotation", track_name_link: "Link" },
    },
    other_associations_from_gwas: {
        filters: {
            pvalue: "pvalue",
            diagnosis: "pie",
            neuropathology: "pie",
            population: "pie",
            biomarker: "select",
            tissue: "select",
            covariates: "checkbox_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            {
                label: "Phenotype",
                columns: ["population", "diagnosis", "neuropathology", "biomarker", "genotype", "tissue", "covariates"],
            },
        ],
        defaultFilter: "pvalue",
        hiddenColumns: ["covariates", "gender", "genotype", "biomarker", "tissue", "track_description"],
        requiredColumns: ["track_name_link", "allele", "pvalue"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: { pvalue: "ScientificNotation", track_name_link: "Link" },
    },
    ad_associations_from_catalog: {
        filters: {
            pvalue: "pvalue",
            source: "select",
            mapped_efo_trait: "typeahead_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue", "mapped_efo_trait"], defaultOpen: true },
            { label: "Annotation", columns: ["source"] },
        ],
        hiddenColumns: ["source", "sample", "replicate_sample", "frequency", "trait"],
        requiredColumns: ["pvalue", "mapped_efo_trait", "study"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: { pvalue: "ScientificNotation", mapped_efo_trait: "Link", pubmed_id: "Link" },
    },
    other_associations_from_catalog: {
        filters: {
            pvalue: "pvalue",
            source: "select",
            mapped_efo_trait: "typeahead_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue", "mapped_efo_trait"], defaultOpen: true },
            { label: "Annotation", columns: ["source"] },
        ],
        hiddenColumns: ["source", "sample", "replicate_sample", "trait", "frequency"],
        requiredColumns: ["pvalue", "mapped_efo_trait", "study"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: { pvalue: "ScientificNotation", mapped_efo_trait: "Link", pubmed_id: "Link" },
    },
    linkage: {
        filters: {
            population: "select",
            r_squared: "greater_than_threshold",
            minor_allele_frequency_ld_ref: "less_than_threshold",
        },
        filterGroups: [
            { label: "Statistics", columns: ["r_squared", "minor_allele_frequency_ld_ref"], defaultOpen: true },
            { label: "Phenotype", columns: ["population"], defaultOpen: true },
        ],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        hiddenColumns: ["d_prime", "minor_allele_frequency_ld_ref"],
        requiredColumns: ["variant", "r_squared", "population"],
        sortedBy: [{ id: "r_squared", descending: true }],
        accessors: {
            adsp_variant_flag: "BooleanRedCheck",
        },
    },
    allele_frequencies: {
        filters: {
            population_source: "select",
            population: "select",
        },
        filterGroups: [{ label: "Population", columns: ["population", "population_source"], defaultOpen: true }],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: false,
        accessors: { frequency: "PercentageBar", population: "AnnotatedText" },
    },

    transcript_consequences: {
        filters: {
            consequence: "select",
            gene_link: "select",
            impact: "select",
        },
        filterGroups: [{ label: "Consequence", columns: ["consequence", "gene_link", "impact"], defaultOpen: true }],
        hiddenColumns: [
            "exon",
            "cds_position",
            "cdna_position",
            "protein_link",
            "protein_position",
            "rank",
            "strand",
            "is_canonical_transcript",
        ],
        requiredColumns: ["consequence"],
        canFilter: true,
        defaultOpen: true,
        canToggleColumns: true,
        accessors: {
            is_canonical_transcript: "BooleanGreenCheck",
            is_coding: "BooleanGreenCheck",
            is_most_severe_consequence: "BooleanRedCheck",
            gene_link: "Link",
            transcript_link: "Link",
            protein_link: "Link",
        },
    },

    regulatory_consequences: {
        filters: {
            consequence: "select",
            feature_biotype: "select",
            impact: "select",
        },
        filterGroups: [
            { label: "Consequence", columns: ["consequence", "feature_biotype", "impact"], defaultOpen: true },
        ],
        hiddenColumns: ["rank"],
        requiredColumns: ["consequence", "feature_biotype", "feature_link"],
        canFilter: true,
        defaultOpen: true,
        canToggleColumns: true,
        accessors: {
            is_most_severe_consequence: "BooleanRedCheck",
            feature_link: "Link",
        },
    },

    intergenic_consequences: {
        filters: {
            consequence: "select",
            impact: "select",
        },
        filterGroups: [{ label: "Consequence", columns: ["consequence", "impact"], defaultOpen: true }],
        hiddenColumns: ["rank"],
        requiredColumns: ["consequence"],
        canFilter: true,
        defaultOpen: true,
        canToggleColumns: true,
        accessors: {
            is_most_severe_consequence: "BooleanRedCheck",
        },
    },

    motif_consequences: {
        filters: {
            consequence: "select",
            feature_biotype: "select",
            impact: "select",
        },
        filterGroups: [
            { label: "Consequence", columns: ["consequence", "feature_biotype", "impact"], defaultOpen: true },
        ],
        hiddenColumns: ["rank", "high_info_position", "transcription_factor_complex", "epigenomes"],
        requiredColumns: ["consequence", "feature_link", "feature_biotype"],
        canFilter: true,
        defaultOpen: true,
        canToggleColumns: true,
        accessors: {
            is_most_severe_consequence: "BooleanRedCheck",
            feature_link: "Link",
            motif_link: "Link",
        },
    },
};
