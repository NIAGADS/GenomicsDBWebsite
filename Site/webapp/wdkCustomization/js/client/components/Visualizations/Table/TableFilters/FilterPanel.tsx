// modified from https://github.com/ggascoigne/react-table-example
import React, { ReactElement, useCallback } from "react";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";

import { CollapsableCardPanel } from "@components/MaterialUI";

import { useFilterPanelStyles, FilterPageProps, GlobalFilterFlat } from "@viz/Table/TableFilters";
import { DEFAULT_FILTER_VALUE as DEFAULT_PVALUE_FILTER_VALUE } from "@components/Record/RecordTable/RecordTableFilters";

export function FilterPanel({ instance }: FilterPageProps): ReactElement {
    const classes = useFilterPanelStyles();
    //@ts-ignore
    const { allColumns, setAllFilters } = instance;
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;

    const resetFilters = useCallback(() => {
        if (hasPvalueFilter) {
            setAllFilters([{ id: "pvalue", value: DEFAULT_PVALUE_FILTER_VALUE }]);
        } else {
            setAllFilters([]);
        }
    }, [setAllFilters]);

    const hasSelectFilters =
        allColumns.filter(
            //@ts-ignore
            (item) => item.canFilter && item.filter && item.filter.toLowerCase().includes("select")
        ).length > 0;

    const hasPvalueFilter =
        allColumns.filter(
            //@ts-ignore
            (item) => item.canFilter && item.filter && item.filter.toLowerCase().includes("pvalue")
        ).length > 0;

    const renderFilterHeader = (
        <Button variant="contained" color="secondary" startIcon={<RotateLeftIcon />} fullWidth={true} size="small">
            Reset filters
        </Button>
    );

    return (
        <CollapsableCardPanel headerContents={renderFilterHeader} defaultOpen={true}>
            <Grid
                container
                //direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                className={classes.root}
                spacing={3}
            >
                {/* render pvalue filter */}
                {/* <form> */}
                {allColumns
                    .filter(
                        //@ts-ignore
                        (item) => item.canFilter && item.filter && item.filter.toLowerCase() === "pvalue"
                    )
                    .map((column) => (
                        <Grid item key={column.id}>
                            <Box className={classes.filterCell}>{column.render("Filter")}</Box>
                        </Grid>
                    ))}

                {/* render pie charts first ; includes to handle special cases */}
                {allColumns
                    .filter(
                        //@ts-ignore
                        (item) => item.canFilter && item.filter && item.filter.toLowerCase().includes("pie")
                    )
                    .map((column) => (
                        <Grid item key={column.id}>
                            <Box className={classes.filterCell}>{column.render("Filter")}</Box>
                        </Grid>
                    ))}

                {/* render selects */}
                {allColumns
                    //@ts-ignore
                    .filter((item) => item.canFilter && item.filter === "select")
                    .map((column) => (
                        <Grid item key={column.id}>
                            <Box className={classes.filterCell}>{column.render("Filter")}</Box>
                        </Grid>
                    ))}
                {/* </form> */}
            </Grid>
        </CollapsableCardPanel>
    );
}
