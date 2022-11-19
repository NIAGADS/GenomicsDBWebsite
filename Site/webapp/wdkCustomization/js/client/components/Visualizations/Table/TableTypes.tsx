import React, { MouseEventHandler } from 'react';
import {
    Column,
    Row,
    UsePaginationState,
    TableInstance
} from "react-table";

export interface TableState<D extends object = {}> extends UsePaginationState<D> {}

export type TableMouseEventHandler = (instance: TableInstance) => MouseEventHandler;

export type TableData = Record<string, string>;

export type ColumnAccessorType = 'StackedBar' | 'Default' | "BooleanFlag" | "Link" | "ScientificNotation" | "Float" | "VariantImpact" | "RelativePosition";

export interface TableProps {
    instance: TableInstance;
    className?: string;
}

