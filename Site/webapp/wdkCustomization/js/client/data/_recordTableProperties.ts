export interface RecordTableColumnSort {
    id: string;
    descending: boolean;
}

export interface RecordTableProperties {
    filters?: { [columnId: string]: string };
    filterGroups?: { [groupId: string]: string[] };
    hiddenColumns?: string[];
    requiredColumns?: string[];
    defaultOpen?: boolean;
    canFilter?: boolean;
    sortedBy?: RecordTableColumnSort[];
}

export const _tableProperties: { [table: string]: { [name: string]: RecordTableProperties } } = {
    Gene: {
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
                covariates: "multi_select",
            },
            filterGroups: {
                Position: ["relative_position"],
                "Variant Annotation": ["adsp_variant_flag", "gene_impact", "gene_consequence"],
                Phenotype: ["population", "genotype", "biomarker", "tissue", "covariates"],
            },
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
            requiredColumns: ["track", "variant_link"],
            defaultOpen: true,
            canFilter: true,
            sortedBy: [{ id: "pvalue", descending: false }],
        },
    },
};
