import React, { useState, useCallback } from "react";

import { useTableStyles } from "@viz/Table";
import { FilterPageProps, GlobalFilterFlat } from "@viz/Table/TableFilters";
import { SelectColumnsDialog, FilterDialog, MemoTableHelpDialog as TableHelpDialog } from "@viz/Table/TableSections";

import { StyledTooltip as Tooltip, MaterialUIThemedButton as BlueButton } from "@components/MaterialUI";

import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import FilterIcon from "@material-ui/icons/FilterList";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/GetApp";

interface PanelOptions {
    toggle: any;
    label: string;
    tooltip?: string;
}

interface DialogOptions extends Omit<PanelOptions, "toggle"> {
    options?: any;
}

interface TableToolbar {
    filter?: { hasGlobalFilter: boolean; advancedFilter: DialogOptions };
    columnsDialog?: DialogOptions;
    canExport?: boolean;
    linkedPanel?: PanelOptions;
}

export const TableToolbar: React.FC<TableToolbar & FilterPageProps> = ({
    instance,
    canExport = true,
    linkedPanel,
    columnsDialog,
    filter,
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const [columnsDialogIsOpen, setColumnsDialogIsOpen] = useState<boolean>(false);
    const [filterDialogIsOpen, setFilterDialogIsOpen] = useState<boolean>(false);
    const [helpDialogIsOpen, setHelpDialogIsOpen] = useState<boolean>(false);
    const tClasses = useTableStyles();

    const hasGlobalFilter = filter.hasGlobalFilter === null ? false : filter.hasGlobalFilter;

    const closeFilterDialog = () => {
        setFilterDialogIsOpen(false);
    };

    const closeColumnsDialog = () => {
        setColumnsDialogIsOpen(false);
    };

    const closeHelpDialog = () => {
        setHelpDialogIsOpen(false);
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

                {columnsDialog !== null && (
                    <Box mr={1} ml={1}>
                        <Button
                            variant="text"
                            color="primary"
                            startIcon={<ViewColumnIcon />}
                            onClick={() => {
                                setColumnsDialogIsOpen(true);
                            }}
                            title="Set visible columns."
                        >
                            Columns
                        </Button>
                    </Box>
                )}

                {filter.advancedFilter !== null && (
                    <Box mr={1} ml={1}>
                        <Button
                            variant="text"
                            color="primary"
                            startIcon={<FilterIcon />}
                            onClick={() => {
                                setFilterDialogIsOpen(true);
                            }}
                            title="View advanced filters."
                        >
                            Filter
                        </Button>
                    </Box>
                )}
                <Box mr={1} ml={1}>
                    <BlueButton
                        variant="text"
                        color="primary"
                        onClick={() => {
                            setHelpDialogIsOpen(true);
                        }}
                        title="Learn about searching, filtering, and modifying this table."
                    >
                        <InfoIcon />
                    </BlueButton>
                </Box>
            </Toolbar>
            {columnsDialog !== null && (
                <SelectColumnsDialog
                    isOpen={columnsDialogIsOpen}
                    handleClose={closeColumnsDialog}
                    instance={instance}
                    requiredColumns={columnsDialog.options.requiredColumns}
                />
            )}
            {filter.advancedFilter !== null && (
                <FilterDialog
                    isOpen={filterDialogIsOpen}
                    handleClose={closeFilterDialog}
                    instance={instance}
                    filterGroups={filter.advancedFilter.options.filterGroups}
                    includeChips={false}
                />
            )}
            <TableHelpDialog
                isOpen={helpDialogIsOpen}
                handleClose={closeHelpDialog}
                canAddColumns={columnsDialog !== null}
                hasLinkedPanel={linkedPanel !== null}
                canFilter={filter.advancedFilter !== null}
            />
        </>
    );
};
