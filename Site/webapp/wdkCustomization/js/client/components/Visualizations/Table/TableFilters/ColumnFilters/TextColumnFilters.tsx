// modeled after https://github.com/ggascoigne/react-table-example
import React, { useMemo, useState, useEffect } from "react";

import { Column } from "react-table";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { ComingSoonAlert } from "@components/MaterialUI";

import { parseFieldValue } from "@viz/Table";
import { useFilterStyles, ZeroFilterChoicesMsg } from "@viz/Table/TableFilters";

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
            if (value && value != "N/A") {
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
        return [...Array.from(options.values()).sort()];
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

//@ts-ignore
export function CheckboxSelectColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const [numFilterChoices, setNumFilterChoices] = useState<number>(null);
    const [checkedValues, setCheckedValues] = useState<string[]>(filterValue ? filterValue.split(",") : []);

    const classes = useFilterStyles();

    const toggleListValue = (value: string, list: string[]) => {
        if (list.includes(value)) {
            // remove
            list.splice(list.indexOf(value), 1);
        } else {
            list.push(value);
        }
        return list;
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedValues([...toggleListValue(event.target.value, checkedValues)]); // arrays passed by reference, [...arr] creates a copy, so state changes
    };

    const isChecked = (value: string) => {
        return (checkedValues.includes(value));
    }

    useEffect(() => {
        if (!checkedValues || checkedValues.length == 0) {
            setFilter(undefined);
        } else {
            setFilter(checkedValues.join());
        }
    }, [checkedValues]);


    useEffect(() => { // trying to catch resets and clears
        setCheckedValues(filterValue ? filterValue.split(",") : []);
    }, [filterValue]);

    const options = useMemo(() => {
        const options = new Set<any>();
        preFilteredRows.forEach((row: any) => {
            let value = parseFieldValue(row.values[id]);
            if (value && value != "N/A") {
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
        return [...Array.from(options.values()).sort()];
    }, [id, preFilteredRows]);

    useEffect(() => {
        setNumFilterChoices(options.length);
    }, [options]);

    return numFilterChoices && numFilterChoices > 0 ? (
        <FormControl component="fieldset" className={classes.select}>
            <FormLabel component="label" className={classes.formLabel}>{column.Header.toString()}</FormLabel>
            <FormGroup>
                {options.map((option, i) => (
                    <FormControlLabel classes={{label: classes.formControlLabel}}
                        key={i}
                        value={option}
                        label={option}
                        control={<Checkbox onChange={handleCheckboxChange} name={option} checked={isChecked(option)} className={classes.checkBox} size="small"/>}
                    />
                ))}
            </FormGroup>
        </FormControl>
    ) : (
        <ZeroFilterChoicesMsg label={render("Header")} />
    );
}


export function RadioSelectColumnFilter<T extends Record<string, unknown>>({
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

    return (
        <ComingSoonAlert message={`Radio select filter by ${column.Header.toString()} coming soon.`}/>
    );
}

export function TypeAheadSelectColumnFilter<T extends Record<string, unknown>>({
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

    return (
        <ComingSoonAlert message={`Type ahead select filter by ${column.Header.toString()} coming soon.`}/>
    );
}