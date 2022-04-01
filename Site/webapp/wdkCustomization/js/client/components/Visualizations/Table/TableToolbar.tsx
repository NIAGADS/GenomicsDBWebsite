import React, { useState } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from "./TableFilters";
import { withHtmlTooltip } from "@components/MaterialUI";
import { TablePagination } from ".";

interface FilterToolbarProps {
    canFilter: boolean;
}
export const TableToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({
    canFilter,
    instance
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;


    const classes = useFilterStyles();

    return (
        <>
            {canFilter && (
                <GlobalFilterFlat
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            )}
            <TablePagination instance={instance} />
            {/* span is b/c button is disabled, allows tooltip to fire */}
            {withHtmlTooltip(
                <span><IconButton aria-label="download table data" disabled={true}>
                    <DownloadIcon />
                </IconButton></span>, 
                "Download Coming Soon"
            )}
        </>
    );
};
