// modified from https://github.com/ggascoigne/react-table-example
import React, { ReactElement, useCallback } from "react";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import FilterListIcon from "@material-ui/icons/FilterList";

import { CollapsableCardPanel, LabelButton } from "@components/MaterialUI";

import { useFilterPanelStyles, FilterPageProps } from "@viz/Table/TableFilters";
import {
    DEFAULT_FILTER_VALUE as DEFAULT_PVALUE_FILTER_VALUE,
    DEFAULT_OPEN_FILTER_GROUPS,
} from "@components/Record/RecordTable/RecordTableFilters";

export function FilterPanel({ instance, filterGroups }: FilterPageProps): ReactElement {
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
        <LabelButton
            variant="text"
            color="default"
            startIcon={<FilterListIcon />}
            fullWidth={true}
            size="small"
            disableElevation
            disableRipple
        >
            Filter Table
        </LabelButton>
    );

    const renderFilterGroup = (group: string, columnNames: string[]) => {
        return (
            <CollapsableCardPanel title={group} defaultOpen={DEFAULT_OPEN_FILTER_GROUPS.includes(group)}>
                <Grid
                    container
                    className={classes.filterGroup}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={3}
                >
                    {columnNames.map((id) => {
                        renderFilter(id);
                    })}
                </Grid>
            </CollapsableCardPanel>
        );
    };

    const renderFilter = (columnName: string) => {
        return allColumns
            .filter((column) => column.id === columnName)
            .map((column) => (
                <Grid item key={column.id}>
                    <Box className={classes.filterCell}>{column.render("Filter")}</Box>
                </Grid>
            ));
    };

    return (
        <CollapsableCardPanel headerContents={renderFilterHeader} defaultOpen={true} borderedHeader={true}>
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
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<RotateLeftIcon />}
                    fullWidth={true}
                    size="small"
                >
                    Reset filters
                </Button>
                {filterGroups.map((fg) => renderFilterGroup(fg.keys[0], fg[fg.keys[0]]))}
            </Grid>
        </CollapsableCardPanel>
    );
}
