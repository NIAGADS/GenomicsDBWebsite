// modified from https://github.com/ggascoigne/react-table-example
// @xts-nocheck -- react-table type issues / should be fixed in v8
import React, { MouseEvent, MouseEventHandler, PropsWithChildren, ReactElement, useCallback, useState } from "react";

import Paper from "@material-ui/core/Paper";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SearchIcon from "@material-ui/icons/Search";
import ViewColumnsIcon from "@material-ui/icons/ViewColumn";
import FilterListIcon from "@material-ui/icons/FilterList";

import { TableInstance } from "react-table";

import { TableMouseEventHandler } from "./TableTypes";
import { HideColumnPage } from "./HideColumnPage";
import FilterPanel from "./TableFilters/FilterPanel";
import { GlobalFilter } from "./TableFilters/TableFilters";
import { useFilterPanelStyles } from "./TableFilters/FilterPanelStyles";

type InstanceActionButton = {
    instance: TableInstance;
    visible?: boolean;
    onClick?: any;
};

type ActionButton = {
    visible?: boolean;
    onClick?: MouseEventHandler;
    className: string;
};

const AddRemoveColumnButton = ({ instance, visible, onClick }: InstanceActionButton): ReactElement => {
    const classes = useFilterPanelStyles();
    return visible ? (
        <>
            <Divider className={classes.divider} orientation="vertical" />
            <Tooltip title="Add or remove columns" aria-label="Add or remove columns">
                <IconButton className={classes.iconButton} aria-label="add-remove-columns" onClick={onClick(instance)}>
                    <ViewColumnsIcon />
                </IconButton>
            </Tooltip>
        </>
    ) : null;
    return <></>;
};

const ToggleAdvancedFiltersButton = ({ visible, onClick }: ActionButton): ReactElement => {
    const classes = useFilterPanelStyles();
    return visible ? (
        <>
            <Divider className={classes.divider} orientation="vertical" />
            <Tooltip title="Toggle advanced filter panel" aria-label="Toggle advanced filter panel">
                <IconButton className={classes.iconButton} aria-label="advanced-filters" color="primary">
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </>
    ) : null;
};

type TableToolbarProps = {
    instance: TableInstance;
    showAdvancedFilter: boolean;
    showHideColumns: boolean;
    canFilter: boolean;
};

export default function TableToolbar({
    instance,
    showAdvancedFilter,
    showHideColumns,
    canFilter,
}: PropsWithChildren<TableToolbarProps>): ReactElement | null {
    //@ts-ignore
    const { columns, preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const classes = useFilterPanelStyles();
    const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined);
    const [columnsOpen, setColumnsOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const handleColumnsClick = useCallback(
        (event: MouseEvent) => {
            setAnchorEl(event.currentTarget);
            setColumnsOpen(true);
        },
        [setAnchorEl, setColumnsOpen]
    );

    const handleClose = useCallback(() => {
        setColumnsOpen(false);
        setAnchorEl(undefined);
    }, []);

    return (
        <>
            <Paper component="form" className={classes.root}>
                {canFilter && (
                    <>
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                        <ToggleAdvancedFiltersButton className={classes.iconButton} visible={showAdvancedFilter} />
                    </>
                )}

                <AddRemoveColumnButton visible={showHideColumns} instance={instance} onClick={handleColumnsClick} />
            </Paper>
            {showHideColumns && (
                <HideColumnPage instance={instance} onClose={handleClose} show={columnsOpen} anchorEl={anchorEl} />
            )}
        </>
    );
}
