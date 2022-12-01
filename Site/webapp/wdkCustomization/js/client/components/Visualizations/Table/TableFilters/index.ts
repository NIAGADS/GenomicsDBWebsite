export * from "./filters";
export * from "./styles";
export * from "./TableFilterTypes";
export * from "./ColumnFilters";
export * from "./GlobalFilters";

export type FilterType =
    | "greater_than_threshold"
    | "less_than_threshold"
    | "fuzzyText"
    | "boolean_pie"
    | "numeric"
    | "greater"
    | "pie"
    | "pvalue"
    | "select"
    | "checkbox_select"
    | "radio_select"
    | "typeahead_select"
    | "tissue"
    | "global";
