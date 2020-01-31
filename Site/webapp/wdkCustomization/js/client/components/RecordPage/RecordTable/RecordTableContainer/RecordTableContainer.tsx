import React, { useState, useEffect } from "react";
import * as rt from "../../types";
//@ts-ignore
import { CSVLink } from "react-csv";
import {
  cloneDeep,
  findIndex,
  forIn,
  get,
  isEmpty,
  kebabCase,
  pickBy
} from "lodash";
import NiagadsRecordTable from "../RecordTable/RecordTable";
import { extractDisplayText } from "../util";
import RecordTablePValFilter from "../RecordTablePValFilter/RecordTablePValFilter";
import { Instance } from "react-table";

const NiagadsTableContainer: React.FC<rt.IRecordTable> = ({ table, value }) => {
  const defaultPVal = 8;

  const [filtered, setFiltered] = useState([{ id: "all", value: "" as any }]),
    [tableInstance, setTableInstance] = useState<Instance>(),
    [filterVal, setFilterVal] = useState(""),
    [basket, setBasket] = useState([]),
    [pValueFilterVisible, setPValueFilterVisible] = useState(false),
    [csvData, setCsvData] = useState<any[]>([]);

  useEffect(() => {
    if (table.properties.type[0] === "chart_filter") {
      _setFiltered("pvalue", defaultPVal);
    }
  }, []);

  const getHasPValFilter = (table: rt.Table) =>
    tableInstance && table.properties.type[0] === "chart_filter";

  const _setFiltered = (id: string, value: any) =>
    setFiltered(
      filtered
        .filter(fil => (fil.id === id ? false : true))
        .concat([{ id, value }])
    );

  const handleSearchFilterChange = (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    setFilterVal(e.currentTarget.value);
    _setFiltered("all", e.currentTarget.value);
  };

  const handlePValFilterChange = (pLow: number) => _setFiltered("pvalue", pLow);

  const isSelected = (key: string) => _getBasketIndex(key) > -1;

  const onTableLoaded = (ref: React.MutableRefObject<Instance>) => {
    if (!tableInstance && ref.current) {
      setTableInstance(ref.current);
    }
  };

  const toggleSelection = (
    key: string,
    shift: boolean,
    row: { [key: string]: any }
  ) => {
    const idx = _getBasketIndex(key);
    idx > -1 ? basket.splice(idx, idx + 1) : basket.push(row);
    setBasket(basket);
  };

  const togglePValueChartVisibility = () =>
    setPValueFilterVisible(!pValueFilterVisible);

  const _getBasketIndex = (key: string) =>
    findIndex(basket, item => item.id === key);

  const _loadCsvData = () => {
    /*todo: i don't think we need to store any of this on state...*/
    const data = tableInstance.getResolvedState().sortedData;
    if (!csvData) {
      const csvData = data.map((datum: any) => {
        const stripped = pickBy(datum, (v: any, k: string) => !/^_.+/.test(k));
        return forIn(
          stripped,
          (v: any, k: string, o: any) => (o[k] = extractDisplayText(v))
        );
      });
      setCsvData(csvData);
    }
  };

  const { attributes } = table;

  return (
    <div className="record-table-container">
      {!isEmpty(value) ? (
        <div className="record-table-inner-container">
          <div className="record-table-controls-container">
            <div className="main-controls">
              {tableInstance && (
                <CSVLink
                  className="control"
                  filename={`${kebabCase(table.displayName)}.csv`}
                  onClick={_loadCsvData}
                  data={csvData}
                >
                  <span className="fa fa-2x p-1 fa-download" />
                </CSVLink>
              )}
              {pValueFilterVisible && (
                <RecordTablePValFilter
                  key={table.name}
                  values={cloneDeep(value)}
                  onChange={handlePValFilterChange}
                  filtered={filtered}
                  selectClass={table.name + "_chart"}
                  defaultPVal={defaultPVal}
                />
              )}
              <div className="filters control">
                {getHasPValFilter(table) && (
                  <a
                    onClick={togglePValueChartVisibility}
                    className="btn filter"
                  >
                    {pValueFilterVisible
                      ? "Close P-value Filter"
                      : "Open P-value Filter"}
                  </a>
                )}
                <input
                  type="text"
                  className="filter"
                  placeholder="filter"
                  value={filterVal}
                  onChange={handleSearchFilterChange}
                />
              </div>
            </div>
          </div>
          {/* based on get(table, 'properties.canShrink[0]'), remove flex-grow: 1 from .ReactTable */}
          <NiagadsRecordTable
            table={table}
            value={value}
            attributes={attributes}
            filtered={filtered}
            onLoad={onTableLoaded}
            onSelectionToggled={toggleSelection}
            isSelected={isSelected}
            canShrink={get(table, "properties.canShrink[0]", false)}
          />
        </div>
      ) : (
        "None Reported"
      )}
    </div>
  );
};

export default NiagadsTableContainer;
