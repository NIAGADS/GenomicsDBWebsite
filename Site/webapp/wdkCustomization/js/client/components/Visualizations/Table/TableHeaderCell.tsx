//@ts-nocheck -- @types/react-table out of date / to be fixed in react-table v8
import React from "react";
import { Column } from "react-table";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import cx from 'classnames';

import { useTableStyles } from '.'

interface TableHeaderCellProps {
    column: Column;
}

const ResizeHandle: React.FC<TableHeaderCellProps> = ({ column }) =>  {
  const classes = useTableStyles()
  return (
    <div
      {...column.getResizerProps()}
      style={{ cursor: 'col-resize' }} // override the useResizeColumns default
      className={cx({
        [classes.resizeHandle]: true,
        handleActive: column.isResizing,
      })}
    />
  )
}

export const BaseTableHeaderCell: React.FC<TableHeaderCellProps> = ({ column }) => {
    return (
        <>
            {column.render("Header")}
        </>
    );
};

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ column }) => {
    const classes = useStyles();
    return column.canSort ? (
        <TableCell {...column.getHeaderProps()} className={cx({[classes.tableHeadCell]: true})}>
            <TableSortLabel
                //@ts-ignore --react-table
                active={column.isSorted}
                //@ts-ignore --react-table
                direction={column.isSortedDesc ? "desc" : "asc"}
                //@ts-ignore --react-table
                {...column.getSortByToggleProps()}
                //className={classes.tableSortLabel}
                //style={style}
            >
                <BaseTableHeaderCell column={column} />
            </TableSortLabel>
            {column.canResize && <ResizeHandle column={column}/>}
        </TableCell>
    ) : (
        <TableCell {...column.getHeaderProps()} className={cx({[classes.tableHeadCell]: true})}>
            <BaseTableHeaderCell column={column} />
            {column.canResize && <ResizeHandle column={column}/>}
        </TableCell>
    );
};

