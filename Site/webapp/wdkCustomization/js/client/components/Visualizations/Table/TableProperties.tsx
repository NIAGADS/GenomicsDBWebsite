import { ColumnAccessorType } from "@viz/Table";
import { FilterGroup } from "@viz/Table/TableFilters";

export interface TableColumnSort {
    id: string;
    descending: boolean;
}

export interface TableProperties {
    filters?: { [columnId: string]: string };
    filterGroups?: FilterGroup[];
    defaultFilter?: string;
    hiddenColumns?: string[];
    requiredColumns?: string[];
    defaultOpen?: boolean;
    canFilter: boolean;
    canToggleColumns: boolean;
    fullWidth?: boolean;
    sortedBy?: TableColumnSort[];
    accessors?: {[key: string]: ColumnAccessorType};
}

export const _defaultTableProperties: TableProperties = {
    defaultOpen: false,
    canFilter: false,
    fullWidth: false,
    canToggleColumns: false,
};
