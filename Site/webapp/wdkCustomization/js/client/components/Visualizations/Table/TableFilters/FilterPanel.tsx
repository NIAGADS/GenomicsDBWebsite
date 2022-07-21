// modified from https://github.com/ggascoigne/react-table-example
import React, { ReactElement, useCallback } from "react";
import {countBy} from 'lodash';
import { Theme, createStyles, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { CollapsableCardPanel } from "@components/MaterialUI";

import { useFilterPanelStyles, FilterPageProps, GlobalFilterFlat } from ".";

export function ClearFiltersButton({ instance }: FilterPageProps): ReactElement {
    const classes = useFilterPanelStyles();
    //@ts-ignore
    const { allColumns, setAllFilters } = instance;
    const resetFilters = useCallback(() => {
        setAllFilters([]);
    }, [setAllFilters]);
    return (
        <Button variant="contained" color="primary" onClick={resetFilters}>
            Clear Filters
        </Button>
    );
}

export function FilterPanel({ instance }: FilterPageProps): ReactElement {
    const classes = useFilterPanelStyles();
    //@ts-ignore
    const { allColumns, setAllFilters } = instance;
    //@ts-ignore
    const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = instance;
    const resetFilters = useCallback(() => {
        setAllFilters([]);
    }, [setAllFilters]);

    const hasSelects = allColumns.filter(
        //@ts-ignore
        (item) => item.canFilter && item.filter && item.filter.toLowerCase().includes("select")
    );

    return (
        <CollapsableCardPanel title="Advanced Filters" defaultOpen={true}>
            <Grid
                container
                //direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                className={classes.root}
                spacing={3}
            >
                <Grid item>
                    <ClearFiltersButton instance={instance} />
                </Grid>
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
