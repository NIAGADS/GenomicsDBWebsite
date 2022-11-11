import { RecordTableProperties } from "./_recordTableProperties";

export const _variantTableProperties: { [name: string]: RecordTableProperties } = {

    ad_associations_from_gwas: {
        filters: {
            pvalue: "pvalue",
            population: "pie",
            biomarker: "select",
            tissue: "select",
            covariates: "multi_select",
        },
        filterGroups: [
            {Statistics: ["pvalue"]},
            {Phenotype: ["population", "biomarker", "genotype", "tissue", "covariates"]},
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
            {Statistics: ["pvalue"]},
            {Phenotype: [
                "population",
                "diagnosis",
                "neuropathology",
                "biomarker",
                "genotype",
                "tissue",
                "covariates",
            ]},
        ],
        defaultFilter: "pvalue",
        hiddenColumns: ["population", "covariates", "gender", "genotype", "biomarker", "tissue"],
        requiredColumns: ["track", "allele", "pvalue", "diagnosis", "neuropathology"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
    },
    ad_associations_from_catalog: {
        filters: {
            pvalue: "pvalue",
            source: "select",
        },
        filterGroups: [
            {Statistics: ["pvalue"]},
            {Annotation: ["source"]},
        ],
        hiddenColumns: ["source", "sample", "replicate_sample", "pubmed_id", "frequency"],
        requiredColumns: ["pvalue", "trait", "study"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
    },
    other_associations_from_catalog: {
        filters: {
            pvalue: "pvalue",
            source: "select",
        },
        filterGroups: [
            {Statistics: ["pvalue"]},
            {Annotation: ["source"]},
        ],
        hiddenColumns: ["source", "sample", "replicate_sample", "pubmed_id", "frequency"],
        requiredColumns: ["pvalue", "trait", "study"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
    },
    linkage: {
        filters: {
            population: "select",
            r_squared: "greater_than_threshold",
            minor_allele_frequency_ld_ref: "less_than_threshold"
        },
        filterGroups: [
            {Statistics: ["r_squared", "minor_allele_frequency_ld_ref"]},
            {Phenotype: ["population"]},
        ],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        hiddenColumns: ["d_prime"],
        requiredColumns: ["variant", "r_squared", "population"],
        sortedBy: [{ id: "r_squared", descending: true }],
    },
    allele_frequencies: {
        filters: {
            population_source: "select",
            population: "select",
        },
        filterGroups: [
            {Population: ["population", "population_source"]}
        ],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: false,
    },

};