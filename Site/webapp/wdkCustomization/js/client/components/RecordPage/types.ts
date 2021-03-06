import { RecordClass } from "wdk-client/Utils/WdkModel";
//@ts-ignore
import { Filter } from "react-csv";
import { Instance as rtInstance } from "react-table";

//when fixing this up, cf WdkModel.ts

export interface BaseRecord {
    attributes: { [key: string]: any };
    displayName: string;
    displayNamePlural: string;
    recordClassName: string;
    shortDisplayName: string;
    tables: any;
    tableErrors: any[];
    useBasket: boolean;
}

export interface GeneRecord extends BaseRecord {
    attributes: GeneRecordAttributes;
    categories: any[];
    description: string;
    formats: { [key: string]: any };
    hasAllRecordsQuery: boolean;
    id: string;
    name: string;
    primaryKeyColumnRefs: string[];
    recordIdAttributeName: string;
    shortDisplayNamePlural: string;
    tables: GeneRecordTableType;
    urlSegment: "gene";
}

interface GeneRecordTableType {
    [key: string]: {
        transcripts: any;
        ad_skat_adsp: any;
        ad_gwas_nhgri: any;
        other_gwas_nhgri: any;
        ad_gwas_niagads: any;
        other_gwas_niagads: any;
        go_terms: any;
        pathways: any;
    };
}

export interface GeneRecordAttributes {
    has_genetic_evidence_for_ad_risk_display: string; // json
    has_genetic_evidence_for_ad_risk: string;
    chromosome: string;
    ensembl_id: string;
    entrez_id: string;
    gene_name: string;
    gene_symbol: string;
    gene_type: string;
    gws_variants_summary_plot: string;
    has_ad_evidence: "true" | "false";
    hgnc_id: string;
    location_end: string;
    location_start: string;
    cytogenetic_location: string;
    num_colocated_variants: string; // LinkOutGroup;
    num_unique_colocated_variants: string;
    omim_id: string;
    source_id: string;
    span: string;
    strand?: "+" | "-";
    synonyms: any;
    uc_sc_id: string;
    uniprot_id: string;
    vega_id: string;
}

export interface VariantRecord extends BaseRecord {
    attributes: VariantRecordAttributes;
    recordClassName: string;
    urlName: "variant";
    tables: { [key: string]: any };
}

export interface VariantRecordAttributes {
    adsp_wes_qc_filter_status: string;
    adsp_wgs_qc_filter_status: string;
    alt_allele: string;
    alternative_variants: string;
    chromosome: string;
    display_metaseq_id: string;
    colocated_variants: string;
    display_allele: string;
    gws_datasets_summary_plot: string;
    has_merge_history: string;
    is_adsp_variant: boolean;
    is_adsp_wes: boolean;
    is_adsp_wgs: boolean;
    adsp_display_flag: string; // json
    is_multi_allelic: string;
    location: string;
    locuszoom_gwas_datasets: string; //json
    metaseq_id: string;
    most_severe_consequence: string;
    msc_amino_acid_change: string;
    msc_codon_change: string;
    msc_impact: string;
    msc_impacted_gene: string;
    msc_impacted_gene_link: string;
    msc_impacted_transcript: string;
    msc_is_coding: string;
    num_impacted_genes: string;
    num_impacted_transcripts: string;
    position: string;
    ref_snp_id: string;
    ref_allele: string;
    sequence_allele: string;
    upstream_sequence: string;
    variant_class: string;
    variant_class_abbrev: string;
    variant_source: string;
}

export interface GWASDatasetRecord extends BaseRecord {
    attributes: GWASDatasetRecordAttributes;
    id: { [key: string]: any };
    urlName: "gwas_summary";
    tables: { [key: string]: any };
}

export interface GWASDatasetRecordAttributes {
    name: string;
    description: string;
    attribution: string;
    category: string;
    is_adsp: string;
    accession_link: string;
    niagads_accession: string;
    search_link: string;
    has_manhattan_plot: boolean;
}

export interface NIAGADSDatasetRecord extends BaseRecord {
    attributes: NIAGADSDatasetRecordAttributes;
    urlName: "gwas_summary";
    tables: { [key: string]: any };
}

export interface NIAGADSDatasetRecordAttributes {
    name: string;
    description: string;
    external_link: string;
    is_adsp: string;
}

export interface RecordTable {
    //todo: other record types, likely need to use generic: IRecordTable<GeneRecord>
    record: BaseRecord;
    recordClass: RecordClass;
    table: Table;
    value: { [key: string]: any }[];
    className: string;
}

type tableType = "default" | "chart_filter" | "default" | "browser_linked";

export interface Table {
    attributes: TableAttribute[];
    clientSortSpec: any[];
    description: string;
    displayName: string;
    isDisplayable: boolean;
    isInReport: boolean;
    name: string;
    properties: {
        [key: string]: any;
        type: tableType[];
        canShrink: boolean[];
        filter_field: string[];
        defaultOpen: string[];
    };
}

export interface TableAttribute {
    isInReport: boolean;
    formats: [];
    truncateTo: number;
    displayName: string;
    name: string;
    isSortable: boolean;
    isRemovable: boolean;
    isDisplayable: boolean;
    properties: { [key: string]: any };
    type?:
        | "integer"
        | "numeric"
        | "boolean"
        | "string"
        | "json_link"
        | "json_icon"
        | "json_text"
        | "json_text_or_link"
        | "icon"
        | "json_dictionary"
        | "json_table"
        | "percentage_bar"; //, json_* and always can be null!
    help?: string;
}

export interface NiagadsTableStateProps {
    filtered: Filter[];
    pValueFilterVisible: boolean;
    filterVal: string;
    csvData: { [key: string]: any }[] | "";
    tableInstance: rtInstance | null;
    basket: { [key: string]: any }[];
}

export interface VariantRecordSummary {
    record: VariantRecord;
    recordClass: { [key: string]: any };
    headerActions: HeaderActions[];
}

export interface HeaderActions {
    iconClassName: string;
    onClick: any;
    label: string;
}

export const isVariantRecord = (item: VariantRecord | any): item is VariantRecord => {
    return (item as VariantRecord).recordClassName === "VariantRecordClasses.VariantRecordClass";
};
