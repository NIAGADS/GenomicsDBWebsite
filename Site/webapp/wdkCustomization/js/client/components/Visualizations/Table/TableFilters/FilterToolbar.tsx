import React, { useState } from "react";

import Paper from "@material-ui/core/Paper";
import FilterListIcon from "@material-ui/icons/FilterList";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import DownloadIcon from "@material-ui/icons/GetApp";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from ".";
import { withHtmlTooltip } from "@components/MaterialUI";

interface FilterToolbarProps {
    canFilter: boolean;
    hasAdvancedFilter: boolean;
    hasHideColumns: boolean;
    onToggleFilterPanel?: any;
    onToggleColumnPanel?: any;
}
export const FilterToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({
    canFilter,
    hasAdvancedFilter,
    hasHideColumns,
    instance,
    onToggleFilterPanel,
    onToggleColumnPanel,
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showColumnPanel, setShowColumnPanel] = useState(false);

    const classes = useFilterStyles();

    function toggleFilterPanel(status: boolean) {
        setShowFilterPanel(status);
        onToggleFilterPanel(status);
    }

    function toggleColumnPanel(status: boolean) {
        setShowColumnPanel(status);
        onToggleColumnPanel(status);
    }

    return (
        <Paper component="form" className={classes.paper}>
            {canFilter && (
                <GlobalFilterFlat
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            )}

            <Toolbar>
                {canFilter &&
                    hasAdvancedFilter &&
                    withHtmlTooltip(
                        <ToggleButton
                            aria-label="open or hide advanced table filters"
                            value="advanced-filter"
                            color="primary"
                            selected={showFilterPanel}
                            onChange={() => {
                                toggleFilterPanel(!showFilterPanel);
                            }}
                        >
                            <FilterListIcon />
                        </ToggleButton>,
                        "Show/Hide advanced filtering options"
                    )}

                {hasHideColumns &&
                    withHtmlTooltip(
                        <ToggleButton
                            aria-label="open show / hide columns selector"
                            value="column"
                            color="secondary"
                            selected={showColumnPanel}
                            onChange={() => {
                                toggleColumnPanel(!showColumnPanel);
                            }}
                        >
                            <PlaylistAddIcon />
                        </ToggleButton>,
                        "Add or remove columns from the table"
                    )}

                {withHtmlTooltip(
                    <IconButton aria-label="download table data" >
                        <DownloadIcon />
                    </IconButton>,
                    "Download (filtered) table data"
                )}
            </Toolbar>

            {/*<Toolbar>
                {canFilter &&
                    hasAdvancedFilter &&
                    withHtmlTooltip(
                        <IconButton aria-label="open advanced table filter" onClick={onShowFilterPanel}>
                            <FilterListIcon />
                        </IconButton>,
                        "Show advanced filtering options"
                    )}

                {hasHideColumns &&
                    withHtmlTooltip(
                        <IconButton aria-label="open show / hide columns selector" onClick={onShowColumnPanel}>
                            <PlaylistAddIcon />
                        </IconButton>,
                        "Add or remove columns from the table"
                    )}

            
                </Toolbar>*/}
        </Paper>
    );
};
