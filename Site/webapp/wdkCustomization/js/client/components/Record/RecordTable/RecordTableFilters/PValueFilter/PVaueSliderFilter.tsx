import React, { useMemo, useState, useEffect } from "react";
import { chain } from "lodash";
import { Column } from "react-table";

import { negLog10p, getMinMaxNegLog10PValue, invertNegLog10p } from "../filters/negLog10pFilter";

import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const DEFAULT_FILTER_VALUE = negLog10p(5e-8);
const MAX_ALLOWABLE_PVALUE = 15;
const MIN_ALLOWABLE_PVALUE = 0;

const useStyles = makeStyles({
    root: {
      width: 300,
      padding: "2px"
    },
    valueLabel: {
        fontSize: "0.5rem"
    }
  });
  

//@ts-ignore
export function PValueSliderFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows, target } = column;
    const [min, max] = useMemo(() => getMinMaxNegLog10PValue(preFilteredRows, id, MAX_ALLOWABLE_PVALUE), [id]);
    const classes = useStyles();

    const [currentFilterValue, setFilterValue] = useState(
        filterValue === undefined ? DEFAULT_FILTER_VALUE : negLog10p(filterValue)
    ); // catch clear filters

    const marks = [
        {
            value: 0,
            label: "0",
        },
        {
            value: 3,
            label: "1e⁻³",
        },
       /* {
            value: 6,
            label: "1e⁻⁶",
        }, */
        {
            value: 7.3,
            label: "5e⁻⁸",
        },
        {
            value: 15,
            label: "<1e⁻¹⁵",
        },
    ];

    // only want to do these once
    useEffect(() => {
        setFilter(invertNegLog10p(currentFilterValue));
    }, [currentFilterValue]);

    function ariaValueText(value: number) {
        return `${invertNegLog10p(value)}`;
    }

    return (
        <Box className={classes.root}>
            <Typography id="pvalue-filter" gutterBottom>
                p-value
            </Typography>
            <Slider
                classes={{valueLabel : classes.valueLabel}}
                color="secondary"
                track="inverted"
                aria-labelledby="pvalue-filter"
                getAriaValueText={ariaValueText}
                getAriaLabel={ariaValueText}
                defaultValue={7.3}
                marks={marks}
                min={MIN_ALLOWABLE_PVALUE}
                max={MAX_ALLOWABLE_PVALUE}
                valueLabelFormat={ariaValueText}
                valueLabelDisplay="on"
                step={0.1}
                onChange={(e, v) => {
                    setFilter(invertNegLog10p(v));
                }}
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
