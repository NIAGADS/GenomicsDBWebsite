// credit to https://github.com/ggascoigne/react-table-example for all except global filer

import React, { useMemo, useState, useEffect } from "react";
import { countBy, merge, isObject } from "lodash";

import { Row, IdType, Column, useAsyncDebounce } from "react-table";

import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import SearchIcon from "@material-ui/icons/Search";

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

/* note currently assumes spans for colored text */
const extractObjectDisplayText = (obj: any) => {
    return (obj as { displayText: string }).displayText
        ? (obj as { displayText: string }).displayText
        : obj.value
        ? obj.value
        : obj.props && obj.props.children
        ? obj.props.chilren
        : "";
};

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
    series,
    options,
    title,
}: {
    columns: Column[];
    column: Column;
    series?: any;
    options?: any;
    title?: string;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows } = column;
    const classes = useFilterStyles();

    const buildPlotOptions = () => {
        let plotOptions: Options = {
            plotOptions: {
                pie: {
                    center: ["50%", "50%"], // draws pie on left
                    size: 80,
                },
            },
            tooltip: {
                pointFormat: "",
            },
            legend: {
                align: "right",
                verticalAlign: "middle",
                layout: "vertical",
                title: {
                    text: title ? title : toProperCase(id),
                    style: { fontSize: "12px" },
                },
                itemStyle: { color: "black", fontSize: "12px", fontWeight: "normal", width: 100 },
                itemHoverStyle: { color: "#ffc665" },
            },
        };

        plotOptions = merge(plotOptions, addTitle(null));
        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());

        if (options) {
            plotOptions = merge(plotOptions, options);
        }

        return plotOptions;
    };

    const _buildSeriesData = () => {
        let values = new Array<String>(); // assumming pie filter is only for categorical values
        preFilteredRows.forEach((row: any) => {
            let value = row.values[id];
            //counts[num] = counts[num] ? counts[num] + 1 : 1;
            if (value) {
                if (value) {
                    if (isObject(value)) {
                        let valueText = extractObjectDisplayText(value);
                        if (valueText != "n/a") {
                            values.push(value);
                        }
                    } else if (value.includes("//")) {
                        let vals = value.split(" // ");
                        vals.forEach((v: string) => {
                            values.push(v);
                        });
                    } else {
                        values.push(value);
                    }
                }
            }
        });

        let data: any = [];
        let counts = countBy(values);
        for (const id of Object.keys(counts)) {
            data.push({ name: id, y: counts[id] });
        }

        return data;
    };

    series = useMemo(() => {
        series ? series : { name: id, data: _buildSeriesData() };
        const seriesOptions = {
            colorByPoint: true,
            allowPointSelect: true,
            dataLabels: {
                enabled: false,
            },
            cursor: "pointer",
            showInLegend: true,
            point: {
                events: {
                    legendItemClick: function () {
                        //@ts-ignore
                        //setFilter(this.name || undefined);
                        return false;
                    },
                },
            },
            events: {
                click: function (e: any) {
                    setFilter(e.point.name || undefined);
                },
            },
        };

        series = merge(series, seriesOptions);
        return series;
    }, [id, preFilteredRows]);

    return (
        <>
            <HighchartsPlot
                data={{ series: series }}
                properties={{ type: "pie" }}
                plotOptions={buildPlotOptions()}
                containerProps={{ className: classes.pieChartContainer }}
            />
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
                if (isObject(value)) {
                    let valueText = extractObjectDisplayText(value);
                    if (valueText != "n/a") {
                        options.add(value);
                    }
                } else if (value.includes("//")) {
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

export function NumberThresholdFilter<T extends Record<string, unknown>>({
    columns,
    column,
    minValue,
    maxValue,
    defaultValue,
    errorMsg,
    validator,
}: {
    columns: Column[];
    column: Column;
    minValue?: number;
    maxValue?: number;
    defaultValue: number;
    errorMsg?: string;
    validator?: (value: string) => boolean;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows, target } = column;
    const [isValid, setIsValid] = useState<boolean>(false);
    const [value, setValue] = useState<string>(null);
    const [validValueKey, setValidValueKey] = useState<string>(null); // handle update for sequential valid values

    const rangeMin = minValue != null ? minValue : 0;
    const rangeMax = maxValue != null ? maxValue : 1.0;

    const eMsg = errorMsg
        ? errorMsg
        : "Please specify p-value in the range (" +
          rangeMin.toString() +
          "," +
          rangeMax.toString() +
          ") in decimal (0.0001) or E-notation (1e-4) format";

    const [currentFilterValue, setFilterValue] = useState<string>(
        filterValue === undefined ? defaultValue.toString() : filterValue.toString()
    ); // catch clear filters

    // only want to do these once
    useEffect(() => {
        setValue(currentFilterValue);
    }, [currentFilterValue]);

    useEffect(() => {
        setIsValid(validator ? validator(value) : validateValue(value));
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

        if (parseFloat(value) >= rangeMax || parseFloat(value) <= rangeMin) {
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
                helperText={!isValid ? eMsg : null}
                defaultValue={currentFilterValue}
                fullWidth={true}
            />
        </>
    );
}
