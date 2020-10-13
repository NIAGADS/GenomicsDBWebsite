import React, { useEffect, useState } from "react";
import * as rt from "../../types";
//@ts-ignore
import { CSVLink } from "react-csv";
import { cloneDeep, findIndex, forIn, get, isEmpty, kebabCase, pickBy } from "lodash";
import NiagadsRecordTable from "../RecordTable/RecordTable";
import { extractDisplayText } from "../util";
import RecordTablePValFilter from "../RecordTablePValFilter/RecordTablePValFilter";
import { Filter, Instance } from "react-table";

const NiagadsTableContainer: React.FC<rt.IRecordTable> = ({ table, value }) => {
    const [tableInstance, setTableInstance] = useState<Instance>(),
        [filtered, setFiltered] = useState<Filter[]>([]),
        [filterVal, setFilterVal] = useState(""),
        [basket, setBasket] = useState([]),
        [pValueFilterVisible, setPValueFilterVisible] = useState(false),
        [csvData, setCsvData] = useState<any[]>([]);

    const defaultPVal = 8;

    useEffect(() => {
        setFiltered(
            [{ id: "all", value: "" as any }].concat(
                get(table, "properties.type[0]") === "chart_filter" ? [{ id: "pvalue", value: defaultPVal }] : []
            )
        );
    }, [table]);

    const updateFilter = (id: string, value: any) =>
        //we're wrapping setFiltered here b/c useState function returns reliable state, which is important b/c we're binding to
        //a d3 callback down the line outside the react ecosystm and trying to limit updates by checking state first for redundancy
        //note that a function wrapping current (filter) state will be stale, this guarantees our d3 callback has access to the right state
        setFiltered((oldFilter: Filter[]) => {
            const filter = oldFilter.find((f) => f.id === id);
            if (filter.value !== value) {
                return oldFilter.map((f) => ({
                    ...f,
                    value: f.id === id ? value : f.value,
                }));
            } else return oldFilter;
        });

    const getHasPValFilter = (table: rt.Table) => !!tableInstance && table.properties.type[0] === "chart_filter";

    const getPValFilteredResultsEmpty = () =>
        getHasPValFilter(table) && !tableInstance.getResolvedState().sortedData.length;

    const handleSearchFilterChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setFilterVal(e.currentTarget.value);
        updateFilter("all", e.currentTarget.value);
    };

    const isSelected = (key: string) => getBasketIndex(key) > -1;

    const onTableLoaded = (ref: React.MutableRefObject<Instance>) => {
        if (!tableInstance && ref.current) {
            setTableInstance(ref.current);
        }
    };

    const toggleSelection = (key: string, shift: boolean, row: { [key: string]: any }) => {
        const idx = getBasketIndex(key);
        idx > -1 ? basket.splice(idx, idx + 1) : basket.push(row);
        setBasket(basket);
    };

    const togglePValueChartVisibility = () => setPValueFilterVisible(!pValueFilterVisible);

    const getBasketIndex = (key: string) => findIndex(basket, (item) => item.id === key);

    const loadCsvData = () => {
        const data = tableInstance.getResolvedState().sortedData,
            csvData = data.map((datum: any) => {
                const stripped = pickBy(datum, (v: any, k: string) => !/^_.+/.test(k));
                return forIn(stripped, (v: any, k: string, o: any) => (o[k] = extractDisplayText(v)));
            });
        setCsvData(csvData);
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
                                    onClick={loadCsvData}
                                    data={csvData}
                                >
                                    Download <span className="fa p-1 fa-download" />
                                </CSVLink>
                            )}
                            {pValueFilterVisible && (
                                <RecordTablePValFilter
                                    key={table.name}
                                    values={(cloneDeep(value) as unknown) as { [key: string]: any; pvalue: string }[]}
                                    setFilter={updateFilter}
                                    selectClass={table.name + "_chart"}
                                    defaultPVal={
                                        get(
                                            filtered.find((f) => f.id === "pvalue"),
                                            "value"
                                        ) || defaultPVal
                                    }
                                />
                            )}
                            <div className="filters control">
                                {getHasPValFilter(table) && (
                                    <a onClick={togglePValueChartVisibility} className="btn filter btn-primary">
                                        {pValueFilterVisible ? "Close P-value Filter" : "Open P-value Filter"}
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
                    <NiagadsRecordTable
                        visible={!getPValFilteredResultsEmpty()}
                        table={table}
                        value={value}
                        attributes={attributes}
                        filtered={filtered}
                        onLoad={onTableLoaded}
                        onSelectionToggled={toggleSelection}
                        isSelected={isSelected}
                        canShrink={get(table, "properties.canShrink[0]", false)}
                    />
                    <>
                        {getPValFilteredResultsEmpty() && (
                            <p style={{ textAlign: "center" }}>
                                No variants meet the default p-value cutoff for genome-wide significance (≤ 5e-
                                {defaultPVal}). To see more results, please adjust the p-value limit with the{" "}
                                <span className="link" onClick={setPValueFilterVisible.bind(null, true)}>
                                    p-value filter
                                </span>
                            </p>
                        )}
                    </>
                </div>
            ) : (
                "None Reported"
            )}
        </div>
    );
};

export default NiagadsTableContainer;
