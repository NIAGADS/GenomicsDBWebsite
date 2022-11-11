import React, { useMemo, useState, useEffect } from "react";
import { chain } from "lodash";
import { Column } from "react-table";

import { getMinMaxNegLog10PValue } from "../filters/negLog10pFilter";
import { DEFAULT_FILTER_VALUE } from "../PValueFilter";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PinDropIcon from "@material-ui/icons/PinDrop";
import { theme } from "genomics-client/components/MaterialUI";
import TextField from "@material-ui/core/TextField";

const MAX_ALLOWABLE_PVALUE = 15;
const MIN_ALLOWABLE_PVALUE = 1;

//@ts-ignore
export function PValueThresholdFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows, target } = column;
    const [isValid, setIsValid] = useState<boolean>(false);
    const [value, setValue] = useState<string>(null);
    const [validValueKey, setValidValueKey] = useState<string>(null); // handle update for sequential valid values
    const [min, max] = useMemo(() => getMinMaxNegLog10PValue(preFilteredRows, id, MAX_ALLOWABLE_PVALUE), [id]);

    const [currentFilterValue, setFilterValue] = useState<string>(
        filterValue === undefined ? DEFAULT_FILTER_VALUE.toString() : filterValue.toString()
    ); // catch clear filters

    // only want to do these once
    useEffect(() => {
        //setFilter(invertNegLog10p(currentFilterValue));
        setValue(currentFilterValue);
    }, [currentFilterValue]);

    useEffect(() => {
        setIsValid(validateValue(value));
    }, [value]);

    useEffect(() => {
        // basically handle situations where isValid does not change, but value does
        // want to submit new filter value when value is valid, so need to catch series of valid values
        setValidValueKey(isValid.toString() + "_" + value);
    }, [isValid, value]);

    useEffect(() => {
        if (isValid) {
            setFilter(value);
        }
    }, [validValueKey]);

    const validateValue = (value: string) => {
        if (!value) {
            return false;
        }

        const eNotationRegex = /\d+e-\d+/g;
        if (value.includes("e")) {
            if (value.match(eNotationRegex) != null) {
                return true;
            } else {
                return false;
            }
        }

        if (parseFloat(value) >= 1.0 || parseFloat(value) <= 0.0) {
            return false;
        }
        // TODO -- add min max range
        return true;
    };

    const parseInputText = (text: string) => {
        if (text === null) {
            text = "0";
        }
        text = text.replace(/\s/g, ""); // strip spaces
        text.toLowerCase(); // E -> e
        if (!text.includes('e')) {
            if (parseFloat(text) < 0.009) {
                text = parseFloat(text).toExponential().toString();
            }
        }
        return text;
    };

    return (
        <Box>
            <TextField
                id="outlined-number"
                label="P-value"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                size="small"
                onChange={(event: any) => {
                    setValue(parseInputText(event.target.value));
                }}
                error={!isValid}
                helperText={
                    !isValid
                        ? "Please specify p-value in the range (0, 1) in decimal (0.0001) or E-notation (1e-4) format"
                        : null
                }
                defaultValue={currentFilterValue}
                fullWidth={true}
            />
        </Box>
    );
}
