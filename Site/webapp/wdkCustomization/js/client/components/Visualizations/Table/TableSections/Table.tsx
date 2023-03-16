// modeled after https://github.com/ggascoigne/react-table-example
import React, { useMemo, useState, useEffect, useCallback } from "react";
import cx from "classnames";
import { get } from "lodash";

import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";

import { InfoAlert } from "@components/MaterialUI";

import useLocalStorage from "genomics-client/hooks/useLocalStorage";

import {
    useTable,
    usePagination,
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce,
    TableInstance,
    useRowSelect,
    HeaderGroup
} from "react-table";

import { useTableStyles, Table as TableProps } from "@viz/Table";

import { RowSelectCheckbox } from "@viz/Table/RowSelectors";

import {
    fuzzyTextFilter,
    numericTextFilter,
    greaterThanFilter,
    lessThanFilter,
    includesFilter,
    includesAnyFilter
} from "@viz/Table/TableFilters";

import {
    alphanumericSort,
    alphanumericCaseSensitiveSort,
    linkSort,
    basicSort,
    scientificNotationSort,
    textSort,
    textCaseSensitiveSort,
    barChartSort,
    booleanFlagSort,
} from "@viz/Table/TableSortingFunctions";

import { TableHeaderCell, TableToolbar } from "@viz/Table/TableSections";

export const Table: React.FC<TableProps> = ({ className, columns, title, data, options }) => {
    const classes = useTableStyles();

    const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {});

    const defaultFilterTypes = {
        fuzzyText: useMemo(() => fuzzyTextFilter, []),
        numeric: useMemo(() => numericTextFilter, []),
        greater: useMemo(() => greaterThanFilter, []),
        select: useMemo(() => includesFilter, []),
        multi_select: useMemo(() => includesAnyFilter, []),
        typeahead_select: useMemo(() => includesAnyFilter, []),
        pie: useMemo(() => includesFilter, []),
        boolean_pie: useMemo(() => includesFilter, []),
        pvalue: useMemo(() => greaterThanFilter, []),
        greater_than_threshold: useMemo(() => greaterThanFilter, []),
        less_than_threshold: useMemo(() => lessThanFilter, []),
    };


    const hooks = useMemo(() => {
        return [
            useFlexLayout,
            useResizeColumns,
            useGlobalFilter,
            useFilters,
            useSortBy,
            usePagination,
            useRowSelect
        ]
    }, []);

    // add custom filterTypes into the default / overwrite defaults
    const tableFilterTypes = useMemo(() => {
        return options.filterTypes
            ? Object.assign({}, defaultFilterTypes, options.filterTypes)
            : defaultFilterTypes;
    }, [options.filterTypes]);

    const sortingFunctions = {
        alphanumeric: useMemo(() => alphanumericSort, []),
        alphanumericCaseSensitiveSort: useMemo(() => alphanumericCaseSensitiveSort, []),
        basic: useMemo(() => basicSort, []),
        textCaseSensitive: useMemo(() => textCaseSensitiveSort, []),
        text: useMemo(() => textSort, []),
        stackedBar: useMemo(() => barChartSort, []),
        booleanFlag: useMemo(() => booleanFlagSort, []),
        link: useMemo(() => linkSort, []),
        scientificNotation: useMemo(() => scientificNotationSort, []),
    };


    const buildTableProps = useCallback(() => {
        const initialState = {
            pageIndex: 0,
            pageSize: 10,
            filters: [options.initialFilters ? options.initialFilters : {}],
            sortBy: options.initialSort ? options.initialSort : [],
            hiddenColumns: columns.filter((col: any) => col.show === false).map((col) => col.id || col.accessor) as any,
        };

        let tableProps = {
            columns,
            data,
            initialState: initialState,
            defaultCanFilter: false,
            // fix to force table to always take full width of container
            // https://stackoverflow.com/questions/64094137/how-to-resize-columns-with-react-table-hooks-with-a-specific-table-width
            // https://spectrum.chat/react-table/general/v7-resizing-columns-no-longer-fit-to-width~4ea8a7c3-b21a-49a0-8582-baf0a6202d43
            defaultColumn: {
                minWidth: 30, // minWidth is only used as a limit for resizing
                width: 150, // width is used for both the flex-basis and flex-grow
                maxWidth: 300, // maxWidth is only used as a limit for resizing
                Filter: (): any => null, // overcome the issue that useGlobalFilter sets canFilter to true
            },
            globalFilter: "global" in tableFilterTypes ? "global" : "text", // text is the react-table default
            filterTypes: tableFilterTypes,
            sortTypes: sortingFunctions,
        };

        // if row select is button, it is handled in the cell rendering
        // this is only for global select boxes
        const rowSelect = get(options, "rowSelect.type", null);
        if (rowSelect) {
            if (rowSelect.includes("Check")) { // Check or MultiCheck
                tableProps = Object.assign(tableProps, {
                    getRowId: (row: any, index: number) => {
                        return "row_id" in row ? row.row_id : index;
                    }
                });
            }
            if (rowSelect === "Check") { // allow only one row to be selected at a time
                tableProps = Object.assign(tableProps, {
                    intitialState: Object.assign(initialState, {
                        selectedRowIds: { 0: true },
                    }),
                    stateReducer: (newState: any, action: any) => {
                        // allows only one row to be selected
                        if (action.type === "toggleRowSelected") {
                            //@ts-ignore
                            newState.selectedRowIds = {
                                [action.id]: true,
                            };
                        }
                        return newState;
                    }
                }
                );
            }
        }
        return tableProps;
    }, [options]);



    const instance: TableInstance = (get(options, "rowSelect.type", null) === "Check")
        ? useTable(buildTableProps(), ...hooks, (hooks) => {
            hooks.visibleColumns.push((columns: any) => [
                {
                    id: "selection",
                    sortable: false,
                    Header: options.rowSelect.label,
                    Cell: (cell: any) => (
                        <div>
                            <RowSelectCheckbox
                                {...cell.row.getToggleRowSelectedProps()}
                                title={options.rowSelect.tooltip}
                            />
                        </div>
                    ),
                },
                ...columns,
            ]);
        })
        : useTable(buildTableProps(), ...hooks);

    const {
        //@ts-ignore
        state: { selectedRowIds },
        state,
        //@ts-ignore
        toggleRowSelected,
        getTableProps,
        headerGroups,
        prepareRow,
        //@ts-ignore
        preFilteredRows,
        //@ts-ignore
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
    } = instance;

    const debouncedState = useAsyncDebounce(state as any, 500);

    useEffect(() => {
        const { sortBy, filters, pageSize, columnResizing, hiddenColumns, selectedRowIds } = debouncedState;
        const val = {
            sortBy,
            filters,
            pageSize,
            columnResizing,
            hiddenColumns,
            selectedRowIds,
        };
        setInitialState(val);
    }, [setInitialState, debouncedState]);

    return preFilteredRows.length === 0 || page.length === 0 ? (
        <Box className={className ? className : null}>
            <InfoAlert
                title="No