// credit to https://github.com/ggascoigne/react-table-example for all except global filer
import React, { useMemo } from "react";
import { countBy } from "lodash";
import { Column } from "react-table";

import { PieChartColumnFilter as DefaultPieChartFilter } from "@viz/Table/TableFilters";
import { parseFieldValue } from "@viz/Table";

//@ts-ignore
export function PieChartColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;

    const header: any = column.Header;
    const title = header.toString(); // where the displayName is stored for the column

    const series = useMemo(() => {
        let values = new Array<String>(); // assumming pie filter is only for categorical values
        preFilteredRows.forEach((row: any) => {
            let value = id.endsWith("flag") // handle badges, which are in html / if present, value is true
                ? row.values[id]
                    ? "Yes"
                    : "No"
                : parseFieldValue(row.values[id]);
            //counts[num] = counts[num] ? counts[num] + 1 : 1;
            if (value && value != "n/a") {
                if (value.includes("//")) {
                    let vals = value.split(" // ");
                    vals.forEach((v: string) => {
                        values.push(v);
                    });
                } else if (value.toUpperCase() == value) {
                    values.push(value.toLowerCase());
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
        };
        return series;
    }, [id, preFilteredRows]);

    return <DefaultPieChartFilter column={column} columns={columns} series={series} title={title} />;
}
