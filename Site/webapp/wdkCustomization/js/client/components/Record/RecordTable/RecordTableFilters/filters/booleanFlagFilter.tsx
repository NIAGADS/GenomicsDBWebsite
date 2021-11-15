import { FilterValue, IdType, Row } from 'react-table'

// -log10 value filter
export function booleanFlagFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue
): Array<Row<T>> {
    return rows.filter((row) => {
        const rowValue = row.values[id] ? "Yes" : "No";
        return rowValue === filterValue;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's empty
booleanFlagFilter.autoRemove = (val: any) => !val





