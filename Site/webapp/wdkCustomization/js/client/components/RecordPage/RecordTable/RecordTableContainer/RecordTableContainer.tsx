import React from "react";
import * as rt from "../../types";
//@ts-ignore
import { CSVLink } from "react-csv";
import {
  pickBy,
  forIn,
  kebabCase,
  findIndex,
  cloneDeep,
  isEmpty
} from "lodash";
import NiagadsRecordTable from "../RecordTable/RecordTable";
import { extractDisplayText } from "../util";
import RecordTablePValFilter from "../RecordTablePValFilter/RecordTablePValFilter";

const INITIAL_STATE: rt.NiagadsTableStateProps = {
  pValueFilterVisible: false,
  filtered: [{ id: "all", value: "" }],
  filterVal: "",
  csvData: "",
  tableInstance: null,
  basket: []
};

const NiagadsTableContainer: React.ComponentClass<
  rt.IRecordTable,
  rt.NiagadsTableStateProps
> = class extends React.Component<rt.IRecordTable, rt.NiagadsTableStateProps> {
  constructor(props: rt.IRecordTable) {
    super(props);
    this.state = this.state = INITIAL_STATE;
  }

  componentDidMount = () => {
    if (this.props.table.properties.type[0] === "chart_filter") {
      this.setState({
        filtered: this.state.filtered.concat([{ id: "pvalue", value: 0 }])
      });
    }
  };

  getHasPValFilter = (table: rt.Table) =>
    this.state.tableInstance && table.properties.type[0] === "chart_filter";

  handleSearchFilterChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ filterVal: e.currentTarget.value });
    this.setState({ filtered: [{ id: "all", value: e.currentTarget.value }] });
  };

  handlePValFilterChange = (pLow: number) => {
    const newFiltered = this.state.filtered.map(filter => {
      if (filter.id === "pvalue") {
        return {
          id: "pvalue",
          value: pLow
        };
      }
      return filter;
    });
    this.setState({ filtered: newFiltered });
  };

  isSelected = (key: string) => this._getBasketIndex(key) > -1;

  onTableLoaded = (ref: any) => {
    if (!this.state.tableInstance && ref) {
      this.setState({ tableInstance: ref });
    }
  };
  toggleSelection = (
    key: string,
    shift: boolean,
    row: { [key: string]: any }
  ) => {
    let { basket } = this.state;
    const idx = this._getBasketIndex(key);
    idx > -1 ? basket.splice(idx, idx + 1) : basket.push(row);
    this.setState({ basket });
  };

  togglePValueChartVisibility = () =>
    this.setState({ pValueFilterVisible: !this.state.pValueFilterVisible });

  _getBasketIndex = (key: string) =>
    findIndex(this.state.basket, item => item.id === key);

  _loadCsvData = () => {
    /*todo: i don't think we need to store any of this on state...*/
    const data = this.state.tableInstance.getResolvedState().sortedData;
    if (!this.state.csvData) {
      const csvData = data.map((datum: any) => {
        const stripped = pickBy(datum, (v: any, k: string) => !/^_.+/.test(k));
        return forIn(
          stripped,
          (v: any, k: string, o: any) => (o[k] = extractDisplayText(v))
        );
      });
      this.setState({ csvData });
    }
  };

  render = () => {
    const { record, recordClass, table, value } = this.props,
      { attributes } = table;
    return (
      <div className="record-table-container">
        {!isEmpty(value) ? (
          <div className="record-table-inner-container">
            <div className="record-table-controls-container">
              <div className="main-controls">
                {this.state.tableInstance && (
                  <CSVLink
                    className="btn"
                    filename={`${kebabCase(table.displayName)}.csv`}
                    onClick={this._loadCsvData}
                    data={this.state.csvData}
                  >
                    Download (CSV)
                  </CSVLink>
                )}
                {this.state.pValueFilterVisible && (
                  <RecordTablePValFilter
                    key={table.name}
                    values={cloneDeep(value)}
                    onChange={this.handlePValFilterChange}
                    filtered={this.state.filtered}
                    selectClass={table.name + "_chart"}
                  />
                )}
                <div className="filters">
                  {this.getHasPValFilter(table) && (
                    <a
                      onClick={this.togglePValueChartVisibility}
                      className="btn"
                    >
                      P-value Filter
                    </a>
                  )}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="filter"
                    value={this.state.filterVal}
                    onChange={this.handleSearchFilterChange}
                  />
                </div>
              </div>
            </div>
            <NiagadsRecordTable
              table={table}
              value={value}
              attributes={attributes}
              filtered={this.state.filtered}
              onLoad={this.onTableLoaded}
              onSelectionToggled={this.toggleSelection}
              isSelected={this.isSelected}
            />
          </div>
        ) : (
          "None Reported"
        )}
      </div>
    );
  };
};

export default NiagadsTableContainer;
