// credit to https://github.com/ggascoigne/react-table-example for all except global filer
import React, { useMemo, useState, useEffect } from "react";
import { countBy, merge } from "lodash";
import { Row, IdType, Column, useAsyncDebounce } from "react-table";

/*import { Options } from "highcharts";
import HighchartsPlot from "../../../Visualizations/Highcharts/HighchartsPlot";
import {
    addTitle,
    disableExport,
    applyCustomSeriesColor,
    backgroundTransparent,
} from "../../../Visualizations/Highcharts/HighchartsOptions";
import { _color_blind_friendly_palettes as PALETTES } from "../../../Visualizations/palettes"; */

import { toProperCase } from "../../../../util/util";
import { extractDisplayText } from "../RecordTableSort";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const DEFAULT_FILTER_VALUE = -1 * Math.log10(5e-8); 

const getMinMax = (rows: Row[], id: IdType<any>) => {
    let min = rows.length ? -1 * Math.log10(extractDisplayText(rows[0].values[id])) : 0;
    let max = rows.length ? -1 * Math.log10(extractDisplayText(rows[0].values[id])) : 0;
    rows.forEach((row) => {
        let value = -1 * Math.log10(extractDisplayText(row.values[id]));
        min = Math.min(value, min);
        max = Math.max(value, max);
    });
    return [min, max];
};

//@ts-ignore
export function PValueSliderFilter({ filterValue, render, setFilter, preFilteredRows, id }: Column) {
    const [min, max] = useMemo(() => getMinMax(preFilteredRows, id), [id, preFilteredRows]);
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
            }}
        >
            <TextField
                name={id}
                label="-log10 p-value"
                type="range"
                inputProps={{
                    min,
                    max,
                }}
                value={filterValue || min}
                onChange={(e) => {
                    setFilter(parseInt(e.target.value, 10));
                }}
            />
            <Button variant="outlined" style={{ width: 60, height: 36 }} onClick={() => setFilter(undefined)}>
                Reset
            </Button>
        </div>
    );
}


/*
//@ts-ignore
export function PValueFilter<T extends Record<string, unknown>>({ columns, column }: { columns: Column[]; column: Column }) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;

    const buildPlotOptions = () => {
        let plotOptions: Options = {
            tooltip: {
                pointFormat: "",
            },
        };

        plotOptions = merge(plotOptions, addTitle(toProperCase(id), { y: 40 }));
        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());
        return plotOptions;
    };

    const series = useMemo(() => {
        let data = new Array<number>(); // assumming pie filter is only for categorical values
        let sumValues = 0;
        preFilteredRows.forEach((row: any) => {
            let value = -1 * Math.log10(extractDisplayText(row.values[id]));
            sumValues += value;
            data.push(sumValues);
        });

        let series = {
            name: id,
            data: data,
            cursor: "pointer",
            point: {
                events: { legendItemClick: () => false },
            },
            events: {
                click: function (e: any) {
                    setFilter(e.point.name || undefined);
                },
            },
        };
        return series;
    }, [id, preFilteredRows]);

    return (
        <>
            <HighchartsPlot data={{ series: series }} properties={{ type: "line" }} plotOptions={buildPlotOptions()} />
        </>
    );
} */
