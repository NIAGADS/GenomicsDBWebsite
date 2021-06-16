import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect, Props } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";

import { useTable, usePagination, Column, Row, HeaderGroup } from "react-table";

import { CustomTableProps } from "./TableTypes";
import TablePagination from "./TablePagination";

const hooks = [
    //useColumnOrder,
    //useFilters,
    //useGroupBy,
    //useSortBy,
    //useExpanded,
    //useFlexLayout,
    usePagination,
    //useResizeColumns,
    //useRowSelect,
    //selectionHook,
];

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, onClick }) => {
    // Use the state and functions returned from useTable to build your UI
    //const instance = useTable({ columns, data }, ...hooks) as TableTypeWorkaround<T>;

    const instance = useTable(
        {
            columns,
            data,
            // @ts-ignore -- TODO will be fixed in react-table v8 / basically @types/react-table is no longer being updated
            initialState: { pageIndex: 0, pageSize: 20 },
        },
        ...hooks
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
        /* canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize, */
        state: { pageIndex, pageSize },
    } = instance;

    // Render the UI for your table
    return (
        <>
            <Grid item container direction="row">
                <Grid item>
                    <MaUTable {...getTableProps()}>
                        <TableHead>
                            {headerGroups.map((headerGroup: HeaderGroup<object>) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <TableCell {...column.getHeaderProps()}>{column.render("Header")}</TableCell>
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
                                                <TableCell size="small" {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </MaUTable>
                </Grid>
                <Grid item>
                    <TablePagination instance={instance} />
                </Grid>
            </Grid>
        </>
    );
};

export default CustomTable;
