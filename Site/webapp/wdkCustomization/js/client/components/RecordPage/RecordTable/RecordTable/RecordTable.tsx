import React from "react";

import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'

import { useTable, Column } from 'react-table'

import * as rt from "../../types";

export interface CustomRecordTableProps {
    columns: Column<any>[];
    data: any;
}
interface NiagadsRecordTable {
    attributes: rt.TableAttribute[];
    table: rt.Table;
    data: { [key: string]: any }[];
}


const CustomRecordTable: React.FC<CustomRecordTableProps> = ({columns, data})  => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
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
  )
}


const _buildColumn = (attribute: rt.TableAttribute, sortable: boolean, filterType?: any) => ({
    Header: _buildHeader(attribute),
    sortable,
    accessor: resolveAccessor(attribute.name, attribute),
    id: attribute.name,
    filterMethod: filterType ? filterType : (filter: any, rows: any) => rows,
});

const _buildHeader = (attribute: rt.TableAttribute) => {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
                <Box overflow="hidden" textOverflow="ellipsis" paddingRight="2px">
                    {attribute.displayName}
                </Box>
                {attribute.help ? withTooltip(<span className="fa fa-question-circle-o" />, attribute.help) : null}
            </Box>
            {attribute.isSortable && <SortIconGroup />}
        </Box>
    );
};

export default CustomRecordTable;