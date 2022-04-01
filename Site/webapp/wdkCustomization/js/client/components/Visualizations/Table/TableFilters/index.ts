import React from "react";
import { TableInstance } from "react-table";

export * from "./TableFilters";
export * from "./FilterPanel";
export * from "./FilterChipBar";

export * from "./styles";

export type FilterPageProps = {
    instance: TableInstance;
};