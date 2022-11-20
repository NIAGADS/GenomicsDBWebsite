import React, { useState } from "react";

import { useAsyncDebounce } from "react-table";

import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

import { useGlobalFilterStyles } from "@viz/Table/TableFilters";

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
