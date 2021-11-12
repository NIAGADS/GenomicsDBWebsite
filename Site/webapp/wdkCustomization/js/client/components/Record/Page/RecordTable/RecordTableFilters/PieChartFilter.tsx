// credit to https://github.com/ggascoigne/react-table-example for all except global filer
import React, { useMemo, useState, useEffect } from "react";
import { countBy, merge } from "lodash";
import { Column, HeaderProps } from "react-table";
import { Options } from "highcharts";
import HighchartsPlot from "@viz/Highcharts/HighchartsPlot";
import {
    addTitle,
    disableExport,
    applyCustomSeriesColor,
    backgroundTransparent,
} from "@viz/Highcharts/HighchartsOptions";
import { _color_blind_friendly_palettes as PALETTES } from "@viz/palettes";

import { toProperCase } from "genomics-client/util/util";
import { extractDisplayText } from "../RecordTableSort";

//@ts-ignore
export function PieChartFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;

    const header: any = column.Header;
    const buildPlotOptions = () => {
        let plotOptions: Options = {
            tooltip: {
                pointFormat: "",
            }
        };

        let title = header.props.children[2]; // where the displayName is stored for the column
        plotOptions = merge(plotOptions, addTitle(title, { y: 40 }));
        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());
        return plotOptions;
    };

    const series = useMemo(() => {
        let values = new Array<String>(); // assumming pie filter is only for categorical values
        preFilteredRows.forEach((row: any) => {
            let value = id.endsWith('flag') ? // handle badges, which are in html / if present, value is true
                row.values[id] ? "Yes" : "No" 
                : extractDisplayText(row.values[id]);
            //counts[num] = counts[num] ? counts[num] + 1 : 1;
            if (value) {
                if (value.includes("//")) {
                    let vals = value.split(" // ");
                    vals.forEach((v: string) => {
                        values.push(v);
                    });
                } else {
                    values.push(value);
                }
            }
        });

        let data: any = [];
        let counts = countBy(values);
        for (const id of Object.keys(counts)) {
            data.push({ name: id, y: counts[id] });
        }
        let series = {
            name: id,
            data: data,
            colorByPoint: true,
            allowPointSelect: true,
            dataLabels: {
                enabled: false,
            },
            cursor: "pointer",
            showInLegend: true,
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
            <HighchartsPlot data={{ series: series }} properties={{ type: "pie" }} plotOptions={buildPlotOptions()} />
        </>
    );
}