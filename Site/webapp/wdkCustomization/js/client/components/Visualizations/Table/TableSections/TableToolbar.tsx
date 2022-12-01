import React, { useState } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from "@viz/Table/TableFilters";
import { TablePagination } from "@viz/Table/TableSections";

import { CustomTooltip as Tooltip, MaterialUIThemedButton } from "@components/MaterialUI";
import Button from "@material-ui/core/Button";

interface FilterToolbarProps {
    canFilter: boolean;
    canExport?:boolean;
}

export const TableToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({ canFilter, instance, canExport=true }) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;

    const classes = useFilterStyles();

    return (
        <>
            {/* span is b/c button is disabled, allows tooltip to fire */}
            {canExport && <Tooltip title="Table downloads coming soon" aria-label="table downloads coming soon/disabled">
                <span>
                    <Button
                        endIcon={<DownloadIcon />}
                        variant="text"
                        color="primary"
                        aria-label="download table data"
                        disabled={true}
                    >
                        Export
                    </Button>
                </span>
            </Tooltip>}
            {canFilter && (
                <GlobalFilterFlat
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            )}
            <TablePagination instance={instance} />
        </>
    );
};
