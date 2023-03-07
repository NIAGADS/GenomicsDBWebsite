// modeled after https://github.com/ggascoigne/react-table-example

import React, { useEffect, useMemo, useState } from "react";
import { assign } from "lodash";

import Typography from "@material-ui/core/Typography";

import FilterListIcon from "@material-ui/icons/FilterList";

import {
    useTable,
    usePagination,
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce,
    useRowSelect,
    Column,
} from "react-table";

import useLocalStorage from "genomics-client/hooks/useLocalStorage";

import {
    fuzzyTextFilter,
    numericTextFilter,
    greaterThanFilter,
    lessThanFilter,
    includesFilter,
    includesAnyFilter,
    FilterGroup,
} from "@viz/Table/TableFilters";

import {
    Table,
    TableToolbar,
    ToggleColumnsPanel,
    FilterPanel,
    FilterChipBar,
    LinkedPanel,
} from "@viz/Table/TableSections";

import { useTableStyles } from "@viz/Table";

import { RowSelectCheckbox, RowSelectButton } from "@viz/Table/RowSelectors";

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

import { CustomPanel, NavigationDrawer } from "@components/MaterialUI";

interface LinkedPanelAction {
    action: any;
    type: "Button" | "Check";
    initialSelectRowId?: number; // can provide either
}

interface LinkedPanelOptions {
    label: string;
    contents: any;
    select: LinkedPanelAction;

}

export interface TableContainerProps {
    columns: Column<{}>[];
    title?: string;
    data: any;
    canFilter: boolean;
    canExport?: boolean;
    filterTypes?: any; // json object of filter types
    filterGroups?: FilterGroup[];
    className?: string;
    showAdvancedFilter?: boolean;
    showHideColumns?: boolean;
    requiredColumns?: string[];
    initialFilters?: any;
    initialSort?: any;
    linkedPanel?: LinkedPanelOptions;
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

export const TableContainer: React.FC<TableContainerProps> = ({
    columns,
    data,
    filterTypes,
    filterGroups,
    className,
    canFilter,
    showAdvancedFilter,
    showHideColumns,
    requiredColumns,
    initialFilters,
    initialSort,
    title,
    linkedPanel,
}) => {
    // Use the state and functions returned from useTable to build your UI
    //const instance = useTable({ columns, data }, ...hooks) as TableTypeWorkaround<T>;

    const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {});
    const [linkedPanelIsOpen, setlinkedPanelIsOpen] = useState(false);

    const hasLinkedPanel = linkedPanel !== null;
    const useRowSelect = hasLinkedPanel && linkedPanel.select !== null;

    const classes = useTableStyles();

    const defaultFilterTypes = {
        fuzzyText: useMemo(() => fuzzyTextFilter, []),
        numeric: useMemo(() => numericTextFilter, []),
        greater: useMemo(() => greaterThanFilter, []),
        select: useMemo(() => includesFilter, []),
        multi_select: useMemo(() => includesAnyFilter, []),
        typeahead_select: useMemo(() => includesAnyFilter, []),
        pie: useMemo(() => includesFilter, []),
        boolean_pie: useMemo(() => includesFilter, []),
        pvalue: useMemo(() => greaterThanFilter, []), // I think this is necessary as a placeholder
        greater_than_threshold: useMemo(() => greaterThanFilter, []),
        less_than_threshold: useMemo(() => lessThanFilter, []),
    };

    // add custom filterTypes into the default / overwrite defaults
    const tableFilterTypes = filterTypes ? assign({}, defaultFilterTypes, filterTypes) : defaultFilterTypes;

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

    const instance =
        useRowSelect
            ? useTable(
                  {
                      columns,
                      data,
                      initialState: {
                          // @ts-ignore -- TODO will be fixed in react-table v8 / basically @types/react-table is no longer being updated
                          pageIndex: 0,
                          pageSize: 10,
                          filters: [initialFilters ? initialFilters : {}],
                          sortBy: initialSort ? initialSort : [],
                          selectedRowIds: useRowSelect ? linkedPanel.select.initialSelectRowId : [],
                          hiddenColumns: columns
                              .filter((col: any) => col.show === false)
                              .map((col) => col.id || col.accessor) as any,
                      },
                      defaultCanFilter: false,
                      //@ts-ignore
                      defaultColumn: _defaultColumn,
                      globalFilter: "global" in tableFilterTypes ? "global" : "text", // text is the react-table default
                      filterTypes: tableFilterTypes,
                      sortTypes: sortingFunctions,
                  },
                  ...hooks
              )
            : useTable(
                  {
                      columns,
                      data,
                      initialState: {
                          // @ts-ignore -- TODO will be fixed in react-table v8 / basically @types/react-table is no longer being updated
                          pageIndex: 0,
                          pageSize: 10,
                          filters: [initialFilters ? initialFilters : {}],
                          sortBy: initialSort ? initialSort : [],
                          hiddenColumns: columns
                              .filter((col: any) => col.show === false)
                              .map((col) => col.id || col.accessor) as any,
                      },
                      defaultCanFilter: false,
                      //@ts-ignore
                      defaultColumn: _defaultColumn,
                      globalFilter: "global" in tableFilterTypes ? "global" : "text", // text is the react-table default
                      filterTypes: tableFilterTypes,
                      sortTypes: sortingFunctions,
                      getRowId: (row: any, index) => {
                          return "row_id" in row ? row.row_id : index;
                      },
                      stateReducer: (newState, action) => {
                          // allows only one row to be selected
                          if (action.type === "toggleRowSelected") {
                              //@ts-ignore
                              newState.selectedRowIds = {
                                  [action.id]: true,
                              };
                          }

                          return newState;
                      },
                      
                  },
                  ...hooks,
                  (hooks) => {
                    hooks.visibleColumns.push((columns: any) => [
                        // Let's make a column for selection
                        {
                            id: "selection",
                            width: 50,
                            sortable: false,
                            // The header can use the table's getToggleAllRowsSelectedProps method
                            // to render a checkbox
                            Header: `View in ${linkedPanel.label}`, 
                            // The cell can use the individual row's getToggleRowSelectedProps method
                            // to the render a checkbox
                            Cell: (cell: any) => (
                                <div>
                                    {linkedPanel.select.type == 'Check' ?
                                    <RowSelectCheckbox {...cell.row.getToggleRowSelectedProps()} />
                                    :
                                    <RowSelectButton {...cell.row.getToggleRowSelectedProps()} />
                                }
                                </div>
                            ),
                        },
                        ...columns,
                    ]);
                }
              );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        setFilter,
        setSortBy,
        preGlobalFilteredRows,
        preFilteredRows,
        setGlobalFilter,
        globalFilter,
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
        state: {selectedRowIds}, //: { pageIndex, pageSize },
        selectedFlatRows,
        state,
        toggleRowSelected,
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

    useEffect(() => {
        hasLinkedPanel && linkedPanel.select && linkedPanel.select.action(selectedRowIds);
    }, [selectedRowIds]);

    const _buildDrawerSections = () => {
        const sections: React.ReactNode[] = showHideColumns
            ? [<ToggleColumnsPanel instance={instance} requiredColumns={requiredColumns} />]
            : [];
        showAdvancedFilter && sections.push(<FilterPanel instance={instance} filterGroups={filterGroups} />);
        return sections;
    };

    const renderDrawerHeaderContents = (
        <>
            <Typography variant="h6" style={{ padding: "8px" }}>
                Modify table: <em className="red">{title}</em>
            </Typography>
        </>
    );

    const toggleLinkedPanel = (isOpen: boolean) => {
        setlinkedPanelIsOpen(isOpen);
    };

    // Render the UI for the table
    return (
        <CustomPanel justifyContent="flex-start">
            {hasLinkedPanel && <LinkedPanel isOpen={linkedPanelIsOpen}>{linkedPanel.contents}</LinkedPanel>}
            <NavigationDrawer
                navigation={
                    <TableToolbar
                        instance={instance}
                        canFilter={canFilter}
                        hasLinkedPanel={hasLinkedPanel}
                        linkedPanelOptions={{ toggle: toggleLinkedPanel, label: "LocusZoom" }}
                    />
                }
                toggleAnchor="left"
                toggleIcon={showAdvancedFilter || showHideColumns ? <FilterListIcon /> : null}
                toggleHelp="Select columns and advanced filters"
                toggleText="Modify Table"
                drawerSections={_buildDrawerSections()}
                drawerCloseLabel="Close"
                drawerHeaderContents={title ? renderDrawerHeaderContents : null}
                className={classes.navigationToolbar}
            >
                {canFilter && <FilterChipBar instance={instance} />}
            </NavigationDrawer>

            <Table className={className} instance={instance} />
        </CustomPanel>
    );
};
