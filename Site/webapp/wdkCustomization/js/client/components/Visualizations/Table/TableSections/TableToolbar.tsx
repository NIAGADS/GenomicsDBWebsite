import React, { useState } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from "@viz/Table/TableFilters";
import { TablePagination } from "@viz/Table/TableSections";

import { CustomTooltip as Tooltip, MaterialUIThemedButton } from "@components/MaterialUI";

interface FilterToolbarProps {
    canFilter: boolean;
}

export const TableToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({ canFilter, instance }) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;

    const classes = useFilterStyles();

    return (
        <>
            {/* span is b/c button is disabled, allows tooltip to fire */}
            <Tooltip title="Table downloads coming soon" aria-label="table downloads coming soon/disabled">
                <span>
                    <MaterialUIThemedButton
                        endIcon={<DownloadIcon />}
                        variant="text"
                        color="primary"
                        aria-label="download table data"
                        disabled={true}
                    >
                        Export
                    </MaterialUIThemedButton>
                </span>
            </Tooltip>
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
