// modified from https://github.com/ggascoigne/react-table-example
import React, { ReactElement, useCallback } from "react";

import { ColumnInstance } from "react-table";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import FilterListIcon from "@material-ui/icons/FilterList";

import { CollapsableCardPanel, LabelButton } from "@components/MaterialUI";

import { useFilterPanelStyles, FilterPageProps, FilterGroup } from "@viz/Table/TableFilters";
import { DEFAULT_FILTER_VALUE as DEFAULT_PVALUE_FILTER_VALUE } from "@components/Record/RecordTable/RecordTableFilters";
import { GroupWorkSharp, GroupSharp } from "@material-ui/icons";

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

    const hasSelectFilters: boolean =
        allColumns.filter(
            //@ts-ignore
            (item) => item.canFilter && item.filter && item.filter.toLowerCase().includes("select")
        ).length > 0;

    const hasPvalueFilter: boolean =
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

    const renderCollapsibleFilterGroup = (group: FilterGroup) => {
        return (
            <CollapsableCardPanel
                className={classes.collapsiblePanelFilterGroupPanel}
                key={group.label + "-collapse"}
                title={group.label}
                defaultOpen={group.defaultOpen != null ? group.defaultOpen : false}
            >
                {renderStaticFilterGroup(group, classes.collapsibleFilterGroup)}
            </CollapsableCardPanel>
        );
    };

    const renderStaticFilterGroup = (group: FilterGroup, className?: string) => {
        return (
            <Grid
                key={group.label + "-static"}
                container
                className={className ? className : classes.filterGroup}
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={3}
            >
                {group.columns.map((id: string) => renderFilter(id))}
            </Grid>
        );
    };

    const renderFilterGroup = (group: FilterGroup) => {
        const isCollapsible: boolean = group.collapsible != null ? group.collapsible : true;
        return isCollapsible ? renderCollapsibleFilterGroup(group) : renderStaticFilterGroup(group);
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
                {filterGroups.map((fg) => renderFilterGroup(fg))}
            </Grid>
        </CollapsableCardPanel>
    );
}
