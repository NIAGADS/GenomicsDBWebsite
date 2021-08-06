// credit to https://github.com/ggascoigne/react-table-example for all except global filer
import React, { useMemo, useState, useEffect } from "react";
import { countBy, merge } from "lodash";
import { Row, IdType, Column, useAsyncDebounce } from "react-table";

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


