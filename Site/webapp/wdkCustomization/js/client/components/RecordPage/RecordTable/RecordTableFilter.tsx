// from https://github.com/ggascoigne/react-table-example

import { matchSorter } from 'match-sorter'
import { FilterValue, IdType, Row } from 'react-table'
import { extractDisplayText } from './RecordTableSort'

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

// -log10 value filter
export function filterNegLog10(rows: Array<Row<any>>, id: Array<IdType<any>>, filterValue: FilterValue) {
    return rows.filter((row) => {
        const rowValue = +row.values[id[0]];
        let logValue = -1 * Math.log10(rowValue);
        return logValue >= filterValue;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterNegLog10.autoRemove = (val: any) => typeof val !== "number";