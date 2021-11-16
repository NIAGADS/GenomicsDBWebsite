import React from "react";

import Paper from "@material-ui/core/Paper";
import FilterListIcon from "@material-ui/icons/FilterList";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import DownloadIcon from "@material-ui/icons/GetApp";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from ".";

interface FilterToolbarProps {
    canFilter: boolean;
    showAdvancedFilter: boolean;
    showHideColumns: boolean;
}
export const FilterToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({
    canFilter,
    showAdvancedFilter,
    showHideColumns,
    instance,
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const classes = useFilterStyles();
    return (
        <Paper component="form" className={classes.paper}>
            <Toolbar>
                {canFilter && (
                    <GlobalFilterFlat
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                )}

                {canFilter && showAdvancedFilter && (
                    <IconButton aria-label="open advanced table filter">
                        <FilterListIcon />
                    </IconButton>
                )}
                {showHideColumns && (
                    <IconButton aria-label="open show / hide columns selector">
                        <PlaylistAddIcon />
                    </IconButton>
                )}
                <IconButton aria-label="download table data">
                    <DownloadIcon />
                </IconButton>
            </Toolbar>
        </Paper>
    );
};
