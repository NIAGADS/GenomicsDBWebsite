export interface RecordTableColumnSort {
    id: string;
    descending: boolean;
}

export interface RecordTableProperties {
    filters?: { [columnId: string]: string };
    filterGroups?: { [groupId: string]: string[] };
    defaultFilter?: string;
    hiddenColumns?: string[];
    requiredColumns?: string[];
    defaultOpen?: boolean;
    canFilter: boolean;
    canToggleColumns: boolean;
    fullWidth?: boolean;
    sortedBy?: RecordTableColumnSort[];
}

export const _defaultTableProperties: RecordTableProperties = {
    defaultOpen: false,
    canFilter: false,
    fullWidth: false,
    canToggleColumns: false,
};

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
                Statistics: ["pvalue"],
                Position: ["relative_position"],
                Annotation: ["adsp_variant_flag", "gene_impact", "gene_consequence"],
                Phenotype: ["population", "biomarker", "genotype", "tissue", "covariates"],
            },
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
        },
        other_variants_from_gwas: {
            filters: {
                pvalue: "pvalue",
                adsp_variant_flag: "pie",
                gene_impact: "pie",
                gene_consequence: "pie",
                relative_position: "pie",
                diagnosis: "pie",
                neuropathology: "pie",
                population: "pie",
                biomarker: "select",
                tissue: "select",
                covariates: "multi_select",
            },
            filterGroups: {
                Statistics: ["pvalue"],
                Position: ["relative_position"],
                Annotation: ["adsp_variant_flag", "gene_impact", "gene_consequence"],
                Phenotype: [
                    "population",
                    "diagnosis",
                    "neuropathology",
                    "biomarker",
                    "genotype",
                    "tissue",
                    "covariates",
                ],
            },
            defaultFilter: "pvalue",
            hiddenColumns: ["population", "covariates", "gender", "genotype", "biomarker", "tissue"],
            requiredColumns: ["track", "variant_link", "pvalue", "diagnosis", "neuropathology"],
            defaultOpen: false,
            canFilter: true,
            canToggleColumns: true,
            sortedBy: [{ id: "pvalue", descending: false }],
        },
        ad_variants_from_catalog: {
            filters: {
                pvalue: "pvalue",
                adsp_variant_flag: "pie",
                gene_impact: "pie",
                gene_consequence: "pie",
                relative_position: "pie",
                source: "select",
            },
            filterGroups: {
                Statistics: ["pvalue"],
                Position: ["relative_position"],
                Annotation: ["source", "adsp_variant_flag", "gene_impact", "gene_consequence"],
            },
            defaultFilter: "pvalue",
            hiddenColumns: ["source", "sample", "replicate_sample", "pubmed_id", "frequency"],
            requiredColumns: ["variant_link", "pvalue", "trait", "study"],
            defaultOpen: false,
            canFilter: true,
            canToggleColumns: true,
            sortedBy: [{ id: "pvalue", descending: false }],
        },
        other_variants_from_catalog: {
            filters: {
                pvalue: "pvalue",
                adsp_variant_flag: "pie",
                gene_impact: "pie",
                gene_consequence: "pie",
                relative_position: "pie",
                source: "select",
            },
            filterGroups: {
                Statistics: ["pvalue"],
                Position: ["relative_position"],
                Annotation: ["source", "adsp_variant_flag", "gene_impact", "gene_consequence"],
            },
            hiddenColumns: ["source", "sample", "replicate_sample", "pubmed_id", "frequency"],
            requiredColumns: ["variant_link", "pvalue", "trait", "study"],
            defaultOpen: false,
            canFilter: true,
            canToggleColumns: true,
            sortedBy: [{ id: "pvalue", descending: false }],
        },
        go_terms: {
            filters: {
                go_evidence_code: "select",
                ontology: "select",
            },
            filterGroups: {
                Annotation: ["go_evidence_code", "ontology"],
            },
            defaultOpen: false,
            canFilter: true,
            canToggleColumns: false,
        },
        pathways: {
            defaultOpen: false,
            canFilter: true,
            canToggleColumns: false,
        },
    },
    Variant: {
        ad_associations_from_gwas: {
            filters: {
                pvalue: "pvalue",
                population: "pie",
                biomarker: "select",
                tissue: "select",
                covariates: "multi_select",
            },
            filterGroups: {
                Statistics: ["pvalue"],
                Phenotype: ["population", "biomarker", "genotype", "tissue", "covariates"],
            },
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
            filterGroups: {
                Statistics: ["pvalue"],
                Phenotype: [
                    "population",
                    "diagnosis",
                    "neuropathology",
                    "biomarker",
                    "genotype",
                    "tissue",
                    "covariates",
                ],
            },
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
            filterGroups: {
                Statistics: ["pvalue"],
                Annotation: ["source"],
            },
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
            filterGroups: {
                Statistics: ["pvalue"],
                Annotation: ["source"],
            },
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
            filterGroups: {
                Statistics: ["r_squared", "minor_allele_frequency_ld_ref"],
                Phenotype: ["population"],
            },
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
            filterGroups: {
                Population: ["population", "population_source"]
            },
            defaultOpen: true,
            canFilter: true,
            canToggleColumns: false,
        },
    },
};
