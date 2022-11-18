// from https://github.com/ggascoigne/react-table-example

import { matchSorter } from 'match-sorter'
import { FilterValue, IdType, Row } from 'react-table'
import { parseFieldValue } from '@viz/Table'

export function fuzzyTextFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue
): Array<Row<T>> {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row<T>) => parseFieldValue(row.values[id])],
  })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilter.autoRemove = (val: any) => !val
