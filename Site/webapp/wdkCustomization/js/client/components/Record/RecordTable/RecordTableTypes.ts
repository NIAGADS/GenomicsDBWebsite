import { TableField, AttributeField, TableValue, AttributeValue } from "wdk-client/Utils/WdkModel";
import { TableInstance } from "react-table";
import { RecordTableProperties } from "genomics-client/data/_recordTableProperties";

type FilterType = "pie" | "pvalue" | "select";
export interface Filters extends Array<Record<FilterType, any>> {}

export interface RecordTableProps {
    table: TableField;
    data: TableValue;
    properties?: RecordTableProperties;
    onLoad?: (ref: React.MutableRefObject<TableInstance>) => void;
}

export interface TableAttribute extends AttributeField {
    type?:
        | "integer"
        | "numeric"
        | "boolean"
        | "string"
        | "json_link"
        | "json_icon"
        | "json_text"
        | "json_text_or_link"
        | "icon"
        | "json_dictionary"
        | "json_table"
        | "percentage_bar"; //, json_* and always can be null!
}

/* export interface RecordTableStateProps {
    filtered: Filter[];
    pValueFilterVisible: boolean;
    filterVal: string;
    csvData: { [key: string]: any }[] | "";
    tableInstance: rtInstance | null;
    basket: { [key: string]: any }[];
} */
