// modeled after https://github.com/ggascoigne/react-table-example
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import cx from "classnames";
import { get } from "lodash";

import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";

import { InfoAlert, CustomPanel } from "@components/MaterialUI";

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
    HeaderGroup,
} from "react-table";

import { useTableStyles, Table as TableProps, RowSelectOptions, parseFieldValue } from "@viz/Table";

import { RowSelectCheckbox } from "@viz/Table/RowSelectors";

import {
    fuzzyTextFilter,
    numericTextFilter,
    greaterThanFilter,
    lessThanFilter,
    includesFilter,
    includesAnyFilter,
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

import { TableHeaderCell, TableToolbar, LinkedPanel } from "@viz/Table/TableSections";


export const Table: React.FC<TableProps> = ({ className, columns, title, data, options }) => {
    const classes = useTableStyles();

    const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {});
    const [linkedPanelIsOpen, setLinkedPanelIsOpen] = useState<boolean>(false);
    const [columnsPanelIsOpen, setColumnsPanelIsOpen] = useState<boolean>(false);
    const [filterPanelIsOpen, setFilterPanelIsOpen] = useState<boolean>(false);
    const [ linkedPanelCallback, setLinkedPanelCallback] = useState<any>(null);
    /* const [linkedPanelState, setLinkedPanelState] = useState<{ [key: string]: any }>(
        get(options, "linkedPanel.initialState", null)
    );*/

    const firstUpdate = useRef(true);

    const hasLinkedPanel = options.linkedPanel && true;
    const rowSelectProps = options.rowSelect ? options.rowSelect : get(options, "linkedPanel.rowSelect", null);

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
        return [useFlexLayout, useResizeColumns, useGlobalFilter, useFilters, useSortBy, usePagination, useRowSelect];
    }, []);

    // add custom filterTypes into the default / overwrite defaults
    const tableFilterTypes = useMemo(() => {
        return options.filterTypes ? Object.assign({}, defaultFilterTypes, options.filterTypes) : defaultFilterTypes;
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

    const tableProps = useMemo(() => {
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
            disableMultiSort: true,
        };

        if (rowSelectProps !== null) {
            if (rowSelectProps.type.includes("Check")) {
                // Check or MultiCheck
                tableProps = Object.assign(tableProps, {
                    getRowId: (row: any, index: number) => {
                        return "row_id" in row ? row.row_id : index;
                    },
                });
            }
            if (rowSelectProps.type === "Check") {
                // allow only one row to be selected at a time
                tableProps = Object.assign(tableProps, {
                    initialState: Object.assign(initialState, {
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
                    },
                });
            }
        }

        return tableProps;
    }, []);

    const instance =
        rowSelectProps !== null
            ? useTable(tableProps, ...hooks, (hooks) => {
                  hooks.visibleColumns.push((columns: any) => [
                      {
                          id: "selection",
                          sortable: false,
                          Header: rowSelectProps.label,
                          help: rowSelectProps.tooltip.replace(":", ""),
                          Cell: (cell: any) => (
                              <div>
                                  <RowSelectCheckbox
                                      {...cell.row.getToggleRowSelectedProps()}
                                      title={rowSelectProps.tooltip}
                                  />
                              </div>
                          ),
                      },
                      ...columns,
                  ]);
              })
            : useTable(tableProps, ...hooks);

    const {
        //@ts-ignore
        state: { selectedRowIds },
        state,
        //@ts-ignore
        selectedFlatRows,
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

    useEffect(() => {
        // this should keep the update from running on the initial render
        if (hasLinkedPanel) {
            if (firstUpdate.current) {
                firstUpdate.current = false;
                return;
            }
            if (options.linkedPanel.type === "LocusZoom") {
                // for LocusZoom, only one row is ever selected
                const newTargetVariant = parseFieldValue(selectedFlatRows[0].values[options.linkedPanel.rowSelect.column]);
                linkedPanelCallback(newTargetVariant);
            }
        }

        //hasLinkedPanel && linkedPanel.select && linkedPanel.select.action(Object.keys(selectedRowIds)[0]);
    }, [selectedRowIds]);

    const toggleLinkedPanel = useCallback((isOpen: boolean) => {
        setLinkedPanelIsOpen(isOpen);
    }, []);

    const toggleColumnsPanel = useCallback((isOpen: boolean) => {
        setColumnsPanelIsOpen(isOpen);
    }, []);

    const toggleFilterPanel = useCallback((isOpen: boolean) => {
        setFilterPanelIsOpen(isOpen);
    }, []);

    return preFilteredRows.length === 0 || page.length === 0 ? (
        <Box className={className ? className : null}>
            <InfoAlert
                title="No rows meet the selected search or filter criteria."
                message={`Unfiltered table contains ${data.length} rows. Remove or adjust filter criteria to view.`}
            />
        </Box>
    ) : (
        <CustomPanel justifyContent="flex-start">
            <TableToolbar
                instance={instance}
                hasGlobalFilter={options.canFilter}
                canAdvancedFilter={options.showAdvancedFilter}
                columnsPanel={
                    options.showHideColumns
                        ? {
                              toggle: toggleColumnsPanel,
                              label: "Columns",
                              tooltip: "Toggle to add or remove columns from the table",
                          }
                        : null
                }
                linkedPanel={hasLinkedPanel ? { toggle: toggleLinkedPanel, label: options.linkedPanel.type } : null}
            />

            {hasLinkedPanel && (
                <LinkedPanel
                    isOpen={linkedPanelIsOpen}
                    type={options.linkedPanel.type}
                    initialState={options.linkedPanel.initialState}
                    setCallback={setLinkedPanelCallback}
                ></LinkedPanel>
            )}

            <MaUTable {...getTableProps()} classes={{ root: classes.tableBody }}>
                <TableHead classes={{ root: classes.tableHead }}>
                    {headerGroups.map((headerGroup: HeaderGroup<object>) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                //@ts-ignore -- TODO --getSortByToggleProps will be add to types in react-table v8
                                <TableHeaderCell key={column.id} column={column} />
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {page.map((row: any, i: any) => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map((cell: any) => {
                                    return (
                                        <TableCell
                                            size="small"
                                            {...cell.getCellProps()}
                                            className={cx({ [classes.tableCell]: true })}
                                        >
                                            {cell.render("Cell")}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </MaUTable>
        </CustomPanel>
    );
};
