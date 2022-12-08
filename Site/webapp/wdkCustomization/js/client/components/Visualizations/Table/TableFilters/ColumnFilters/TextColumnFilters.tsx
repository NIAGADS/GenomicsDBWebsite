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
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import { Autocomplete } from "@material-ui/lab";

import { ComingSoonAlert, StyledTooltip as Tooltip } from "@components/MaterialUI";

import { parseFieldValue } from "@viz/Table";
import { useFilterStyles, ZeroFilterChoicesMsg } from "@viz/Table/TableFilters";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

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
        return checkedValues.includes(value);
    };

    useEffect(() => {
        if (!checkedValues || checkedValues.length == 0) {
            setFilter(undefined);
        } else {
            setFilter(checkedValues.join());
        }
    }, [checkedValues]);

    useEffect(() => {
        // trying to catch resets and clears
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
        <FormControl component="fieldset" className={`${classes.select} ${classes.formControl}`}>
            <FormLabel component="label" className={classes.formLabel}>
                {column.Header.toString()}
            </FormLabel>
            <FormGroup>
                {options.map((option, i) => (
                    <FormControlLabel
                        classes={{ label: classes.formControlLabel }}
                        key={i}
                        value={option}
                        label={option}
                        control={
                            <Checkbox
                                onChange={handleCheckboxChange}
                                name={option}
                                checked={isChecked(option)}
                                className={classes.checkBox}
                                size="small"
                            />
                        }
                    />
                ))}
            </FormGroup>
        </FormControl>
    ) : (
        <ZeroFilterChoicesMsg label={render("Header")} />
    );
}

//@ts-ignore
export function RadioSelectColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const [numFilterChoices, setNumFilterChoices] = useState<number>(null);
    const [radioValue, setRadioValue] = useState(filterValue || null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadioValue(event.target.value);
    };

    const classes = useFilterStyles();

    const isChecked = (value: string) => {
        return radioValue === value;
    };

    useEffect(() => {
        if (!radioValue) {
            setFilter(undefined);
        } else {
            setFilter(radioValue);
        }
    }, [radioValue]);

    useEffect(() => {
        // trying to catch resets and clears
        setRadioValue(filterValue || null);
    }, [filterValue]);

    const getOptionCounts = (opt: string, options: { [key: string]: number }) => {
        if (opt in options) {
            const counts = options[opt];
            return counts + 1;
        } else return 1;
    };

    const options = useMemo(() => {
        const options: { [key: string]: number } = {};
        preFilteredRows.forEach((row: any) => {
            let value = parseFieldValue(row.values[id]);
            if (value && value != "N/A") {
                if (value.includes("//")) {
                    let vals = value.split(" // ");
                    vals.forEach((v: string) => {
                        options[v] = getOptionCounts(v, options);
                    });
                } else {
                    options[value] = getOptionCounts(value, options);
                }
            }
        });
        return options;
    }, [id, preFilteredRows]);

    useEffect(() => {
        setNumFilterChoices(Object.keys(options).length);
    }, [options]);

    return numFilterChoices && numFilterChoices > 0 ? (
        <FormControl component="fieldset" className={`${classes.select} ${classes.formControl}`}>
            <FormLabel component="label" className={classes.formLabel}>
                {column.Header.toString()}
            </FormLabel>
            <RadioGroup onChange={handleChange}>
                {Object.keys(options).map((option, i) => (
                    <FormControlLabel
                        classes={{ label: classes.formControlLabel }}
                        key={i}
                        value={option}
                        label={
                            <Typography className={classes.formControlLabel}>
                                {option}&nbsp;&nbsp;&nbsp;
                                <Chip label={options[option]} className={classes.infoChip} size="small" />
                            </Typography>
                        }
                        control={
                            <Radio
                                name={option}
                                checked={isChecked(option)}
                                className={classes.checkBox}
                                size="small"
                            />
                        }
                    />
                ))}
            </RadioGroup>
        </FormControl>
    ) : (
        <ZeroFilterChoicesMsg label={render("Header")} />
    );
}

//@ts-ignore
export function TypeAheadSelectColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const [numFilterChoices, setNumFilterChoices] = useState<number>(null);
    const [selectedValues, setSelectedValues] = useState<string[]>(filterValue ? filterValue.split(",") : []);

    const classes = useFilterStyles();

    useEffect(() => {
        if (!selectedValues || selectedValues.length == 0) {
            setFilter(undefined);
        } else {
            setFilter(selectedValues.join());
        }
    }, [selectedValues]);

    useEffect(() => {
        // trying to catch resets and clears
        setSelectedValues(filterValue ? filterValue.split(",") : []);
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
        <Tooltip title="Select from list or start typing for suggestions" placement="right">
            <Autocomplete
                className={classes.select}
                options={options}
                classes={{ listbox: classes.selectListbox, option: classes.selectListbox }}
                id={id}
                selectOnFocus
                autoHighlight
                multiple
                limitTags={2}
                onChange={(event, newInputValue) => {
                    setSelectedValues([...newInputValue]);
                }}
                value={selectedValues || undefined}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={render("Header")}
                        variant="outlined"
                        margin="dense"
                        size="small"
                        placeholder={column.Header.toString()}
                    />
                )}
            />
        </Tooltip>
    ) : (
        <ZeroFilterChoicesMsg label={render("Header")} />
    );
}
