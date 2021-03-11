import React, { useEffect, useRef } from "react";
//@ts-ignore
import ReactTable, { AccessorFunction, Instance, RowInfo, Filter, Column } from "react-table";
import { isString, isObject, findIndex, forIn } from "lodash";
import { isJson, resolveObjectInput, withTooltip } from "../../../../util/jsonParse";
import { extractDisplayText } from "../util";
import CssBarChart from "./CssBarChart/CssBarChart";
import * as rt from "../../types";
import PaginationComponent from "./PaginationComponent/PaginationComponent";

interface NiagadsRecordTable {
    attributes: rt.TableAttribute[];
    canShrink?: boolean;
    chartProperties?: any;
    filtered: Filter[];
    onLoad: (ref: React.MutableRefObject<Instance>) => void;
    stringFilterMethod: (val: string, rows: any[]) => any[];
    table: rt.Table;
    value: { [key: string]: any }[];
    visible?: boolean;
}

const NiagadsRecordTable: React.FC<NiagadsRecordTable> = ({
    attributes,
    canShrink,
    chartProperties,
    filtered,
    onLoad,
    stringFilterMethod,
    table,
    value,
    visible,
}) => {
    const instance = useRef<Instance>();

    useEffect(() => {
        onLoad(instance);
    }, [onLoad]);

    const hiddenFilterCol = {
        Header: () => <span />,
        id: "all",
        width: 0,
        resizable: false,
        sortable: false,
        Filter: (): null => null,
        filterMethod: (filter: Filter, rows: any[]) => stringFilterMethod(filter.value, rows),
        filterAll: true,
    };

    const subCompKey = table.properties.subtable_field ? table.properties.subtable_field[0] : null,
        columns: Column[] =
            value.length === 0
                ? []
                : Object.keys(value[0])
                      .filter((k) => {
                          const attribute: rt.TableAttribute = attributes.find((item) => item.name === k);
                          return attribute && attribute.isDisplayable;
                      })
                      .map(
                          (k): Column => {
                              const attribute = attributes.find((attribute) => attribute.name === k),
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
                                            const iconClass = isExpanded ? "fa fa-caret-up" : "fa fa-caret-down";
                                            return (
                                                <span>
                                                    <a className="action-element">{original[k].value}</a>
                                                    &nbsp;
                                                    <span className={iconClass} />
                                                </span>
                                            );
                                        },
                                    }
                                  : _buildColumn(attribute, attribute.isSortable, filterType);
                          }
                      )
                      .sort((c1, c2) => _indexSort(c1, c2, attributes));

    columns.push(hiddenFilterCol);

    const subComponent = subCompKey
        ? {
              SubComponent: (rowInfo: RowInfo) => {
                  const row = rowInfo.original[subCompKey],
                      columns = Object.keys(row.data[0])
                          .map(
                              (k): Column => {
                                  const attribute = row.attributes.find((attr: rt.TableAttribute) => attr.name === k);
                                  return _buildColumn(attribute, false);
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
              },
          }
        : {};

    const tableProps = {
        chartProperties,
        className: canShrink ? "shrink" : "",
        columns,
        data: value,
        defaultSortMethod: NiagadsTableSort,
        expanderDefaults: { width: 200 },
        filtered,
        minRows: 0,
        onLoad,
        PaginationComponent,
        resizable: true,
        resolveData,
        showPagination: true,
        style: { display: visible ? "inherit" : "none" },
        ...subComponent,
    };

    return <ReactTable {...tableProps} ref={instance} />;
};

const NiagadsTableSort = (a: string, b: string) => {
    let c = extractDisplayText(a),
        d = extractDisplayText(b);
    (c = c === null || c === undefined ? -Infinity : c), (d = d === null || d === undefined ? -Infinity : d);
    //sci string to num
    c = /\d\.\d+e-\d+/.test(c) ? +c : c;
    d = /\d\.\d+e-\d+/.test(d) ? +d : d;
    c = isString(c) ? c.replace(/:/g, "").toLowerCase() : c;
    d = isString(d) ? d.replace(/:/g, "").toLowerCase() : d;
    if (c > d) {
        return 1;
    }
    if (c < d) {
        return -1;
    }
    return 0;
};

const SortIconGroup: React.FC = () => (
    <span className="sort-icons">
        <i className="icon-asc fa fa-sort-asc"></i>
        <i className="icon-desc fa fa-sort-desc"></i>
        <i className="icon-inactive fa fa-sort"></i>
    </span>
);

const pValFilter = (filter: Filter, row: any) => +row.pvalue <= +filter.value;

const resolveAccessor = (key: string, attribute: rt.TableAttribute): AccessorFunction => {
    switch (attribute.type) {
        case "string":
        case "json_text":
            return (row: { [key: string]: any }) => (isObject(row[key]) ? resolveObjectInput(row[key]) : row[key]);
        case "integer":
        case "boolean":
        case "numeric":
            return (row: any) => row[key];
        //if table, we want to convert it back to json and let the subtable handler take care of it
        case "json_table":
            return (row: any) => JSON.stringify(row[key]);
        case "percentage_bar":
            return (row: any) => <CssBarChart original={row[key]} pctFull={row[key] * 100} />;
        case "json_link":
        case "json_icon":
        case "json_text_or_link":
        case "json_dictionary":
            //idea is that resolveData() has already parsed all json, here we just resolve the component through the accessor
            return (row: { [key: string]: any }) => resolveObjectInput(row[key]);
    }
    throw new Error(`I'm JSON of type ${attribute.type} and no one will parse me`);
};

const resolveData = (data: { [key: string]: any }[]): { [key: string]: any }[] => {
    return data.map((datum) => {
        return forIn(datum, (v: string, k: string, o: { [x: string]: any }) => {
            if (isJson(v)) {
                o[k] = JSON.parse(v);
            }
        });
    });
};

const _buildColumn = (attribute: rt.TableAttribute, sortable: boolean, filterType?: any) => ({
    Header: _buildHeader(attribute),
    sortable,
    accessor: resolveAccessor(attribute.name, attribute),
    id: attribute.name,
    //maxWidth: 100,
    filterMethod: filterType ? filterType : (filter: any, rows: any) => rows,
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

const _indexSort = (col1: Column, col2: Column, attributes: rt.TableAttribute[]) => {
    const idx1 = findIndex(attributes, (att) => att.name === col1.id),
        idx2 = findIndex(attributes, (att) => att.name === col2.id);
    return idx2 > idx1 ? -1 : 1;
};

export default NiagadsRecordTable;
