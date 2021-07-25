import React, { MouseEventHandler } from 'react';
import {

    Column,
    Row,
    UsePaginationState,
    TableInstance
} from "react-table";

export interface TableState<D extends object = {}> extends UsePaginationState<D> {}

export interface CustomTableProps {
    columns: Column<{}>[];
    data: any;
    canFilter: boolean;
    filterTypes?: any; // json object of filter types
    className?: string;
    showAdvancedFilter?: boolean;
}


export type TableMouseEventHandler = (instance: TableInstance) => MouseEventHandler;

export type TableData = Record<string, string>;