// modified from https://github.com/ggascoigne/react-table-example
import React, { ReactElement, useCallback, useState, useMemo } from "react";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import InfoIcon from "@material-ui/icons/Info";

import {
    CollapsableCardPanel,
    StyledTooltip as Tooltip,
    MaterialUIThemedButton as BlueButton,
    CollapseWithClose,
    ComingSoonAlert,
} from "@components/MaterialUI";

import { useFilterPanelStyles, FilterPageProps, FilterGroup } from "@viz/Table/TableFilters";
import { DEFAULT_PVALUE_FILTER_VALUE } from "@components/Record/RecordTable/RecordTableFilters";
import { FilterChipBar } from "@viz/Table/TableSections";

import { webAppUrl } from "ebrc-client/config";

interface FilterDialog {
    handleClose: any;
    isOpen: boolean;
}

const FilterHelpPanel: React.FC<{ isOpen: boolean; handleClose: any }> = React.memo(({ isOpen, handleClose }) => {
    const imagePath = webAppUrl + "/images/help/table";
    return (
        <CollapseWithClose isOpen={isOpen} handleClose={handleClose}>
            <Paper variant="outlined" elevation={1}>
                <Box p={2}>
                    <Typography variant="h5">About the Advanced Filters</Typography>
                    <Typography variant="body1">
                        The advanced table filters are a set of column-based filters that summarize column information
                        into interact plots or other simple input fields to facilitate mining the associated table data.
                    </Typography>
                    <Divider />
                    <ComingSoonAlert message="More information about the table filters will be coming soon." />
                    {/*<Typography variant="h5">Statistics</Typography>
                <img src={`${imagePath}/filter-value.png`} /> */}
                </Box>
            </Paper>
        </CollapseWithClose>
    );
});

export function FilterDialog({
    isOpen,
    handleClose,
    instance,
    filterGroups,
    includeChips = true,
}: FilterPageProps & FilterDialog): ReactElement {
    const [helpPanelIsOpen, setHelpPanelIsOpen] = useState<boolean>(false);
    const classes = useFilterPanelStyles();
    //@ts-ignore
    const { allColumns, setAllFilters } = instance;

    const resetFilters = useCallback(() => {
        if (hasPvalueFilter) {
            setAllFilters([{ id: "pvalue", value: DEFAULT_PVALUE_FILTER_VALUE }]);
        } else {
            setAllFilters([]);
        }
    }, [setAllFilters]);

    const hasPvalueFilter: boolean =
        allColumns.filter(
            //@ts-ignore
            (item) => item.canFilter && item.filter && item.filter.toLowerCase().includes("pvalue")
        ).length > 0;

    const renderCollapsibleFilterGroup = (group: FilterGroup) => {
        return (
            <CollapsableCardPanel
                className={classes.collapsiblePanelFilterGroupPanel}
                key={group.label + "-collapse"}
                title={group.label}
                defaultOpen={group.defaultOpen != null ? group.defaultOpen : false}
                dark={true}
            >
                {renderStaticFilterGroup(group, classes.collapsibleFilterGroup)}
            </CollapsableCardPanel>
        );
    };

    const renderStaticFilterGroup = (group: FilterGroup, className?: string) => {
        return (
            <Grid
                item
                key={group.label + "-static"}
                container
                className={className ? className : classes.filterGroup}
                justifyContent="flex-start"
                alignItems="flex-start"
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
                <Grid key={column.id} item xs={6}>
                    <Box className={classes.filterCell}>{column.render("Filter")}</Box>{" "}
                </Grid>
            ));
    };

    return (
        <Dialog maxWidth="md" aria-labelledby="dialog-title" open={isOpen} onClose={handleClose}>
            <DialogTitle id="dialog-title">
                Table Overview and Filters{"   "}
                <BlueButton
                    size="small"
                    aria-label="how-to-filter"
                    variant="text"
                    color="primary"
                    title="About the filter/summary interface"
                    onClick={() => {
                        setHelpPanelIsOpen(true);
                    }}
                    endIcon={<InfoIcon />}
                ></BlueButton>
                <FilterHelpPanel
                    isOpen={helpPanelIsOpen}
                    handleClose={() => {
                        setHelpPanelIsOpen(false);
                    }}
                />
            </DialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    className={classes.root}
                >
                    <Grid container item direction="column">
                        {filterGroups.map((fg) => renderFilterGroup(fg))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {includeChips && (
                    <Grid item>
                        <FilterChipBar instance={instance} />
                    </Grid>
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<RotateLeftIcon />}
                    //fullWidth={true}
                    size="small"
                    onClick={resetFilters}
                    title="Remove or reset filter criteria to table defaults. This will not clear terms entered in
                                    the text search box."
                >
                    Reset Filters
                </Button>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
