import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";

export const _datasetTableProperties: { [name: string]: TableProperties } = {
    gwas: {
        filters: {
            consortium: "select",
            neuropathology: "pie",
            population: "pie",
            biomarker: "select",
            genotype: "select",
        },
        filterGroups: [
            { label: "Affiliation", columns: ["consortium"], defaultOpen: true },
            {
                label: "Phenotype",
                columns: ["neuropathology", "population", "biomarker", "genotype"],
                defaultOpen: true,
            },
        ],
        requiredColumns: ["dataset_accession", "name"],
        hiddenColumns: ["track", "description", "covariates", "biomarker", "genotype"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        accessors: {"dataset_record_link": "Link"}
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
            { label: "Affiliation", columns: ["consortium"], defaultOpen: true },
            {
                label: "Phenotype",
                columns: ["neuropathology", "population", "biomarker", "genotype"],
                defaultOpen: true,
            },
        ],
        requiredColumns: ["track", "name"],
        hiddenColumns: ["description", "covariates", "biomarker", "genotype"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        accessors: {"track": "Link"}
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
            { label: "Affiliation", columns: ["consortium"], defaultOpen: true },
            {
                label: "Phenotype",
                columns: ["neuropathology", "population", "biomarker", "genotype"],
                defaultOpen: true,
            },
        ],
        requiredColumns: ["track", "name"],
        hiddenColumns: ["description", "covariates", "biomarker", "genotype"],
        defaultOpen: false,
        canFilter: true,
        canToggleColumns: true,
        accessors: {"track": "Link"}
    },
};
