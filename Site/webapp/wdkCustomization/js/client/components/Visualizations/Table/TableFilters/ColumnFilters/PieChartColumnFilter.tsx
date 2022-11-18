import React, { useMemo } from "react";
import { countBy, merge, isObject } from "lodash";

import { Column } from "react-table";

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
import { useFilterStyles, parseFieldValue } from "@viz/Table";

//@ts-ignore
export function PieChartColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
    series,
    options,
    title,
}: {
    columns: Column[];
    column: Column;
    series?: any;
    options?: any;
    title?: string;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const classes = useFilterStyles();

    const buildPlotOptions = () => {
        let plotOptions: Options = {
            plotOptions: {
                pie: {
                    center: ["50%", "50%"], // draws pie on left
                    size: 80,
                },
            },
            tooltip: {
                pointFormat: "",
            },
            legend: {
                align: "right",
                verticalAlign: "middle",
                layout: "vertical",
                title: {
                    text: title ? title : toProperCase(id),
                    style: { fontSize: "12px" },
                },
                itemStyle: { color: "black", fontSize: "12px", fontWeight: "normal", width: 100 },
                itemHoverStyle: { color: "#ffc665" },
            },
        };

        plotOptions = merge(plotOptions, addTitle(null));
        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());

        if (options) {
            plotOptions = merge(plotOptions, options);
        }

        return plotOptions;
    };

    const _buildSeriesData = () => {
        let values = new Array<String>(); // assumming pie filter is only for categorical values
        preFilteredRows.forEach((row: any) => {
            let value = parseFieldValue(row.values[id]);
            if (value && value != "n/a") {
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

        return data;
    };

    series = useMemo(() => {
        series ? series : { name: id, data: _buildSeriesData() };
        const seriesOptions = {
            colorByPoint: true,
            allowPointSelect: true,
            dataLabels: {
                enabled: false,
            },
            cursor: "pointer",
            showInLegend: true,
            point: {
                events: {
                    legendItemClick: function () {
                        //@ts-ignore
                        //setFilter(this.name || undefined);
                        return false;
                    },
                },
            },
            events: {
                click: function (e: any) {
                    setFilter(e.point.name || undefined);
                },
            },
        };

        series = merge(series, seriesOptions);
        return series;
    }, [id, preFilteredRows]);

    return (
        <>
            <HighchartsPlot
                data={{ series: series }}
                properties={{ type: "pie" }}
                plotOptions={buildPlotOptions()}
                containerProps={{ className: classes.pieChartContainer }}
            />
        </>
    );
}
