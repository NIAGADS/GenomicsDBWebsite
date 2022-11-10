import React, { useMemo, useState, useEffect } from "react";
import { chain } from "lodash";
import { Column } from "react-table";

import { negLog10p, getMinMaxNegLog10PValue, invertNegLog10p } from "../filters/negLog10pFilter";
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

const useStyles = makeStyles({});

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
    const [ isValid, setIsValid ] = useState<boolean>(true);
    const [ value, setValue ] = useState<string>(null);
    const [min, max] = useMemo(() => getMinMaxNegLog10PValue(preFilteredRows, id, MAX_ALLOWABLE_PVALUE), [id]);
    const classes = useStyles();

    const [currentFilterValue, setFilterValue] = useState(
        filterValue === undefined ? DEFAULT_FILTER_VALUE : negLog10p(filterValue)
    ); // catch clear filters

    // only want to do these once
    useEffect(() => {
        setFilter(invertNegLog10p(currentFilterValue));
    }, [currentFilterValue]);

    useEffect(() => {
        if (isValid) {setFilter(invertNegLog10p(value));}
    } ,[isValid]);
    

    useEffect(() => {
        if (value.includes('e') && !value.includes('-')) {
            setIsValid(false);
        }
        else if (value.includes('-') && !value.includes('e')) {
            setIsValid(false);
        }
        else if (!value.includes('e-') && (parseFloat(value) >= 1.0 || parseFloat(value) <= 0.0)) {
            setIsValid(false);
        }
        // TODO -- add min max range
        setIsValid(true);
        
    }, [value]);

    const parseInputText = (text: string) => {
        text = text.replace(/\s/g, ''); // strip spaces
        text.toLowerCase(); // E -> e
        return text;
    }

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
                onChange={(event:any) => {
                  setValue(parseInputText(event.target.value))
                }} 
                error={isValid}
                helperText={!isValid ? "Please specify p-value in the range (0, 1) in decimal (0.0001) or E-notation (1e-4) format": null}
                defaultValue={invertNegLog10p(currentFilterValue)}
                fullWidth={true}
            />
        </Box>
    );
}

const _extractValues = (preFilteredRows: any, id: string) => {
    let count = 0;
    return chain(preFilteredRows)
        .map((row) => {
            let neglog10p = negLog10p(row.values[id]);
            if (neglog10p > 15) {
                neglog10p = 15;
            }
            return neglog10p;
        })
        .value();
};
