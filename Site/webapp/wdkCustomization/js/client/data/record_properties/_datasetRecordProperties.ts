import { RecordTableProperties } from "./_recordTableProperties";

export const _datasetTableProperties: { [name: string]: RecordTableProperties } = {
    gwas: {
        filters: {
            consortium: "select",
            neuropathology: "pie",
            population: "pie",
            biomarker: "select",
            genotype: "select",

        },
        filterGroups: [
            {Affiliation: ["consortium"]},
            {Phenotype: ["neuropathology", "population", "biomarker", "genotype"]}
        ],
        requiredColumns: ["track", "name"],
        hiddenColumns: ["description", "covariates", "biomarker", "genotype"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
    },
    gene_risk: {
        filters: {
            consortium: "select",
            neuropathology: "pie",
            population: "pie",
            biomarker: "select",
            genotype: "select",

        },
        filterGroups: [
            {Affiliation: ["consortium"]},
            {Phenotype: ["neuropathology", "population", "biomarker", "genotype"]}
        ],
        requiredColumns: ["track", "name"],
        hiddenColumns: ["description", "covariates", "biomarker", "genotype"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
    },
    rare_variants: {
        filters: {
            consortium: "select",
            neuropathology: "pie",
            population: "pie",
            biomarker: "select",
            genotype: "select",

        },
        filterGroups: [
            {Affiliation: ["consortium"]},
            {Phenotype: ["neuropathology", "population", "biomarker", "genotype"]}
        ],
        requiredColumns: ["track", "name"],
        hiddenColumns: ["description", "covariates", "biomarker", "genotype"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
    },
};