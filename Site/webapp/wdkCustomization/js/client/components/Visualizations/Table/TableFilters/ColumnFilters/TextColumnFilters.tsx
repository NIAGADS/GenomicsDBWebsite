// modeled after https://github.com/ggascoigne/react-table-example
import React, { useMemo, useState, useEffect } from "react";
import { isObject } from "lodash";

import { Column } from "react-table";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import { parseFieldValue } from "@viz/Table";
import { useFilterStyles } from "@viz/Table/TableFilters";
import { ZeroFilterChoicesMsg } from "./ZeroFilterChoicesMsg";

const findFirstColumn = <T extends Record<string, unknown>>(columns: Array<Column<T>>): Column<T> =>
    //@ts-ignore
    columns[0].columns ? findFirstColumn(columns[0].columns) : columns[0];

export function DefaultColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render } = column;
    const [value, setValue] = useState(filterValue || "");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    // ensure that reset loads the new value
    useEffect(() => {
        setValue(filterValue || "");
    }, [filterValue]);

    const isFirstColumn = findFirstColumn(columns) === column;
    return (
        <TextField
            name={id}
            className="filter-text-input"
            label={render("Header")}
            InputLabelProps={{ htmlFor: id }}
            value={value}
            autoFocus={isFirstColumn}
            variant="outlined"
            size="small"
            margin="dense"
            onChange={handleChange}
            onBlur={(e) => {
                setFilter(e.target.value || undefined);
            }}
        />
    );
}

//@ts-ignore
export function SelectColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const [numFilterChoices, setNumFilterChoices] = useState<number>(null);

    const classes = useFilterStyles();

    const options = useMemo(() => {
        const options = new Set<any>();
        preFilteredRows.forEach((row: any) => {
            let value = parseFieldValue(row.values[id]);
            if (value && value != "n/a") {
                if (value.includes("//")) {
                    let vals = value.split(" // ");
                    vals.forEach((v: string) => {
                        options.add(v);
                    });
                } else {
                    options.add(value);
                }
            }
        });
        return [...Array.from(options.values())];
    }, [id, preFilteredRows]);

    useEffect(() => {
        setNumFilterChoices(options.length);
    }, [options]);

    return numFilterChoices && numFilterChoices > 0 ? (
        <TextField
            select
            className={classes.select}
            label={render("Header")}
            value={filterValue || ""}
            variant="outlined"
            margin="dense"
            size="small"
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
        >
            <MenuItem value={""}>Any</MenuItem>
            {options.map((option, i) => (
                <MenuItem key={i} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    ) : (
        <ZeroFilterChoicesMsg label={render("Header")} />
    );
}
