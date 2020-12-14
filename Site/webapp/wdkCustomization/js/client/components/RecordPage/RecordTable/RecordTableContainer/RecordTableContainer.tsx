import React, { useEffect, useMemo, useState } from "react";
import * as rt from "../../types";
//@ts-ignore
import { CSVLink } from "react-csv";
import { cloneDeep, findIndex, forIn, get, isEmpty, kebabCase, maxBy, pickBy, round } from "lodash";
import NiagadsRecordTable from "../RecordTable/RecordTable";
import { extractDisplayText } from "../util";
import RecordTablePValFilter from "../RecordTablePValFilter/RecordTablePValFilter";
import { Filter, Instance } from "react-table";

const NiagadsTableContainer: React.FC<rt.RecordTable> = ({ table, value }) => {
    const [tableInstance, setTableInstance] = useState<Instance>(),
        [filtered, setFiltered] = useState<Filter[]>([]),
        [filterVal, setFilterVal] = useState(""),
        [basket, setBasket] = useState([]),
        [pValueFilterVisible, setPValueFilterVisible] = useState(false),
        [csvData, setCsvData] = useState<any[]>([]);

    const defaultPVal = useMemo(() => {
        //make sure default p is within the range of values, otherwise, default to max pval in data
        const observedMax = +get(
            maxBy(value, (v) => +v.pvalue),
            "pvalue"
        );
        return Math.min(observedMax, 5e-8);
    }, [value]);

    useEffect(() => {
        const filter = [{ id: "all", value: "" as any }].concat(
            get(table, "properties.type[0]") === "chart_filter" ? [{ id: "pvalue", value: defaultPVal }] : []
        );
        setFiltered(filter);
    }, [defaultPVal, table]);

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

    const getPValFilteredResultsEmpty = () => {
        //table instance check is unreliable b/c this function might fire after filter update but before table state has been resolved
        //so we have to check 'raw' data outside of instance
        const filter = (filtered || []).find((f) => f.id == "pvalue");
        return (
            getHasPValFilter(table) &&
            get(value, "length") &&
            value.every((v) => Number(get(v, "pvalue")) >= Number(get(filter, "value", defaultPVal)))
        );
    };

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
                        <div className="main-controls row">
                            {tableInstance && (
                                <div className="col flex-grow-0 align-items-center d-flex">
                                    <CSVLink
                                        className="control d-flex"
                                        filename={`${kebabCase(table.displayName)}.csv`}
                                        onClick={loadCsvData}
                                        data={csvData}
                                    >
                                        Download <span className="fa p-1 fa-download" />
                                    </CSVLink>
                                    <input
                                        type="text"
                                        className="filter"
                                        placeholder="Search table"
                                        value={filterVal}
                                        onChange={handleSearchFilterChange}
                                    />
                                </div>
                            )}
                            {/* todo: extract to its own component with maxPvalue as internal state */}
                            {getHasPValFilter(table) && (
                                <PvalFilterControls
                                    defaultPValue={defaultPVal}
                                    filterPVal={
                                        get(
                                            filtered.find((f) => f.id === "pvalue"),
                                            "value"
                                        ) || defaultPVal
                                    }
                                    filterVisible={pValueFilterVisible}
                                    tableName={table.name}
                                    toggleVisibility={togglePValueChartVisibility}
                                    updatePvalFilter={updateFilter.bind(null, "pvalue")}
                                    values={value}
                                />
                            )}
                        </div>
                    </div>
                    {
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
                    }
                    {getPValFilteredResultsEmpty() && (
                        <p style={{ textAlign: "center" }}>
                            No variants meet the default p-value cutoff for genome-wide significance (≤ 5e-
                            {defaultPVal}). To see more results, please adjust the p-value limit with the{" "}
                            <span className="link" onClick={setPValueFilterVisible.bind(null, true)}>
                                p-value filter
                            </span>
                        </p>
                    )}
                </div>
            ) : (
                "None Reported"
            )}
        </div>
    );
};

export default NiagadsTableContainer;

/* moving this to its own component so it can carry local filter state, avoiding costly table rerenders */

interface PvalFilterControls {
    defaultPValue: number;
    filterPVal: number;
    filterVisible: boolean;
    tableName: string;
    toggleVisibility: () => void;
    updatePvalFilter: (val: number) => void;
    values: any[];
}

const PvalFilterControls: React.FC<PvalFilterControls> = ({
    defaultPValue,
    filterPVal,
    filterVisible,
    tableName,
    toggleVisibility,
    updatePvalFilter,
    values,
}) => {
    const transform = (pval: number) => {
        //depending how small it is, pval may or may not come as exponent
        const asExp = Number(pval).toExponential();
        //to get a well-displayed number, we'll round only as far as first digit of coeff
        const exp = asExp.replace(/^\d+(\.\d+)?e-/, "");
        return Number(round(pval, +exp + 1)).toExponential();
    };

    const [maxPvalue, setMaxPValue] = useState<string>(transform(defaultPValue));

    return (
        <div className="col d-flex">
            {filterVisible && (
                <RecordTablePValFilter
                    key={tableName}
                    defaultPVal={defaultPValue}
                    selectClass={tableName + "_chart"}
                    setMaxPvalue={(val: number) => setMaxPValue(Number(val).toString())}
                    values={
                        /* no need to memoize, since pval filter is itself memoized and will never rerender */
                        (cloneDeep(values) as unknown) as {
                            [key: string]: any;
                            pvalue: string;
                        }[]
                    }
                />
            )}
            <div className="flex-column d-flex align-self-center">
                {filterVisible && (
                    <>
                        <div>
                            <strong>Current p-value:&nbsp;</strong>
                            {transform(+filterPVal)}
                        </div>
                        <div>
                            <strong>New p-value:&nbsp;</strong>
                            {transform(+maxPvalue)}
                        </div>

                        <a onClick={() => updatePvalFilter(+transform(+maxPvalue))} className="btn filter btn-primary">
                            Update
                        </a>
                    </>
                )}
                <a onClick={toggleVisibility} className="btn filter btn-primary">
                    {filterVisible ? "Close P-value Filter" : "Open P-value Filter"}
                </a>
            </div>
        </div>
    );
};
