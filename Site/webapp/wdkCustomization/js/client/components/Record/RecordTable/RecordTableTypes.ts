import { TableField, TableValue } from "wdk-client/Utils/WdkModel";
import { TableInstance } from "react-table";
import { TableProperties } from "@viz/Table/TableProperties";
import { FilterType } from "@viz/Table/TableFilters";
import { ColumnAccessorType } from "genomics-client/components/Visualizations/Table/ColumnAccessors";

export interface Filters extends Array<Record<FilterType, any>> {}

export type RecordTableColumnAccessorType =
    | ColumnAccessorType
    | "RelativePosition"
    | "VariantImpact"
    | "AnnotatedText"
    | "MetaseqID"
    | "BooleanGreenCheck"
    | "BooleanRedCheck"
    | "RowSelectButton";

export interface RecordTableProps {
    table: TableField;
    data: TableValue;
    properties?: RecordTableProperties;
    recordPrimaryKey: string;
    onLoad?: (ref: React.MutableRefObject<TableInstance>) => void;
}

export interface RecordTableProperties extends Omit<TableProperties, "accessors"> {
    accessors?: { [key: string]: RecordTableColumnAccessorType };
}
