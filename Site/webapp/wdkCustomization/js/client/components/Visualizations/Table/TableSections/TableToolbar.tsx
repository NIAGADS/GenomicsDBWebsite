import React, { useState } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from "@viz/Table/TableFilters";
import { TablePagination } from "@viz/Table/TableSections";

import { withHtmlTooltip, MaterialUIThemedButton } from "@components/MaterialUI";

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
            {withHtmlTooltip(
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
                </span>,
                "Table downloads coming soon"
            )}
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
