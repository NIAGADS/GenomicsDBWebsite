import { FilterValue, IdType, Row } from 'react-table'

export function negLog10p (displayP: string) {
  let exponent = parseInt(displayP.split("e-")[1]);
  if (exponent > 300) { return exponent; } // return exponent as approximate value

  return (-1 * Math.log10(parseFloat(displayP)));
}



// -log10 value filter
export function negLog10pFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue
): Array<Row<T>> {
    return rows.filter((row) => {
        const rowValue = row.values[id];
        let logValue = negLog10p(rowValue);
        return logValue >= negLog10p(filterValue);
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
negLog10pFilter.autoRemove = (val: any) => typeof val !== "number";





