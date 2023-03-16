import React, { useState, useCallback } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";

import { useTableStyles } from "@viz/Table";
import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from "@viz/Table/TableFilters";
import { TablePagination } from "@viz/Table/TableSections";

import { StyledTooltip as Tooltip, HelpIcon } from "@components/MaterialUI";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

interface PanelOptions {
    toggle: any;
    label: string;
    tooltip?: string;
}

interface FilterToolbarProps {
    canAdvancedFilter?: boolean;
    columnsPanel?: PanelOptions;
    hasGlobalFilter: boolean;
    canExport?: boolean;
    linkedPanel?: PanelOptions;
}

export const TableToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({
    instance,
    canExport = true,
    linkedPanel,
    columnsPanel,
    hasGlobalFilter
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    // const [linkedPanelIsOpen, setLinkedPanelIsOpen] = useState(false);
    const classes = useFilterStyles();
    const tClasses = useTableStyles();

    const _toggleLinkedPanel = useCallback(
        (toggleState: boolean) => {
            linkedPanel && linkedPanel.toggle(toggleState);
            // setLinkedPanelIsOpen(!linkedPanelIsOpen);
        },
        [linkedPanel]
    );

    const _toggleColumnsPanel = useCallback((toggleState: boolean) => {
        alert("toggle columns");
        //linkedPanel && linkedPanel.toggle(toggleState);
        // setLinkedPanelIsOpen(!linkedPanelIsOpen);
    }, []);

    return (
        <AppBar position="static" elevation={0} className={tClasses.navigationToolbar}>
            <Toolbar variant="dense" disableGutters>
                {/* span is b/c button is disabled, allows tooltip to fire */}
                {canExport && (
                    <Tooltip title="Table downloads coming soon" aria-label="table downloads coming soon/disabled">
                        <span>
                            <Button
                                startIcon={<DownloadIcon />}
                                variant="text"
                                color="primary"
                                aria-label="download table data"
                                disabled={true}
                            >
                                Export
                            </Button>
                        </span>
                    </Tooltip>
                )}

                {hasGlobalFilter && (
                    <GlobalFilterFlat
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                )}

                <TablePagination instance={instance} />

                {linkedPanel && (
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={false}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        _toggleLinkedPanel(event.target.checked)
                                    }
                                />
                            }
                            label={linkedPanel.label}
                        />
                        <HelpIcon tooltip={`Toggle to reveal or hide ${linkedPanel.label} explorer`}></HelpIcon>
                    </Box>
                )}

                {columnsPanel && (
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={false}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        _toggleColumnsPanel(event.target.checked)
                                    }
                                />
                            }
                            label={columnsPanel.label}
                        />
                        <HelpIcon tooltip={``}></HelpIcon>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};
