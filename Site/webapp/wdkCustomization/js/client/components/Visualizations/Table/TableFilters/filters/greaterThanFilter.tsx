import { FilterValue, IdType, Row } from 'react-table'


export function greaterThanFilter(rows: Array<Row<any>>, id: Array<IdType<any>>, filterValue: FilterValue) {
    return rows.filter((row) => {
        const rowValue = row.values[id[0]];
        return rowValue >= filterValue;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
greaterThanFilter.autoRemove = (val: any) => typeof val !== "number";

export function lessThanFilter(rows: Array<Row<any>>, id: Array<IdType<any>>, filterValue: FilterValue) {
    return rows.filter((row) => {
        const rowValue = row.values[id[0]];
        return rowValue <= filterValue;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
lessThanFilter.autoRemove = (val: any) => typeof val !== "number";