import React from "react";
import { TableInstance } from "react-table";

export * from "./filters";
export * from "./FilterPanel";
export * from "./FilterChipBar";
export * from "./TableFilters";
export * from "./styles";

export type FilterPageProps = {
    instance: TableInstance;
    filterGroups?: { [id: string]: string[] }[];
};