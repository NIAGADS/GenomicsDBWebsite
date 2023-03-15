import { Column } from "react-table";

import { FilterGroup } from "@viz/Table/TableFilters";

export type TableData = Record<string, string>;

export interface RowSelectOptions {
    label?: string;
    column?: string;
    tooltip: string;
    action: any;
    type: "Check" | "Button" | "MultiCheck"
}

interface LinkedPanelOptions  {
    type: "LocusZoom",
    renderer: any;
}

export interface TableOptions {
    canFilter: boolean;
    canExport?: boolean;
    rowSelect?: RowSelectOptions;
    filterTypes?: any; // json object of filter types
    filterGroups?: FilterGroup[];   
    showAdvancedFilter?: boolean;
    showHideColumns?: boolean;
    requiredColumns?: string[];
    initialFilters?: any;
    initialSort?: any;
    linkedPanel?: LinkedPanelOptions;
}

export interface Table {
    className?: string;
    columns: Column<{}>[];
    title?: string;
    data: any;
    options: TableOptions
}

