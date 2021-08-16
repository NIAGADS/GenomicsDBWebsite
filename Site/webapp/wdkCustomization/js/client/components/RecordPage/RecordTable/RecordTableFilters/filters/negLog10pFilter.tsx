import { FilterValue, IdType, Row } from 'react-table'


export function invertNegLog10p(value: any) {
    if (value > 300) {
        return "1e-" + value.toString(); 
    }
    return Math.pow(10, -1 * parseFloat(value));
}

export function negLog10p (displayP: any) {
    let exponent = parseInt(displayP.toString().split("e-")[1]);
    if (exponent > 300) { return exponent; } // return exponent as approximate value
    return parseFloat((-1 * Math.log10(parseFloat(displayP))).toFixed(2));  
}

export function getMinMaxNegLog10PValue(rows: Row[], id: IdType<any>, upperLimit:number) {
    let min = rows.length ? negLog10p(rows[0].values[id]) : 0;
    let max = rows.length ? negLog10p(rows[0].values[id]) : 0;
    rows.forEach((row) => {
        let value = negLog10p(row.values[id]);
        min = Math.min(value, min);
        max = Math.max(value, max);
    });

    if (upperLimit && max > upperLimit) {
        max = upperLimit;
    }

    return [min, max];
};


// -log10 value filter
export function negLog10pFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue
): Array<Row<T>> {
    let fv = negLog10p(filterValue);
    return rows.filter((row) => {
        return negLog10p(row.values[id]) >= fv;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
negLog10pFilter.autoRemove = (val: any) => typeof val !== "number";





