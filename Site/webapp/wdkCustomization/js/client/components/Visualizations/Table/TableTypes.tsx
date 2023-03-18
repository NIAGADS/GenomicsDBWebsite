import { Column } from "react-table";

import { FilterGroup } from "@viz/Table/TableFilters";

export type TableData = Record<string, string>;

export interface RowSelectOptions {
    label: string;
    tooltip: string;
    column?: string;
    action?: any;
    type: "Check" | "MultiCheck"
}

export interface LinkedPanelOptions  {
    type: "LocusZoom",
    label: string;
    initialState: { [key: string]: any},
    rowSelect: RowSelectOptions
}

export interface TableOptions {
    canFilter: boolean;
    canExport?: boolean;
    filterTypes?: any; // json object of filter types
    filterGroups?: FilterGroup[];   
    showAdvancedFilter?: boolean;
    showHideColumns?: boolean;
    requiredColumns?: string[];
    initialFilters?: any;
    initialSort?: any;
    linkedPanel?: LinkedPanelOptions;
    rowSelect?: RowSelectOptions;
}

export interface Table {
    className?: string;
    columns: Column<{}>[];
    title?: string;
    data: any;
    options: TableOptions
}

