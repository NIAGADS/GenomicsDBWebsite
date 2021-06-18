import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect, Props } from "react";
import cx from "classnames";

import CssBaseline from "@material-ui/core/CssBaseline";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import {
    useTable,
    usePagination,
    useSortBy,
    HeaderGroup,
    useResizeColumns,
    useFlexLayout,
    useFilters,
} from "react-table";

import useDebounce from "../../../hooks/useDebounce";

import { CustomTableProps } from "./TableTypes";
import TablePagination from "./TablePagination";
import TableHeaderCell from "./TableHeaderCell";
import { DefaultColumnFilter } from "./TableFilters";

import { fuzzyTextFilter, numericTextFilter} from './filters';

import { useStyles } from "./TableStyles";

const hooks = [
    //useColumnOrder,
    useFilters,
    //useGroupBy,
    useSortBy,
    //useExpanded,
    useFlexLayout,
    usePagination,
    useResizeColumns,
    //useRowSelect,
    //selectionHook,
];

const filterTypes = {
    fuzzyText: fuzzyTextFilter,
    numeric: numericTextFilter,
  }

// fix to force table to always take full width of container
// https://stackoverflow.com/questions/64094137/how-to-resize-columns-with-react-table-hooks-with-a-specific-table-width
// https://spectrum.chat/react-table/general/v7-resizing-columns-no-longer-fit-to-width~4ea8a7c3-b21a-49a0-8582-baf0a6202d43
const _defaultColumn = React.useMemo(
    () => ({
        // When using the useFlexLayout:
        minWidth: 30, // minWidth is only used as a limit for resizing
        width: 150, // width is used for both the flex-basis and flex-grow
        maxWidth: 200, // maxWidth is only used as a limit for resizing
        Filter: DefaultColumnFilter,
        //Cell: TooltipCell,
        //Header: DefaultHeader,
    }),
    []
);

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, onClick }) => {
    // Use the state and functions returned from useTable to build your UI
    //const instance = useTable({ columns, data }, ...hooks) as TableTypeWorkaround<T>;
    const classes = useStyles();

    const instance = useTable(
        {
            columns,
            data,
            // @ts-ignore -- TODO will be fixed in react-table v8 / basically @types/react-table is no longer being updated
            initialState: { pageIndex: 0, pageSize: 10 },
            //@ts-ignore
            defaultColumn: _defaultColumn,
            filterTypes,
        },
        ...hooks
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
        state: { pageIndex, pageSize },
    } = instance;

    // Render the UI for your table
    return (
        <>
            <Grid container direction="column">
                <Grid item>
                    <TablePagination instance={instance} />
                </Grid>

                <Grid item>
                    <MaUTable {...getTableProps()}>
                        <TableHead>
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
                </Grid>
            </Grid>
        </>
    );
};

export default CustomTable;
