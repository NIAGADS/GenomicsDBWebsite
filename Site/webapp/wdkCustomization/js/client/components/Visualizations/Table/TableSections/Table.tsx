// modeled after https://github.com/ggascoigne/react-table-example
import React from "react";
import cx from "classnames";

import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";

import { HeaderGroup, Column, TableInstance } from "react-table";

import { useTableStyles, TableProps } from "@viz/Table";
import { TableHeaderCell } from "@viz/Table/TableSections";

import { InfoAlert } from "@components/MaterialUI";


export const Table: React.FC<TableProps> = ({ instance, className }) => {
    const classes = useTableStyles();
    const {
        getTableProps,
        headerGroups,
        prepareRow,
        //@ts-ignore
        preFilteredRows,
        data,
        //@ts-ignore
        page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
    } = instance;

    return preFilteredRows.length === 0 || page.length === 0 ? (
        <Box className={className ? className : null}>
            <InfoAlert
                title="No rows meet the selected search or filter criteria."
                message={`Unfiltered table contains ${data.length} rows. Remove or adjust filter criteria to view.`}
            />
        </Box>
    ) : (
        <Box className={className ? className : null}>
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
        </Box>
    );
};

//export default withStyles(drawerPanelStyles, { withTheme: true })(Table);
