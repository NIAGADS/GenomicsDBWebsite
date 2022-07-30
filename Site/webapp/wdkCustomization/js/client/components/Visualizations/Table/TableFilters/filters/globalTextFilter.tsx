import {isValidElement} from 'react';
import { FilterValue, IdType, Row } from 'react-table'

export function globalTextFilter(rows: Array<Row<any>>, ids: Array<IdType<any>>, filterValue: FilterValue) {
    rows = rows.filter((row) => {
      return ids.some(id => {
        const rowValue = row.values[id];
        if (rowValue)  {
          if (isValidElement(rowValue[0])) { // check box/select 
            rowValue.shift();
          }
          return rowValue && rowValue.toLowerCase().includes(String(filterValue).toLowerCase());
        }
      })
    });
  
    return rows;
  }
  
  // Let the table remove the filter if the string is empty
  globalTextFilter.autoRemove = (val: any) => !val
  