import React, { useMemo, useState, useEffect } from "react";
import { chain } from "lodash";
import { Column } from "react-table";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";

import { negLog10p, getMinMaxNegLog10PValue, invertNegLog10p } from "../filters/negLog10pFilter";
import { InputSlider } from "@components/MaterialUI";
import { render } from "wdk-client/Views/Question/Params/FilterParamNew/FilterParamNew";

const DEFAULT_FILTER_VALUE = negLog10p(5e-8);
const MAX_ALLOWABLE_PVALUE = 15;
const MIN_ALLOWABLE_PVALUE = 0;

//@ts-ignore
export function PValueSliderFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows, target } = column;
    const [min, max] = useMemo(() => getMinMaxNegLog10PValue(preFilteredRows, id, MAX_ALLOWABLE_PVALUE), [id]);

    const [currentFilterValue, setFilterValue] = useState(
        filterValue === undefined ? DEFAULT_FILTER_VALUE : negLog10p(filterValue)
    ); // catch clear filters

    // only want to do these once
    useEffect(() => {
        setFilter(invertNegLog10p(currentFilterValue));
    }, [currentFilterValue]);

    return (
        <InputSlider
            min={max}
            max={min}
            label={render("Header")}
            handleChange={(e:any) => {
                setFilter(invertNegLog10p(e.target.value));
            }}
            currentValue={negLog10p(filterValue) || min}
            valueLabelFormat={(e:any) => {negLog10p(e.target.value)}}
            step={-0.1}
            //@ts-ignore
            scale={x => -x}
        ></InputSlider>
    );
}

const _extractValues = (preFilteredRows: any, id: string) => {
    let count = 0;
    return chain(preFilteredRows)
        .map((row) => {
            let neglog10p = negLog10p(row.values[id]);
            if (neglog10p > 15) {
                neglog10p = 15;
            }
            return neglog10p;
        })
        .value();
};
