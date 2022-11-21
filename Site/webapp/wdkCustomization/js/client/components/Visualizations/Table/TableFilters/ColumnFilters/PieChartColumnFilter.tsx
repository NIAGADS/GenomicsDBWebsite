import React, { useMemo, useState, useEffect } from "react";
import { countBy, merge, get } from "lodash";

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

import { parseFieldValue } from "@viz/Table";
import { useFilterStyles, ZeroFilterChoicesMsg } from "@viz/Table/TableFilters";

//@ts-ignore
export function PieChartColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
    series,
    options,
    title,
    ignoreNAs,
}: {
    columns: Column[];
    column: Column;
    series?: any;
    options?: any;
    title?: string;
    ignoreNAs?: boolean;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const [numFilterChoices, setNumFilterChoices] = useState<number>(null);
    const [ selectedSlice, setSelectedSlice ] = useState<string>(filterValue);

    const classes = useFilterStyles();

    useEffect(() => {
        if (series && series.hasOwnProperty("data")) {
            setNumFilterChoices(series.data.length == 1 ? (series.data[0].name == "N/A" ? 0 : 1) : series.data.length);
        }
    }, [series]);

    useEffect(() => {
        selectedSlice && setFilter(selectedSlice);
    }, [selectedSlice]);

    const buildPlotOptions = () => {
        let plotOptions: Options = {
            plotOptions: {
                pie: {
                    center: ["50%", "50%"], // draws pie on left
                    size: 80,
                    states: {
                        select: {
                            color: "red",
                        },
                    },
                },
            },
            tooltip: {
                pointFormat: "N = {point.total} ({point.percentage:.1f} %)",
            },
            legend: {
                align: "right",
                verticalAlign: "middle",
                layout: "vertical",
                title: {
                    text: title ? title : column.Header.toString(),
                    style: { fontSize: "12px" },
                },
                itemStyle: { color: "black", fontSize: "12px", fontWeight: "normal", width: 100 },
                itemHoverStyle: { color: "#ffc665" },
                labelFormatter: function () {
                    return this.name == "N/A"
                        ? '<span class="legend-text-with-tooltip" title="Click legend label to hide missing or N/A values on chart (click slice on chart to filter table)">' +
                              this.name +
                              "</span>"
                        : '<span class="legend-text-with-tooltip" title="Click slice on chart to filter table">' +
                              this.name +
                              "</span>";
                },
                useHTML: true,
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

    const _buildSeriesData = (rows: any, accessorType: string) => {
        let values = new Array<String>(); // assumming pie filter is only for categorical values
        rows.forEach((row: any) => {
            //@ts-ignore
            let value = parseFieldValue(row.values[id], true, accessorType == "BooleanFlag");
            if (value) {
                if (value.includes("//")) {
                    let vals = value.split(" // ");
                    vals.forEach((v: string) => {
                        values.push(v);
                    });
                } else if (value.toUpperCase() == value) {
                    values.push(value.toLowerCase());
                } else if (ignoreNAs) {
                    values.push(value);
                } else {
                    values.push(value == "n/a" ? value.toUpperCase() : value);
                }
            }
        });

        let counts = countBy(values);
        let data: any = [];
        if (counts.hasOwnProperty("N/A") && !ignoreNAs) {
            // want N/As to always be first b/c they will be the biggest slice
            if (selectedSlice && selectedSlice.toUpperCase() === "N/A") {
                data.push({ name: "N/A", y: counts["N/A"], color: "#ffd998", selected: true, sliced: true });
            } else {
                data.push({ name: "N/A", y: counts["N/A"], color: "#ffd998" });
            }
        }
        for (const id of Object.keys(counts)) {
            if (id != "N/A") {
                if (selectedSlice && id === selectedSlice) {
                    data.push({ name: id, y: counts[id], selected: true, sliced: true });
                } else {
                    data.push({ name: id, y: counts[id] });
                }
            }
        }
        return data;
    };

    series = useMemo(() => {
        //@ts-ignore
        const accessorType = column.accessorType;
        let modifiedSeries = series
            ? series.hasOwnProperty("data")
                ? series // use series passed to component b/c already has data
                : merge(series, { data: _buildSeriesData(preFilteredRows, accessorType) }) // data needs to be added
            : { name: id, data: _buildSeriesData(preFilteredRows, accessorType) }; // whole series needs to be generated

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
                        if (this.name === "N/A") {
                            return true; // if N/A hide
                        }
                        return false; // otherwise filter
                    },
                },
            },
            events: {
                click: function (e: any) {
                    if (e.point.state == "select") {
                        setSelectedSlice(undefined);
                        alert("remove")
                    } else {
                        //setFilter(e.point.name || undefined);
                        setSelectedSlice(e.point.name);
                        alert("add")
                    }
                    //
                },
            },
        };

        modifiedSeries = merge(modifiedSeries, seriesOptions);

        return modifiedSeries;
    }, [id, preFilteredRows]);

    return (
        <>
            {numFilterChoices && numFilterChoices > 0 ? (
                <HighchartsPlot
                    data={{ series: series }}
                    properties={{ type: "pie" }}
                    plotOptions={buildPlotOptions()}
                    containerProps={{ className: classes.pieChartContainer }}
                />
            ) : (
                <ZeroFilterChoicesMsg label={title ? title : column.Header.toString()} />
            )}
        </>
    );
}
