import { TableProperties } from "@viz/Table/TableProperties";

export const _selectorTableProperties: TableProperties = {
    filters: {
        track_type_display: "multi_select",
        feature_type: "select",
        source: "select",
        assay: "select",
        covariates: "multi_select",
        population: "pie",
        diagnosis: "pie",
        biomarker: "pie",
    },
    filterGroups: [
        { label: "Type", columns: ["track_type_display", "feature_type", "source"], defaultOpen: true },
        { label: "Phenotype", columns: ["population", "diagnosis", "biomarker", "genotype", "tissue", "covariates"] },
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
    requiredColumns: ["track", "variant_link", "pvalue"],
    defaultOpen: true,
    canFilter: true,
    canToggleColumns: true,
    sortedBy: [{ id: "pvalue", descending: false }],
    accessors: {
        adsp_variant_flag: "BooleanFlag",
        pvalue: "ScientificNotation",
        variant_link: "Link",
        track: "Link",
        gene_impact: "VariantImpact",
    },
};
