import { TableProperties } from "@viz/Table/TableProperties";

export const _trackTableProperties: { [name: string]: TableProperties } = {
    top_variants: {
        filters: {
            pvalue: "pvalue",
            chromosome: "pie",
            adsp_variant_flag: "pie",
            most_severe_consequence: "pie",
            msc_impact: "pie",
            msc_is_coding_flag: "pie",
        },
        filterGroups: [
            { label: "Statistics", columns: ["pvalue"], defaultOpen: true },
            { label: "Position", columns: ["chromosome"], defaultOpen: true },
            {
                label: "Annotation",
                columns: ["adsp_variant_flag", "most_severe_consequence", "msc_impact", "msc_is_coding_flag"],
                defaultOpen: true,
            },
        ],
        defaultFilter: "pvalue",
        requiredColumns: ["variant", "pvalue"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: {
            adsp_variant_flag: "BooleanFlag",
            msc_is_coding_flag: "BooleanFlag",
            variant: "Link",
            pvalue: "ScientificNotation",
            msc_impacted_gene_link: "Link",
        },
    },
};
