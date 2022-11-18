import { FilterValue, IdType, Row } from "react-table";
import { parseFieldValue } from "@viz/Table";

export function includesFilter<T extends Record<string, unknown>>(
    rows: Array<Row<T>>,
    id: IdType<T>,
    filterValue: FilterValue
): Array<Row<T>> {
    return rows.filter((row) => {
        const rowValue = parseFieldValue(row.values[id[0]]);
        return rowValue && rowValue.includes(filterValue);
    });
}


// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
includesFilter.autoRemove = (val: any) => !val || !val.length;

