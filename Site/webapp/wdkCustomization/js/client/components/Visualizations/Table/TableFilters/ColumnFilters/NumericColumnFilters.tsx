import React, { useMemo, useState, useEffect } from "react";

import { Row, IdType, Column } from "react-table";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";

import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import { StyledTooltip as Tooltip } from "@components/MaterialUI";

const getMinMax = (rows: Row[], id: IdType<any>) => {
    let min = rows.length ? rows[0].values[id] : 0;
    let max = rows.length ? rows[0].values[id] : 0;
    rows.forEach((row) => {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
    });
    return [min, max];
};

// This is a custom UI for  'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two

const useActiveElement = () => {
    const [active, setActive] = useState(document.activeElement);

    const handleFocusIn = () => {
        setActive(document.activeElement);
    };

    useEffect(() => {
        document.addEventListener("focusin", handleFocusIn);
        return () => {
            document.removeEventListener("focusin", handleFocusIn);
        };
    }, []);

    return active;
};

// credit to https://github.com/ggascoigne/react-table-example
// @ts-ignore
export function NumberRangeColumnFilter({ filterValue = [], render, setFilter, preFilteredRows, id }: Column) {
    const [min, max] = useMemo(() => getMinMax(preFilteredRows, id), [id, preFilteredRows]);
    const focusedElement = useActiveElement();
    const hasFocus = focusedElement && (focusedElement.id === `${id}_1` || focusedElement.id === `${id}_2`);
    return (
        <>
            <InputLabel htmlFor={id} shrink focused={!!hasFocus}>
                {render("Header")}
            </InputLabel>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    paddingTop: 5,
                }}
            >
                <TextField
                    id={`${id}_1`}
                    value={filterValue[0] || ""}
                    type="number"
                    onChange={(e) => {
                        const val = e.target.value;
                        setFilter((old: any[] = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
                    }}
                    placeholder={`Min (${min})`}
                    style={{
                        width: "70px",
                        marginRight: "0.5rem",
                    }}
                />
                to
                <TextField
                    id={`${id}_2`}
                    value={filterValue[1] || ""}
                    type="number"
                    onChange={(e) => {
                        const val = e.target.value;
                        setFilter((old: any[] = []) => [old[0], val ? parseInt(val, 10) : undefined]);
                    }}
                    placeholder={`Max (${max})`}
                    style={{
                        width: "70px",
                        marginLeft: "0.5rem",
                    }}
                />
            </div>
        </>
    );
}

export function NumberThresholdColumnFilter<T extends Record<string, unknown>>({
    columns,
    column,
    minValue,
    maxValue,
    defaultValue,
    errorMsg,
    validator,
    helpText,
}: {
    columns: Column[];
    column: Column;
    minValue?: number;
    maxValue?: number;
    defaultValue: number;
    errorMsg?: string;
    helpText: string;
    validator?: (value: string) => boolean;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows, target } = column;
    const [isValid, setIsValid] = useState<boolean>(true);
    const [value, setValue] = useState<string>(null);
    // const [validValueKey, setValidValueKey] = useState<string>(null); // handle update for sequential valid values
    const [currentFilterValue, setFilterValue] = useState<string>(
        //filterValue === undefined ? defaultValue.toString() : filterValue.toString()
        filterValue === undefined ? undefined : filterValue.toString()
    ); // catch clear filters

    const rangeMin = minValue != null ? minValue : 0;
    const rangeMax = maxValue != null ? maxValue : 1.0;

    const eMsg = errorMsg
        ? errorMsg
        : "Please specify p-value in the range (" +
          rangeMin.toString() +
          "," +
          rangeMax.toString() +
          "] in decimal (0.0001) or E-notation (1e-4) format";

    // only want to do these once
    useEffect(() => {
        setValue(currentFilterValue);
    }, [currentFilterValue]);

    /*useEffect(() => {
        setIsValid(validator ? validator(value) : validateValue(value));
    }, [value]); */

    const handleApplyClick = () => {
        //setIsValid(validator ? validator(value) : validateValue(value));
        const valueIsValid = validator ? validator(value) : validateValue(value);
        if (valueIsValid) {
            setFilter(value);
        }
        setIsValid(valueIsValid);
    };

    /* useEffect(() => {
        // basically handle situations where isValid does not change, but value does
        // want to submit new filter value when value is valid, so need to catch series of valid values
        setValidValueKey(isValid.toString() + "_" + value === undefined ? "null" : value);
    }, [isValid, value]); */

    /*useEffect(() => {
        if (isValid) {
            setFilter(value);
        }
    }, [isValid]);*/

    const validateValue = (value: string) => {
        if (!value) {
            return true;
        }

        if (parseFloat(value) > rangeMax || parseFloat(value) <= rangeMin) {
            return false;
        }

        return true;
    };

    const parseInputText = (text: string) => {
        if (text === null) {
            text = "0";
        }
        text = text.replace(/\s/g, ""); // strip spaces
        text.toLowerCase(); // E -> e
        if (!text.includes("e")) {
            if (parseFloat(text) < 0.009) {
                text = parseFloat(text).toExponential().toString();
            }
        }
        return text;
    };

    return (
        <>
            <FormControl variant="outlined">
                <InputLabel htmlFor="threshold-filter">{column.Header.toString()}</InputLabel>
                <OutlinedInput
                    id={`${column.id}-threshold-filter-input`}
                    margin="dense"
                    onChange={(event: any) => {
                        setValue(parseInputText(event.target.value));
                    }}
                    error={!isValid}
                    defaultValue={currentFilterValue}
                    fullWidth={true}
                    endAdornment={
                        <InputAdornment position="end">
                            <Tooltip title={helpText}>
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="text"
                                    aria-label="apply filter"
                                    onClick={handleApplyClick}
                                >
                                    Apply
                                </Button>
                            </Tooltip>
                        </InputAdornment>
                    }
                    label={column.Header.toString()}
                />
                {!isValid && (
                    <FormHelperText className="red" id="error-msg-text">
                        {eMsg}
                    </FormHelperText>
                )}
            </FormControl>
        </>
    );
}

//@ts-ignore
export function SliderColumnFilter({ filterValue, render, setFilter, preFilteredRows, id }: Column) {
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
                label={render("Header")}
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
