import React, { useState, useEffect } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from "@viz/Table/TableFilters";
import { TablePagination } from "@viz/Table/TableSections";

import { StyledTooltip as Tooltip, HelpIcon } from "@components/MaterialUI";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

interface PanelOptions {
    toggle: any;
    label: string;
}

interface FilterToolbarProps {
    canFilter: boolean;
    canExport?: boolean;
    hasLinkedPanel?: boolean;
    linkedPanelOptions?: PanelOptions;
}

export const TableToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({
    canFilter,
    instance,
    canExport = true,
    hasLinkedPanel = false,
    linkedPanelOptions
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const [linkedPanelIsOpen, setLinkedPanelIsOpen] = useState(false);
    const classes = useFilterStyles();

    useEffect(() => {
        hasLinkedPanel && linkedPanelOptions.toggle(linkedPanelIsOpen);
    }, [linkedPanelIsOpen]);

    const _toggleLinkedPanel = () => {
        setLinkedPanelIsOpen(!linkedPanelIsOpen);
    };

    return (
        <>
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


            {canFilter && (
                <GlobalFilterFlat
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            )}

            <TablePagination instance={instance} />
            
            {hasLinkedPanel && 
            <Box>
                <FormControlLabel
                    control={<Switch checked={linkedPanelIsOpen || false} onChange={_toggleLinkedPanel} />}
                    label={linkedPanelIsOpen ? `Hide ${linkedPanelOptions.label}` : `Show ${linkedPanelOptions.label}`}
                />  
                <HelpIcon tooltip={`Click to reveal or hide ${linkedPanelOptions.label} explorer (below table)`}></HelpIcon>
             </Box>
            }
        </>
    );
};
