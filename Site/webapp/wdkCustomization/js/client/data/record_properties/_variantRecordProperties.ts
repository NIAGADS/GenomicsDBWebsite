import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";

export const _variantTableProperties: { [name: string]: TableProperties } = {
    ad_associations_from_gwas: {
        filters: {
            pvalue: "pvalue",
            population: "pie",
            biomarker: "select",
            tissue: "select",
            covariates: "multi_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
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
        ],
        requiredColumns: ["track", "pvalue", "allele"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: { pvalue: "ScientificNotation", track: "Link" },
    },
    other_associations_from_gwas: {
        filters: {
            pvalue: "pvalue",
            diagnosis: "pie",
            neuropathology: "pie",
            population: "pie",
            biomarker: "select",
            tissue: "select",
            covariates: "multi_select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            {
                label: "Phenotype",
                columns: ["population", "diagnosis", "neuropathology", "biomarker", "genotype", "tissue", "covariates"],
            },
        ],
        defaultFilter: "pvalue",
        hiddenColumns: ["population", "covariates", "gender", "genotype", "biomarker", "tissue"],
        requiredColumns: ["track", "allele", "pvalue", "diagnosis", "neuropathology"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: { pvalue: "ScientificNotation", track: "Link" },
    },
    ad_associations_from_catalog: {
        filters: {
            pvalue: "pvalue",
            source: "select",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            { label: "Annotation", columns: ["source"] },
        ],
        hiddenColumns: ["source", "sample", "replicate_sample", "frequency", "mapped_efo_trait"],
        requiredColumns: ["pvalue", "trait", "study"],
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
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            { label: "Annotation", columns: ["source"] },
        ],
        hiddenColumns: ["source", "sample", "replicate_sample", "frequency"],
        requiredColumns: ["pvalue", "trait", "study"],
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
        hiddenColumns: ["d_prime"],
        requiredColumns: ["variant", "r_squared", "population"],
        sortedBy: [{ id: "r_squared", descending: true }],
        accessors: {
            adsp_variant_flag: "BooleanRedCheck",
            r_squared: "Float",
            minor_allele_frequency_ld_ref: "Float",
            minor_allele_frequency: "Float",
            d_prime: "Float"
        }
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
        accessors: { frequency: "PercentageBar" },
    },
};
