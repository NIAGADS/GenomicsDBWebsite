export * from "./filters";
export * from "./styles";
export * from "./TableFilterTypes";
export * from "./ColumnFilters";
export * from "./GlobalFilters";

export type FilterType =
    | "greater_than_threshold"
    | "less_than_threshold"
    | "fuzzyText"
    | "booleanPie"
    | "numeric"
    | "greater"
    | "pie"
    | "pvalue"
    | "select"
    | "multi_select"
    | "global";
