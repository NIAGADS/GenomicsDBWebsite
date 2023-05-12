import { RecordTableProperties as TableProperties } from "@components/Record/RecordTable";
import { RecordSectionDocumentation } from "@components/Record/Types";

export const _trackDocumentation: { [category: string]: RecordSectionDocumentation[] } = {
    overview: [{ text: "", comingSoon: "Information about the Manhattan plot summary coming soon." }],
    "genetic-variation": [
        {
            text: "This section reports the top variants (p <0.001) from this GWAS summary statistics dataset.",
            comingSoon: "Additional documentation coming soon",
        },
    ],
};

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
        requiredColumns: ["variant_link", "pvalue"],
        hiddenColumns: ["chromosome", "position", "msc_is_coding_flag", "msc_impact"],
        defaultOpen: true,
        canFilter: true,
        canToggleColumns: true,
        linkedPanel: {
            type: "LocusZoom",
            column: "variant_link",
            isJSON: true,
            enableRowSelect: true,
        },
        sortedBy: [{ id: "pvalue", descending: false }],
        accessors: {
            adsp_variant_flag: "BooleanRedCheck",
            msc_is_coding_flag: "BooleanGreenCheck",
            variant_link: "Link",
            pvalue: "ScientificNotation",
            msc_impacted_gene_link: "Link",
        },
    },
};
