import {
    usePagination,
    Column,
    Row,
    UsePaginationState,
    UseTableOptions,
    UsePaginationOptions,
    UseFiltersOptions,
} from "react-table";

export interface TableState<D extends object = {}> extends UsePaginationState<D> {}

export interface CustomTableProps {
    columns: Column<{}>[];
    data: any;
    onClick?: (row: Row) => void;
}

