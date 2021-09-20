// modeled after https://github.com/ggascoigne/react-table-example

import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect, Props } from "react";
import { assign } from "lodash";

import Grid from "@material-ui/core/Grid";

import VerticalTabContainer from "../../MaterialUI/Tabs/VerticalTabContainer";

import {
    useTable,
    usePagination,
    useSortBy,
    HeaderGroup,
    useResizeColumns,
    useFlexLayout,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce,
    Column,
    TableInstance,
} from "react-table";

import useLocalStorage from "../../../hooks/useLocalStorage";
import TablePagination from "./TablePagination";
import Table from "./Table";

import FilterPanel from "./TableFilters/FilterPanel";
import { TableColumnsPanel } from "./TableColumnsPanel";

import { FilterChipBar } from "./TableFilters/FilterChipBar";

import { fuzzyTextFilter, numericTextFilter, greaterThanFilter, includesFilter } from "./TableFilters/filters";
import { GlobalFilter } from "./TableFilters/TableFilters";

import { useStyles } from "./TableStyles";

export interface TableContainerProps {
    columns: Column<{}>[];
    data: any;
    canFilter: boolean;
    filterTypes?: any; // json object of filter types
    className?: string;
    showAdvancedFilter?: boolean;
    showHideColumns?: boolean;
    initialFilters?: any;
}

const hooks = [
    //useColumnOrder,
    //useGroupBy,
    //useExpanded,
    useFlexLayout,
    useResizeColumns,
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    //useRowSelect,
    //selectionHook,
];

const defaultFilterTypes = {
    fuzzyText: fuzzyTextFilter,
    numeric: numericTextFilter,
    greater: greaterThanFilter,
    select: includesFilter,
    pie: includesFilter,
    booleanPie: includesFilter,
    pvalue: greaterThanFilter
};

// fix to force table to always take full width of container
// https://stackoverflow.com/questions/64094137/how-to-resize-columns-with-react-table-hooks-with-a-specific-table-width
// https://spectrum.chat/react-table/general/v7-resizing-columns-no-longer-fit-to-width~4ea8a7c3-b21a-49a0-8582-baf0a6202d43
const _defaultColumn = React.useMemo(
    () => ({
        // When using the useFlexLayout:
        minWidth: 30, // minWidth is only used as a limit for resizing
        width: 150, // width is used for both the flex-basis and flex-grow
        maxWidth: 300, // maxWidth is only used as a limit for resizing
        //@ts-ignore
        Filter: () => null, // overcome the issue that useGlobalFilter sets canFilter to true
        //Cell: ,
        //Header: DefaultHeader,
    }),
    []
);

const TableContainer: React.FC<TableContainerProps> = ({
    columns,
    data,
    filterTypes,
    className,
    canFilter,
    showAdvancedFilter,
    showHideColumns,
    initialFilters
}) => {
    // Use the state and functions returned from useTable to build your UI
    //const instance = useTable({ columns, data }, ...hooks) as TableTypeWorkaround<T>;
    const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {});
    const tableFilterTypes = filterTypes ? assign({}, defaultFilterTypes, filterTypes) : defaultFilterTypes; // add custom filterTypes into the default / overwrite defaults
    const instance = useTable(
        {
            columns,
            data,
            initialState: {
                // @ts-ignore -- TODO will be fixed in react-table v8 / basically @types/react-table is no longer being updated
                pageIndex: 0,
                pageSize: 10,
                filters: [initialFilters ? initialFilters : {}] ,
                hiddenColumns: columns
                    .filter((col: any) => col.show === false)
                    .map((col) => col.id || col.accessor) as any,
            },
            defaultCanFilter: false,
            //@ts-ignore
            defaultColumn: _defaultColumn,
            globalFilter: "global" in tableFilterTypes ? "global" : "text", // text is the react-table default
            filterTypes: tableFilterTypes,
        },
        ...hooks
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        setFilter,
        preGlobalFilteredRows,
        preFilteredRows,
        setGlobalFilter,
        globalFilter,
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
        state, //: { pageIndex, pageSize },
    } = instance;

    const debouncedState = useAsyncDebounce(state, 500);

    useEffect(() => {
        const { sortBy, filters, pageSize, columnResizing, hiddenColumns } = debouncedState;
        const val = {
            sortBy,
            filters,
            pageSize,
            columnResizing,
            hiddenColumns,
        };
        setInitialState(val);
    }, [setInitialState, debouncedState]);

    let tabs = ["Data Table"];
    if (showAdvancedFilter) {
        tabs.push("Advanced Filter");
    }
    if (showHideColumns) {
        tabs.push("Select Columns");
    }

    // Render the UI for the table
    return (
        <>
            <Grid container direction="row">
                <Grid item container direction="column">
                    <Grid item xs={12} sm={6}>
                        {canFilter && (
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        )}
                        {canFilter && showAdvancedFilter && <FilterChipBar instance={instance} />}
                        <TablePagination instance={instance} />
                    </Grid>
                </Grid>
                <Grid item>
                    <VerticalTabContainer labels={tabs}>  
                        <Table
                            showAdvancedFilter={showAdvancedFilter}
                            canFilter={canFilter}
                            className={className}
                            instance={instance}
                        />
                        {(canFilter && showAdvancedFilter) && <FilterPanel instance={instance}/>}
                        {showHideColumns && <TableColumnsPanel instance={instance}/>}
                    </VerticalTabContainer>
                </Grid>
            </Grid>
        </>
    );
};

export default TableContainer;
