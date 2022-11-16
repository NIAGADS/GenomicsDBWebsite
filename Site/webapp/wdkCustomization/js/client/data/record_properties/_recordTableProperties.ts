import { FilterGroup } from "@viz/Table/TableFilters";

import { _geneTableProperties as _geneRecordTableProperties } from "./_geneRecordProperties";
import { _variantTableProperties as _variantRecordTableProperties } from "./_variantRecordProperties";
import { _trackTableProperties as _trackRecordTableProperties } from "./_trackRecordProperties";
import { _datasetTableProperties as _datasetRecordTableProperties } from "./_datasetRecordProperties";


export interface RecordTableColumnSort {
    id: string;
    descending: boolean;
}

export interface RecordTableProperties {
    filters?: { [columnId: string]: string };
    filterGroups?: FilterGroup[];
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
    Gene: _geneRecordTableProperties,
    Variant: _variantRecordTableProperties,
    Track: _trackRecordTableProperties,
    Dataset: _datasetRecordTableProperties
};
