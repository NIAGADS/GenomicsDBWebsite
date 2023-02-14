import React, { useState, useEffect } from "react";

import DownloadIcon from "@material-ui/icons/GetApp";

import { FilterPageProps, GlobalFilterFlat, useFilterStyles } from "@viz/Table/TableFilters";
import { TablePagination } from "@viz/Table/TableSections";

import { StyledTooltip as Tooltip } from "@components/MaterialUI";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";


interface FilterToolbarProps {
    canFilter: boolean;
    canExport?: boolean;
    locusZoomView?: boolean;
    toggleLocusZoom?: any;
}

export const TableToolbar: React.FC<FilterToolbarProps & FilterPageProps> = ({
    canFilter,
    instance,
    canExport = true,
    locusZoomView = false,
    toggleLocusZoom,
}) => {
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const [lzIsOpen, setLzIsOpen] = useState(false);
    const classes = useFilterStyles();

    useEffect(() => {
        toggleLocusZoom && toggleLocusZoom(lzIsOpen);
    }, [lzIsOpen]);

    const _toggleLocusZoomView = () => {
        setLzIsOpen(!lzIsOpen);
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

            {locusZoomView && (
                <FormControlLabel
                    control={<Switch defaultChecked={lzIsOpen} onChange={_toggleLocusZoomView} />}
                    label={`${lzIsOpen}` ? "Show LocusZoom" : "Hide LocusZoom"}
                />
            )}
        </>
    );
};
