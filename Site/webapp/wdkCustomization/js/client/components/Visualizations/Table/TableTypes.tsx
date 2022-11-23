import { MouseEventHandler } from 'react';
import {
    UsePaginationState,
    TableInstance
} from "react-table";

export interface TableState<D extends object = {}> extends UsePaginationState<D> {}

export type TableMouseEventHandler = (instance: TableInstance) => MouseEventHandler;

export type TableData = Record<string, string>;

export type FilterType = "greater_than_threshold" | "less_than_threshold" | "fuzzyText" | "booleanPie" | "numeric" | "greater" | "pie" | "pvalue" | "select" | "multi_select" | "global";

export interface TableProps {
    instance: TableInstance;
    className?: string;
}

