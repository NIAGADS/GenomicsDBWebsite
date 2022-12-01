// modeled after https://github.com/ggascoigne/react-table-example
import React, { useMemo, useState, useEffect } from "react";

import { Column } from "react-table";

import Box from "@material-ui/core/Box";
import { useFilterStyles, ZeroFilterChoicesMsg } from "@viz/Table/TableFilters";
import { ComingSoonAlert } from "@components/MaterialUI";


export function TissueColumnFilter<T extends Record<string, unknown>>({
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
        <ComingSoonAlert message={`Filter by ${column.Header.toString()} coming soon.`}/>
    );
}
