// credit to https://github.com/ggascoigne/react-table-example for all except global filer
import React, { useMemo, useState, useEffect } from "react";
import { countBy, merge, chain } from "lodash";
import { Row, IdType, Column, useAsyncDebounce } from "react-table";

import { negLog10p, getMinMaxNegLog10PValue, invertNegLog10p } from "./filters/negLog10pFilter";

import PValueChartFilter from "./PValueChartFilter";

const DEFAULT_FILTER_VALUE = negLog10p(5e-8);
const MAX_ALLOWABLE_PVALUE = 15;

//@ts-ignore
export function PValueFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows, target } = column;
    const [currentFilterValue, setFilterValue] = useState(filterValue);
    const data = useMemo(() => _binData(preFilteredRows, id), [id]); // only want to do this once
    const [min, max] = useMemo(() => getMinMaxNegLog10PValue(preFilteredRows, id, MAX_ALLOWABLE_PVALUE), [id]);

    useEffect(() => {
        setFilter(invertNegLog10p(currentFilterValue));
     }, [currentFilterValue]);

    return (
        <PValueChartFilter
            defaultValue={DEFAULT_FILTER_VALUE}
            filterValue={currentFilterValue}
            data={data}
            target={target}
            setFilter={(val: number) => setFilterValue(Number(val).toString())}
        />
    );
}

const _binData = (preFilteredRows: any, id: string) => {
    let count = 0;
    return chain(preFilteredRows)
        .map((row) => {
            let neglog10p = negLog10p(row.values[id]);
            if (neglog10p > 15) {
                neglog10p = 15;
            }
            return neglog10p;
        })
        .groupBy()
        .entries()
        .sort(([a], [b]) => (+a > +b ? 1 : -1))
        .map((vals) => ({
            value: +vals[0],
            count: (count += vals[1].length),
        }))
        .value();
};
