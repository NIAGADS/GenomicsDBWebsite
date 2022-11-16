// credit to https://github.com/ggascoigne/react-table-example for all except global filer
import React, { useMemo } from "react";
import { countBy, merge } from "lodash";
import { Column } from "react-table";
import { Options } from "highcharts";

import { addTitle } from "@viz/Highcharts/HighchartsOptions";

import { PieChartFilter as DefaultPieChartFilter } from "@viz/Table/TableFilters";

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
    const title = header.props.children[2]; // where the displayName is stored for the column

    const series = useMemo(() => {
        let values = new Array<String>(); // assumming pie filter is only for categorical values
        preFilteredRows.forEach((row: any) => {
            let value = id.endsWith("flag") // handle badges, which are in html / if present, value is true
                ? row.values[id]
                    ? "Yes"
                    : "No"
                : extractDisplayText(row.values[id]);
            //counts[num] = counts[num] ? counts[num] + 1 : 1;
            if (value) {
                if (value.includes("//")) {
                    let vals = value.split(" // ");
                    vals.forEach((v: string) => {
                        values.push(v);
                    });
                } 
                else if (value.toUpperCase() == value) {
                    values.push(value.toLowerCase())
                }
                else {
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
                events: {
                    legendItemClick: function () {
                        //@ts-ignore
                        setFilter(this.name || undefined);
                    },
                },

                //         () => false },
            },
            events: {
                click: function (e: any) {
                    setFilter(e.point.name || undefined);
                },
            },
        };
        return series;
    }, [id, preFilteredRows]);

    return <DefaultPieChartFilter column={column} columns={columns} series={series} title={title} />;
}
