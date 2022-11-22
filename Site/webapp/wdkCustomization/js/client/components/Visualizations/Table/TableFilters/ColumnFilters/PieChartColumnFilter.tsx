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
    options,
    title,
    ignoreNAs,
}: {
    columns: Column[];
    column: Column;
    options?: any;
    title?: string;
    ignoreNAs?: boolean;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const [numFilterChoices, setNumFilterChoices] = useState<number>(null);
    const [selectedSlice, setSelectedSlice] = useState<string>(filterValue);
    const [series, setSeries] = useState<any>(null);
    const classes = useFilterStyles();

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
                setSelectedSlice(selectedSlice === e.point.name ? undefined : e.point.name);
                /*  if (e.point.state == "select") {
                    setSelectedSlice(undefined);
                    alert("remove");
                } else {
                    //setFilter(e.point.name || undefined);
                   
                    alert("add");
                }*/
                //
            },
        },
    };

    useEffect(() => {
        //@ts-ignore
        setSeries(_buildSeries(preFilteredRows, column.accessorType, selectedSlice));
    }, [column, preFilteredRows, selectedSlice]);

    useEffect(() => {
        if (series && series.hasOwnProperty("data")) {
            setNumFilterChoices(series.data.length == 1 ? (series.data[0].name == "N/A" ? 0 : 1) : series.data.length);
        }
    }, [series]);

    useEffect(() => {
        setFilter(selectedSlice || undefined);
    }, [selectedSlice]);

    const _buildPlotOptions = () => {
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

    const _buildSeries = (rows: any, accessorType: string, selectedColumn: string) => {
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
        let seriesData: any = [];

        // want N/As to always be first b/c they will be the biggest slice
        if (counts.hasOwnProperty("N/A") && !ignoreNAs) {
            seriesData.push({ name: "N/A", y: counts["N/A"], color: "#e0e0e0" });

            /*if (selectedColumn && selectedColumn.toUpperCase() === "N/A") {
                data.push({ name: "N/A", y: counts["N/A"], color: "#e0e0e0", selected: true, sliced: true });
            } else {
                data.push({ name: "N/A", y: counts["N/A"], color: "#e0e0e0" });
            } */
        }
        for (const id of Object.keys(counts)) {
            if (id != "N/A") {
                seriesData.push({ name: id, y: counts[id] });
                /* if (selectedColumn && id === selectedColumn) {
                    data.push({ name: id, y: counts[id], selected: true, sliced: true });
                } else {
                    data.push({ name: id, y: counts[id] });
                }*/
            }
        }
        merge({ name: id, data: seriesData }, seriesOptions);
    };

    return (
        series ? (
            <>
                {numFilterChoices && numFilterChoices > 0 ? (
                    <HighchartsPlot
                        data={{ series: series }}
                        properties={{ type: "pie" }}
                        plotOptions={_buildPlotOptions()}
                        containerProps={{ className: classes.pieChartContainer }}
                    />
                ) : (
                    <ZeroFilterChoicesMsg label={title ? title : column.Header.toString()} />
                )}
            </>
        ) : null
    );
}
