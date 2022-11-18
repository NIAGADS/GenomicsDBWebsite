// modified from https://github.com/ggascoigne/react-table-example

import { TablePagination as _MuiTablePagination } from '@material-ui/core'
import React, { PropsWithChildren, ReactElement, useCallback } from 'react'
import { TableInstance,  UsePaginationOptions } from 'react-table';

import { useTableStyles } from '@viz/Table'

const rowsPerPageOptions = [10, 20, 50, { label: 'All', value: -1 }]

// avoid all of the redraws caused by the internal withStyles
const interestingPropsEqual = (prevProps: any, nextProps: any) =>
  prevProps.count === nextProps.count &&
  prevProps.rowsPerPage === nextProps.rowsPerPage &&
  prevProps.page === nextProps.page &&
  prevProps.onPageChange === nextProps.onPageChange &&
  prevProps.onRowsPerPageChange === nextProps.onRowsPerPageChange


// a bit of a type hack to keep OverridableComponent working as desired
type T = typeof _MuiTablePagination
const MuiTablePagination: T = React.memo(_MuiTablePagination, interestingPropsEqual) as T

export function TablePagination<T extends Record<string, unknown>>({
  instance,
}: PropsWithChildren<{ instance: TableInstance<T> }>): ReactElement | null {
  const {
    // @ts-ignore -- again @types/react-table not up-to-date
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    // @ts-ignore
    gotoPage, nextPage, previousPage, setPageSize,
  } = instance

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage()
      } else if (newPage === pageIndex - 1) {
        previousPage()
      } else {
        gotoPage(newPage)
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage]
  )

  const onRowsPerPageChange = useCallback(
    (e) => {
      setPageSize(Number(e.target.value))
    },
    [setPageSize]
  )

  const classes = useTableStyles();

  return rowCount ? (
    //@ts-ignore -- versioning issue
    <MuiTablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component='div'
      className={classes.pagination}
      count={rowCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      onPageChange={handleChangePage}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  ) : null
}
