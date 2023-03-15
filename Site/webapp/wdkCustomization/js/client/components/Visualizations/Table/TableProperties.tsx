import { ColumnAccessorType } from "@viz/Table/ColumnAccessors";
import { FilterGroup, FilterType } from "@viz/Table/TableFilters";

export interface TableColumnSort {
    id: string;
    descending: boolean;
}

export interface TableLinkedPanel {
    type: "LocusZoom",
    canSelect: boolean,
    selectValueSource: string;
}

export interface TableProperties {
    filters?: { [columnId: string]: FilterType };
    filterGroups?: FilterGroup[];
    defaultFilter?: string;
    hiddenColumns?: string[];
    requiredColumns?: string[];
    defaultOpen?: boolean;
    canFilter: boolean;
    canExport?: boolean;
    canToggleColumns: boolean;
    linkedPanel?: TableLinkedPanel;
    fullWidth?: boolean;
    sortedBy?: TableColumnSort[];
    accessors?: {[key: string]: ColumnAccessorType };
}

export const _defaultTableProperties: TableProperties = {
    defaultOpen: false,
    canFilter: false,
    canExport: true,
    fullWidth: false,
    canToggleColumns: false,
};
