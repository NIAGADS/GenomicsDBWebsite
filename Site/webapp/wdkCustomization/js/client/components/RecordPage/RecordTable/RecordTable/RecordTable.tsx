import React, { useEffect, useRef } from "react";
//@ts-ignore
import SelectTableHOC, {
  SelectTableAdditionalProps
} from "react-table/lib/hoc/selectTable";
import ReactTable, {
  AccessorFunction,
  Instance,
  RowInfo,
  Filter,
  Column,
  TableProps
} from "react-table";
import { isString, isObject, findIndex, uniqueId, forIn } from "lodash";
import { scientificToDecimal } from "../../../../util/util";
import {
  isJson,
  resolveObjectInput,
  withTooltip
} from "../../../../util/jsonParse";
import { extractDisplayText } from "../util";
import CssBarChart from "./CssBarChart/CssBarChart";
import * as rt from "../../types";
import PaginationComponent from "./PaginationComponent/PaginationComponent";
import { toString } from "lodash";

const SelectTable = SelectTableHOC(ReactTable);

interface NiagadsRecordTable {
  table: rt.Table;
  value: { [key: string]: any }[];
  attributes: rt.TableAttribute[];
  filtered: Filter[];
  onLoad: (ref: React.MutableRefObject<Instance>) => void;
  onSelectionToggled: any;
  isSelected: any;
}

const NiagadsRecordTable: React.FC<NiagadsRecordTable> = ({
  attributes,
  filtered,
  isSelected,
  onLoad,
  onSelectionToggled,
  table,
  value
}) => {
  
  const instance = useRef<Instance>();

  useEffect(() => {
    onLoad(instance);
  }, []);

  const subCompKey = table.properties.subtable_field
      ? table.properties.subtable_field[0]
      : null,
    columns: Column[] =
      value.length === 0
        ? []
        : Object.keys(value[0])
            .filter(k => {
              const attribute: rt.TableAttribute = attributes.find(
                item => item.name === k
              );
              return attribute && attribute.isDisplayable;
            })
            .map(
              (k): Column => {
                const attribute = attributes.find(
                    attribute => attribute.name === k
                  ),
                  filterType =
                    table.properties.type[0] === "chart_filter" &&
                    table.properties.filter_field[0] === attribute.name
                      ? pValFilter
                      : (filter: any, rows: any) => rows;
                return k === subCompKey
                  ? {
                      expander: true,
                      Header: () => <span>{attribute.displayName}</span>,
                      id: attribute.name,
                      sortable: false,
                      Expander: ({ original, isExpanded }) => {
                        const iconClass = isExpanded
                          ? "fa fa-caret-up"
                          : "fa fa-caret-down";
                        return (
                          <span>
                            <a className="action-element">
                              {original[k].value}
                            </a>
                            &nbsp;
                            <span className={iconClass} />
                          </span>
                        );
                      }
                    }
                  : _buildColumn(attribute, filterType);
              }
            )
            .sort((c1, c2) => _indexSort(c1, c2, attributes));

  columns.push(hiddenFilterCol);

  //for selectTable
  const _setKeyCol = (values: { [key: string]: any }[]) => {
    return values.map(row => Object.assign(row, { id: uniqueId() }));
  };

  //todo: merge into header code above once stable, so we can call the same function
  const subComponent = subCompKey
    ? {
        SubComponent: (rowInfo: RowInfo) => {
          const row = rowInfo.original[subCompKey],
            columns = Object.keys(row.data[0])
              .map(
                (k): Column => {
                  const attribute = row.attributes.find(
                    (attr: rt.TableAttribute) => attr.name === k
                  );
                  return _buildColumn(attribute);
                }
              )
              .sort((col1, col2) => _indexSort(col1, col2, row.attributes));
          return (
            <ReactTable
              columns={columns}
              data={row.data}
              minRows={0}
              showPagination={false}
              className="sub-table"
              resolveData={resolveData}
            />
          );
        }
      }
    : {};

  const tableProps = {
    columns,
    data: _setKeyCol(value),
    minRows: 0,
    filtered,
    defaultSortMethod: NiagadsTableSort,
    onLoad,
    showPagination: value.length > 20,
    resizable: true,
    expanderDefaults: { width: 200 },
    resolveData,
    PaginationComponent,
    ...subComponent
  };

  const selectTableProps = {
    isSelected: isSelected,
    toggleSelection: onSelectionToggled
  };

  return (
    <div className="record-table">
      {true ? (
        <ReactTable {...tableProps} ref={instance} />
      ) : (
        <NiagadsSelectTable {...tableProps} {...selectTableProps} />
      )}
    </div>
  );
};

interface NiagadsSelectTable extends Partial<TableProps> {
  onLoad: any;
}

interface tProps
  extends NiagadsSelectTable,
    Partial<SelectTableAdditionalProps> {}

const NiagadsSelectTable: React.ComponentClass<NiagadsSelectTable> = class extends React.Component<
  NiagadsSelectTable
> {
  private tProps: tProps;
  private wrapper: any;

  constructor(props: NiagadsSelectTable) {
    super(props);
    this.tProps = {
      ...this.props,
      ...{
        keyField: "id",
        selectAll: false,
        toggleAll: () => console.log("all toggled"),
        selectType: "checkbox"
      }
    };
  }

  componentDidMount = () => {
    this.props.onLoad(this.wrapper.getWrappedInstance());
  };

  render = () => (
    <SelectTable {...this.tProps} ref={(r: any) => (this.wrapper = r)} />
  );
};

/*todo: move and update once record data structure is stablized*/
const NiagadsTableSort = (a: string, b: string, desc: boolean) => {
  let c = extractDisplayText(a),
    d = extractDisplayText(b);
  (c = c === null || c === undefined ? -Infinity : c),
    (d = d === null || d === undefined ? -Infinity : d);
  c = scientificToDecimal(c);
  d = scientificToDecimal(d);
  c = isString(c) ? c.toLowerCase() : c;
  d = isString(d) ? d.toLowerCase() : d;
  if (c > d) {
    return 1;
  }
  if (c < d) {
    return -1;
  }
  return 0;
};

const SortIconGroup: React.SFC = () => (
  <span className="sort-icons">
    <i className="icon-asc fa fa-sort-asc"></i>
    <i className="icon-desc fa fa-sort-desc"></i>
    <i className="icon-inactive fa fa-sort"></i>
  </span>
);

const hiddenFilterCol = {
  Header: () => <span />,
  id: "all",
  width: 0,
  resizable: false,
  sortable: false,
  Filter: (): null => null,
  filterMethod: (filter: Filter, rows: any[]) => {
    //https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
    const re = new RegExp(
      filter.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "i"
    );
    return rows.filter(row => {
      const rowString = Object.entries(row)
        //filter out falsey vals and internal react-table properties marked by leading _
        .filter(([k, v]) => !(!v || /^_.+/.test(k)))
        .map(([_, v]: any) => extractDisplayText(v))
        .join("");
      return re.test(rowString);
    });
  },
  filterAll: true
};

const pValFilter = (filter: Filter, row: any) => {
  const exponent = Math.abs(
    (toString(row.pvalue).split("e")[1] as unknown) as number
  );
  return exponent >= filter.value;
};

const resolveAccessor = (
  key: string,
  attribute: rt.TableAttribute
): AccessorFunction => {
  switch (attribute.type) {
    case "string":
      return (row: { [key: string]: any }) => {
        if (isObject(row[key])) {
          return resolveObjectInput(row[key]);
        } else return row[key];
      };
      break;
    case "integer":
    case "boolean":
    case "numeric":
      return (row: any) => row[key];
    //if table, we want to convert it back to json and let the subtable handler take care of it
    case "json_table":
      return (row: any) => JSON.stringify(row[key]);
    case "percentage_bar":
      return (row: any) => (
        <CssBarChart original={row[key]} pctFull={row[key] * 100} />
      );
    case "json_link":
    case "json_icon":
    case "json_text":
    case "json_text_or_link":
    case "json_dictionary":
      //idea is that resolveData() has already parsed all json, here we just resolve the component through the accessor
      return (row: { [key: string]: any }) => resolveObjectInput(row[key]);
      break;
  }
  throw new Error(
    `I'm JSON of type ${attribute.type} and no one will parse me`
  );
};

const resolveData = (
  data: { [key: string]: any }[]
): { [key: string]: any }[] => {
  return data.map(datum => {
    return forIn(
      datum,
      (v: string, k: React.ReactText, o: { [x: string]: any }) => {
        if (isJson(v)) {
          o[k] = JSON.parse(v);
        }
      }
    );
  });
};

const _buildColumn = (attribute: rt.TableAttribute, filterType?: any) => ({
  Header: _buildHeader(attribute),
  sortable: false,
  accessor: resolveAccessor(attribute.name, attribute),
  id: attribute.name,
  filterMethod: filterType ? filterType : (filter: any, rows: any) => rows
});

const _buildHeader = (attribute: rt.TableAttribute) => {
  return (
    <>
      <span className="header-container">
        <span className="header-left-side">
          <span className="header-display-name">{attribute.displayName}</span>
          {attribute.help
            ? withTooltip(
                <span className="header-help fa fa-question-circle-o" />,
                attribute.help,
                "header-help"
              )
            : null}
        </span>
        {attribute.isSortable && <SortIconGroup />}
      </span>
    </>
  );
};

const _indexSort = (
  col1: Column,
  col2: Column,
  attributes: rt.TableAttribute[]
) => {
  const idx1 = findIndex(attributes, att => att.name === col1.id),
    idx2 = findIndex(attributes, att => att.name === col2.id);
  return idx2 > idx1 ? -1 : 1;
};

export default NiagadsRecordTable;
