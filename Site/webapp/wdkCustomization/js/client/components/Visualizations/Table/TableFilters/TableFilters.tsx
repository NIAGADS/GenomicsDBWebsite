// credit to https://github.com/ggascoigne/react-table-example for all except global filer

import React, { useMemo, useState, useEffect } from "react";
import { countBy, merge } from "lodash";

import { Row, IdType, Column, useAsyncDebounce } from "react-table";

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/InputLabel";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";

import { Options } from "highcharts";
import HighchartsPlot from "@viz/Highcharts/HighchartsPlot";
import {
    addTitle,
    disableExport,
    applyCustomSeriesColor,
    backgroundTransparent,
} from "@viz/Highcharts/HighchartsOptions";
import { _color_blind_friendly_palettes as PALETTES } from "@viz/palettes";

import { toProperCase } from "genomics-client/util/util";
import { useFilterStyles, useGlobalFilterStyles } from ".";



// modeled after https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/filtering?file=/src/App.js
export function GlobalFilterFlat({ preGlobalFilteredRows, globalFilter, setGlobalFilter }: any) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    const classes = useGlobalFilterStyles();

    return (
        <>
        <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search table..."
              inputProps={{ "aria-label": "text search of table" }}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
            />
          </div>
        </>
    );
}

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

    const buildPlotOptions = () => {
        let plotOptions: Options = {
            tooltip: {
                pointFormat: "",
            },
        };

        plotOptions = merge(plotOptions, addTitle(toProperCase(id), { y: 40 }));
        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());
        return plotOptions;
    };

    const series = useMemo(() => {
        let values = new Array<String>(); // assumming pie filter is only for categorical values
        preFilteredRows.forEach((row: any) => {
            let value = row.values[id];
            //counts[num] = counts[num] ? counts[num] + 1 : 1;
            if (value) {
                if (value.includes("//")) {
                    let vals = value.split(" // ");
                    vals.forEach((v: string) => {
                        values.push(v);
                    });
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
            colorByPoint: true,
            allowPointSelect: true,
            dataLabels: {
                enabled: false,
            },
            cursor: "pointer",
            showInLegend: true,
            point: {
                events: { legendItemClick: () => false },
            },
            events: {
                click: function (e: any) {
                    setFilter(e.point.name || undefined);
                },
            },
        };
        return series;
    }, [id, preFilteredRows]);

    return (
        <>
            <HighchartsPlot data={{ series: series }} properties={{ type: "pie" }} plotOptions={buildPlotOptions()} />
        </>
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
    const classes = useFilterStyles();
    const options = useMemo(() => {
        const options = new Set<any>();
        preFilteredRows.forEach((row: any) => {
            let value = row.values[id];
            if (value) {
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

    return (
        <TextField
            select
            className={classes.select}
            label={render("Header")}
            value={filterValue || ""}
            variant="outlined"
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
    );
}

const getMinMax = (rows: Row[], id: IdType<any>) => {
    let min = rows.length ? rows[0].values[id] : 0;
    let max = rows.length ? rows[0].values[id] : 0;
    rows.forEach((row) => {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
    });
    return [min, max];
};

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
            variant="standard"
            onChange={handleChange}
            onBlur={(e) => {
                setFilter(e.target.value || undefined);
            }}
        />
    );
}
