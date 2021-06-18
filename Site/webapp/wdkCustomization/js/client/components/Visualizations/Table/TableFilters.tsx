// filters after https://github.com/ggascoigne/react-table-example

import React, { useMemo, useState, useEffect } from "react";
import { Row, IdType, FilterValue, Column } from "react-table";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";

/* export const filterTypes = {
    fuzzyText: fuzzyTextFilter,
    numeric: numericTextFilter,
} */
  

export function filterGreaterThan(rows: Array<Row<any>>, id: Array<IdType<any>>, filterValue: FilterValue) {
    return rows.filter((row) => {
        const rowValue = row.values[id[0]];
        return rowValue >= filterValue;
    });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val: any) => typeof val !== "number";

//@ts-ignore
export function SelectColumnFilter({ filterValue, render, setFilter, preFilteredRows, id }: Column) {
    const options = React.useMemo(() => {
        const options = new Set<any>();
        preFilteredRows.forEach((row: any) => {
            options.add(row.values[id]);
        });
        return [...Array.from(options.values())];
    }, [id, preFilteredRows]);

    return (
        <TextField
            select
            label={render("Header")}
            value={filterValue || ""}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
        >
            <MenuItem value={""}>All</MenuItem>
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
    const [min, max] = React.useMemo(() => getMinMax(preFilteredRows, id), [id, preFilteredRows]);
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
    const [min, max] = React.useMemo(() => getMinMax(preFilteredRows, id), [
      id,
      preFilteredRows
    ]);
    const focusedElement = useActiveElement();
    const hasFocus =
      focusedElement &&
      (focusedElement.id === `${id}_1` || focusedElement.id === `${id}_2`);
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
            paddingTop: 5
          }}
        >
          <TextField
            id={`${id}_1`}
            value={filterValue[0] || ""}
            type="number"
            onChange={(e) => {
              const val = e.target.value;
              setFilter((old: any[] = []) => [
                val ? parseInt(val, 10) : undefined,
                old[1]
              ]);
            }}
            placeholder={`Min (${min})`}
            style={{
              width: "70px",
              marginRight: "0.5rem"
            }}
          />
          to
          <TextField
            id={`${id}_2`}
            value={filterValue[1] || ""}
            type="number"
            onChange={(e) => {
              const val = e.target.value;
              setFilter((old: any[] = []) => [
                old[0],
                val ? parseInt(val, 10) : undefined
              ]);
            }}
            placeholder={`Max (${max})`}
            style={{
              width: "70px",
              marginLeft: "0.5rem"
            }}
          />
        </div>
      </>
    );
  }

  const findFirstColumn = <T extends Record<string, unknown>>(columns: Array<Column<T>>): Column<T> =>
    //@ts-ignore
    columns[0].columns ? findFirstColumn(columns[0].columns) : columns[0];

 export function DefaultColumnFilter<T extends Record<string, unknown>>({columns, column}:{columns: Column[], column: Column}) {
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
        label={render("Header")}
        InputLabelProps={{ htmlFor: id }}
        value={value}
        autoFocus={isFirstColumn}
        variant={"standard"}
        onChange={handleChange}
        onBlur={(e) => {
          setFilter(e.target.value || undefined);
        }}
      />
    );
  }