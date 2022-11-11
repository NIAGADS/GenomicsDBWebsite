import { RecordTableProperties } from "./_recordTableProperties";

export const _trackTableProperties: { [name: string]: RecordTableProperties } = {
    top_variants: {
        filters: {
            pvalue: "pvalue",
            chromosome: "pie",
            adsp_variant_flag: "pie",
            most_severe_consequence: "pie",
            msc_impact: "pie",
            msc_is_coding_flag: "pie"
        },
        filterGroups: [
            {Statistics: ["pvalue"]},
            {Position: ["chromosome"]},
            {Annotation: ["adsp_variant_flag", "most_severe_consequence", "msc_impact", "msc_is_coding_flag"]},
        ],
        defaultFilter: "pvalue",
        requiredColumns: ["track", "variant", "pvalue"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        sortedBy: [{ id: "pvalue", descending: false }],
    },
};