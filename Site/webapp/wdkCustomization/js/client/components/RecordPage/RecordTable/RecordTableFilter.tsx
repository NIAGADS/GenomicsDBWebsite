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
export function filterNegLog10<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue
): Array<Row<T>> {
    return rows.filter((row) => {
        const rowValue = +row.values[id];
        let logValue = -1 * Math.log10(rowValue);
        return logValue >= filterValue;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterNegLog10.autoRemove = (val: any) => typeof val !== "number";


export function globalTextFilter(rows: Array<Row<any>>, ids: Array<IdType<any>>, filterValue: FilterValue) {
  rows = rows.filter((row) => {
    return ids.some(id => {
      const rowValue = row.values[id];
      return rowValue && extractDisplayText(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
    })
  });

  return rows;
}

// Let the table remove the filter if the string is empty
globalTextFilter.autoRemove = (val: any) => !val
