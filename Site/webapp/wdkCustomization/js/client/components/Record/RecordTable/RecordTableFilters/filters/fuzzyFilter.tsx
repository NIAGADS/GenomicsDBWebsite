// after from https://github.com/ggascoigne/react-table-example

import { matchSorter } from 'match-sorter'
import { FilterValue, IdType, Row } from 'react-table'
import { extractDisplayText } from '../../RecordTableSort'

export function fuzzyRecordTableTextFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue
): Array<Row<T>> {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row<T>) => extractDisplayText(row.values[id])],
  })
}

// Let the table remove the filter if the string is empty
fuzzyRecordTableTextFilter.autoRemove = (val: any) => !val
