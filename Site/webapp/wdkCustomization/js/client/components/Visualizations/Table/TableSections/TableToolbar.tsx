import React, { useState, useCallback } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";

import { useTableStyles } from "@viz/Table";
import { FilterPageProps, GlobalFilterFlat } from "@viz/Table/TableFilters";
import { SelectColumnsDialog } from "@viz/Table/TableSections";

import { StyledTooltip as Tooltip, HelpIcon } from "@components/MaterialUI";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";

interface PanelOptions {
    toggle: any;
    label: string;
    tooltip?: string;
}

interface DialogOptions extends Omit<PanelOptions, "toggle"> {
    options?: any;
}

interface TableToolbar {
    canAdvancedFilter?: boolean;
    columnsDialog?: DialogOptions;
    hasGlobalFilter: boolean;
    canExport?: boolean;
    linkedPanel?: PanelOptions;
}

export const TableToolbar: React.FC<TableToolbar & FilterPageProps> = ({
    instance,
    canExport = true,
    linkedPanel,
    columnsDialog,
    hasGlobalFilter,
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const [columnsDialogIsOpen, setColumnsDialogIsOpen] = useState<boolean>(false);
    const tClasses = useTableStyles();

    const closeColumnsDialog = () => {
        setColumnsDialogIsOpen(false);
    };

    return (
        <>
            <Toolbar variant="dense" disableGutters style={{ display: "flex", justifyContent: "flex-end" }}>
                {hasGlobalFilter && (
                    <GlobalFilterFlat
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                )}

                {linkedPanel && (
                    <Box mr={1} ml={2}>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        linkedPanel.toggle(event.target.checked)
                                    }
                                />
                            }
                            label={linkedPanel.label}
                            title={`Toggle to reveal or hide ${linkedPanel.label} explorer`}
                        />
                    </Box>
                )}

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

                {columnsDialog && (
                    <Box mr={1} ml={1}>
                        <Button
                            variant="text"
                            color="primary"
                            startIcon={<ViewColumnIcon />}
                            onClick={() => {
                                setColumnsDialogIsOpen(true);
                            }}
                            title="Set visible columns"
                        >
                            Columns
                        </Button>
                    </Box>
                )}
            </Toolbar>
            <SelectColumnsDialog
                isOpen={columnsDialogIsOpen}
                handleClose={closeColumnsDialog}
                instance={instance}
                requiredColumns={columnsDialog.options.requiredColumns}
            />
        </>
    );
};
