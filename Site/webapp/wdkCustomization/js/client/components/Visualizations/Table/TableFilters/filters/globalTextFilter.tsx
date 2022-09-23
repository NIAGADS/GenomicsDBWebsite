import { FilterValue, IdType, Row } from 'react-table';
import { isString, get, isObject } from "lodash";

export const extractDisplayText = (value: any): any => {
  return isString(value) || !value
      ? value
      : get(value, "props.dangerouslySetInnerHTML.__html")
      ? value.props.dangerouslySetInnerHTML.__html
      : isObject(value) && (value as { displayText: string }).displayText
      ? (value as { displayText: string }).displayText
      : value.value
      ? value.value
      : value.props && value.props.children
      ? extractDisplayText(value.props.children)
      : "";
};

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
  