import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect } from "react";

import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'

import { useTable, usePagination, Column, Row, TableInstance, TableOptions } from 'react-table'

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
]


export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
  name: string
  onClick?: (row: Row<T>) => void
}

/* export interface CustomTableProps {
    columns: Column<{}>[];
    data: any;
} */

export const SortIconGroup: React.FC = () => (
  <span className="sort-icons">
      <i className="icon-asc fa fa-sort-asc"></i>
      <i className="icon-desc fa fa-sort-desc"></i>
      <i className="icon-inactive fa fa-sort"></i>
  </span>
);

export function CustomTable<T extends Record<string, unknown>>(props: PropsWithChildren<TableProperties<T>>): ReactElement {
  const { name, columns, onClick } = props

  const instance = useTable(
    { 
      ...props,
      columns,
      //filterTypes,
      //defaultColumn,
      //initialState,
    }, ...hooks)
  
  const { getTableProps, headerGroups, getTableBodyProps, rows, page, prepareRow, state } = instance;

  // Render the UI for your table
  return (
    <>
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </MaUTable>
    <TablePagination<T> instance={instance} />
    </>
  )
}

export default CustomTable;