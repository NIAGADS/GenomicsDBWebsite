import { TableField, TableValue } from "wdk-client/Utils/WdkModel";
import { TableInstance } from "react-table";
import { TableProperties } from "@viz/Table/TableProperties";

type FilterType = "pie" | "pvalue" | "select";
export interface Filters extends Array<Record<FilterType, any>> {}

export interface RecordTableProps {
    table: TableField;
    data: TableValue;
    properties?: TableProperties;
    onLoad?: (ref: React.MutableRefObject<TableInstance>) => void;
}

