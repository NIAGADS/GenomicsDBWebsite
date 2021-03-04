import React, { useEffect, useMemo, useState } from "react";
import * as rt from "../../types";
//@ts-ignore
import { CSVLink } from "react-csv";
import { cloneDeep, intersection, findIndex, forIn, get, isEmpty, kebabCase, maxBy, pickBy, round } from "lodash";
import NiagadsRecordTable from "../RecordTable/RecordTable";
import { extractDisplayText } from "../util";
import RecordTablePValFilter from "../RecordTablePValFilter/RecordTablePValFilter";
import { Filter, Instance } from "react-table";
import { Box, Grid, List, Typography } from "@material-ui/core";
import {
    BaseTextSmall,
    PrimaryActionButton,
    PseudoLink,
    UnlabeledTextFieldOutlined,
    UnpaddedListItem,
} from "../../../Shared";

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

    const filterString = (value: string, rows: any[]) => {
        //https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
        const re = new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
        return rows.filter((row) => {
            const rowString = Object.entries(row)
                //filter out falsey vals and internal react-table properties marked by leading _
                .filter(([k, v]) => !(!v || /^_.+/.test(k)))
                .map(([_, v]: any) => extractDisplayText(v))
                .join("");
            return re.test(rowString);
        });
    };

    const getPValFilteredResultsEmpty = () => {
        //table instance check is unreliable b/c this function might fire after filter update but before table state has been resolved
        //so we have to check 'raw' data outside of instance
        const data = value || [],
            pValFilter = (filtered || []).find((f) => f.id == "pvalue"),
            stringFiltered = filterString(filterVal, data),
            pFiltered = data.filter(
                (v: any) => Number(get(v, "pvalue")) <= Number(get(pValFilter, "value", defaultPVal))
            );

        return (
            getHasPValFilter(table) &&
            get(value, "length") &&
            //return true if pval filter is masking everything, or if it's masking
            (pFiltered.length === 0 || (stringFiltered.length && !intersection(stringFiltered, pFiltered).length))
        );
    };

    const handleSearchFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return !isEmpty(value) ? (
        <Grid container direction="column" wrap="nowrap" spacing={1}>
            <Grid item container direction="row" wrap="nowrap">
                {tableInstance && (
                    <Grid item spacing={1} sm={3} container alignItems="center">
                        <Grid item>
                            <CSVLink
                                filename={`${kebabCase(table.displayName)}.csv`}
                                onClick={loadCsvData}
                                data={csvData}
                            >
                                Download <span className="fa fa-download" />
                            </CSVLink>
                        </Grid>
                        <Grid>
                            <UnlabeledTextFieldOutlined
                                placeholder="Search table"
                                value={filterVal}
                                onChange={handleSearchFilterChange}
                            />
                        </Grid>
                    </Grid>
                )}
                {/* todo: extract to its own component with maxPvalue as internal state */}
                {getHasPValFilter(table) && (
                    <Grid item sm={9}>
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
                    </Grid>
                )}
            </Grid>
            {
                <Grid item>
                    <NiagadsRecordTable
                        attributes={attributes}
                        canShrink={get(table, "properties.canShrink[0]", false)}
                        isSelected={isSelected}
                        filtered={filtered}
                        onLoad={onTableLoaded}
                        onSelectionToggled={toggleSelection}
                        stringFilterMethod={filterString}
                        table={table}
                        value={value}
                        visible={!getPValFilteredResultsEmpty()}
                    />
                </Grid>
            }
            {!!getPValFilteredResultsEmpty() && (
                <Grid item>
                    <BaseTextSmall style={{ textAlign: "center" }}>
                        No variants meet the default p-value cutoff for genome-wide significance (≤ 5e-
                        {/* TODO: useMemo */}
                        {get(
                            filtered.find((f) => f.id === "pvalue"),
                            "value"
                        ) || defaultPVal}
                        ). To see more results, please adjust the p-value limit with the{" "}
                        <PseudoLink onClick={setPValueFilterVisible.bind(null, true)}>p-value filter</PseudoLink>
                    </BaseTextSmall>
                </Grid>
            )}
        </Grid>
    ) : (
        <BaseTextSmall>None Reported</BaseTextSmall>
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
        <Grid container item direction="row" wrap="nowrap" spacing={2}>
            {filterVisible && (
                <Grid item sm={9}>
                    <RecordTablePValFilter
                        key={tableName}
                        defaultPVal={+filterPVal || defaultPValue}
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
                </Grid>
            )}
            <Grid item container direction="column" alignItems="flex-start" spacing={1} sm={3}>
                {filterVisible && (
                    <List>
                        <UnpaddedListItem>
                            <strong>Current p-value:&nbsp;</strong>
                            {transform(+filterPVal)}
                        </UnpaddedListItem>
                        <UnpaddedListItem>
                            <strong>New p-value:&nbsp;</strong>
                            {transform(+maxPvalue)}
                        </UnpaddedListItem>

                        <PrimaryActionButton onClick={() => updatePvalFilter(+transform(+maxPvalue))}>
                            Update
                        </PrimaryActionButton>
                    </List>
                )}
                <PrimaryActionButton onClick={toggleVisibility}>
                    {filterVisible ? "Close P-value Filter" : "Open P-value Filter"}
                </PrimaryActionButton>
            </Grid>
        </Grid>
    );
};
