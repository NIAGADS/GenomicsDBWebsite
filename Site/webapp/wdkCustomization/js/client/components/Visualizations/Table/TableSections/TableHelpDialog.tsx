import React from "react";

import { webAppUrl } from "ebrc-client/config";

import { makeStyles } from "@material-ui/core/styles";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";

import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import FilterIcon from "@material-ui/icons/FilterList";
import DownloadIcon from "@material-ui/icons/GetApp";
import ToggleIcon from "@material-ui/icons/ToggleOff";

import { blue } from "@material-ui/core/colors";

import { InfoAlert } from "@components/MaterialUI";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: theme.spacing(2),
    },
    mb: {
        marginBottom: theme.spacing(2),
    },
    mx: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    nav: {
        fontSize: "0.8rem",
        //display: "flex",
        //flexDirection: "row",
        padding: 0,
    },
    iconWrapper: {
        color: blue[500],
        verticalAlign: "middle",
        display: "inline-flex",
    },
}));

interface TableHelpOptions {
    isOpen: boolean;
    handleClose: any;
    hasLinkedPanel: boolean;
    canFilter: boolean;
    canAddColumns: boolean;
}

export const TableHelpDialog: React.FC<TableHelpOptions> = ({
    isOpen,
    handleClose,
    hasLinkedPanel,
    canFilter,
    canAddColumns,
}) => {
    const imagePath = webAppUrl + "/images/help/table";
    const classes = useStyles();

    const renderFilterHelp = () => (
        <Box>
            <Typography variant="body1">
                This table has an advanced filter interface that can be accessed by clicking the{"  "}
                <span className={classes.iconWrapper}>
                    <FilterIcon fontSize="inherit" />
                    {"  "}FILTER
                </span>
                {"  "}
                button in the table toolbar. Advanced filters correspond directly to the table columns of the same
                label.
            </Typography>

            <List>
                <ListItem>
                    <Box>
                        <Typography variant="subtitle1">Select</Typography>
                        <Typography variant="body1">
                            These filters will provide a list of available values for the column of which one or more
                            can be selected from either a drop down box or checklist. For fields with a large number of
                            possible values (e.g., biosample type), the select will be a type-ahead. Type 3 or more
                            characters to get suggestions.
                        </Typography>
                        <img src={`${imagePath}/filter-select.png`} />
                    </Box>
                </ListItem>
                <ListItem>
                    <Box>
                        <Typography variant="subtitle1">Numeric</Typography>
                        <Typography variant="body1">
                            Numeric filters are used to filter fields containing numeric values. Values can usually be
                            entered in decimal or scientific notation. Click the{" "}
                            <span className={classes.iconWrapper}>APPLY</span> button to apply the numeric filter.
                        </Typography>
                        <img src={`${imagePath}/filter-value.png`} />
                    </Box>
                </ListItem>
                <ListItem>
                    <Box>
                        <Typography variant="subtitle1">Pie Charts</Typography>
                        <Typography variant="body1" className={classes.mb}>
                            Pie chart filters summarize possible values and counts of rows per value in the table.
                            Counts will be dynamically updated as search criteria or other filters are applied. Click on
                            a pie slice (<strong>B</strong>, below) to filter the table for the selected value, which
                            will be colored red upon selection. To remove the filter, click the red slice again or
                            remove by clearing the chip in the advanced filter indicator above the table (
                            <strong>Overview, 4</strong>
                            ).
                        </Typography>
                        <Typography>
                            In some cases, a column may contain many rows for which the value is <strong>NA</strong>.
                            NAs will always be assigned to a grey-colored slice in the pie chart (<strong>A</strong>).
                            The NA slice can be hidden by clicking on "NA" in the chart legend (click again to add the
                            NA slice back in). The pie will readjust allowing easy selection of annotations of interest
                            for filtering (<strong>B</strong>).
                        </Typography>
                        <img src={`${imagePath}/filter-pie.png`} />
                    </Box>
                </ListItem>
                <ListItem>
                    <Box>
                        <Typography variant="subtitle1">Removing Filters</Typography>
                        <Typography variant="body1">
                            Once applied, filters will be listed in the filter-indicator/chip-bar above the table. A
                            specific can be quickly removed by selecting the "X" in the chip corresponding to the
                            filter (see also <strong>Overview, 4</strong>).
                        </Typography>
                        <img src={`${imagePath}/filter-chip-bar.png`} />

                        <Typography variant="body1">
                            The filter dialog provides a reset button that will reset the table to its defaults (e.g.,
                            no filters or the initial p-value filter, if applicable). The reset button will not clear
                            anything typed in the "Search" field in the table toolbar.
                        </Typography>
                        <img src={`${imagePath}/filter-reset.png`} />
                    </Box>
                </ListItem>
            </List>
        </Box>
    );

    const renderLinkedPanelHelp = () => (
        <Box>
            <Typography variant="body1" className={classes.mb}>
                This table has a linked LocusZoom view of the association results. Show or hide the LocusZoom plot by
                clicking the{" "}
                <span className={classes.iconWrapper}>
                    <ToggleIcon />
                    {"  "}LocusZoom
                </span>
                {"  "}
                toggle in the table toolbar.
            </Typography>
            <Typography className={classes.mb}>
                {" "}
                Select a row by checking the box in the <strong>LocusZoom</strong> field in the table to recenter
                LocusZoom and set the selected variant as the LD reference.
            </Typography>
            <img src={`${imagePath}/row-select-locuszoom.png`} />
            <Typography className={classes.mx}>
                The LocusZoom plot is fully interactive. Hover over variants or genes for more information. Click on the
                variant or gene to hold the pop-up on the screen to interact with links or set the selected variant as
                the LD reference (<strong>1</strong>). The LD population is by default set to the most recent ADSP
                release, but other populations can be selected (when available) by clicking the <strong>LD Population</strong>{" "}
                button (<strong>2</strong>). The view window can be changed by clicking anywhere in view and dragging,
                or by selecting a new variant in the paired table. The gene track (<strong>3</strong>) is filtered for
                coding genes. This filter can be removed by selecting the <strong>Filter</strong> button above the track.
            </Typography>
            <img src={`${imagePath}/locuszoom.png`} />
            <InfoAlert
                title="Note"
                message={`The GenomicsDB only stores LD values with r²≥0.2 and cannot distiguish between a low r² and lack of correlation. Therefore, all variants with no information are colored grey.`}
            ></InfoAlert>
        </Box>
    );

    const renderNav = () => (
        <Box>
            <List className={classes.nav} dense={true}>
                <ListItem>
                    <a href="#overview">Overview</a>
                </ListItem>
                <ListItem>
                    <a href="#export">Export</a>
                </ListItem>
                <ListItem>
                    <a href="#columns">{canAddColumns ? "Sorting by and Adding Columns" : "Sorting by Column"}</a>
                </ListItem>
                <ListItem>
                    <a href="#filter">Advanced Filters</a>
                </ListItem>
                {hasLinkedPanel && (
                    <ListItem>
                        <a href="#paired">LocusZoom</a>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    const renderAddColumnsHelp = () => (
        <Box mt={2} mb={2}>
            <Typography variant="body1">
                Some tables have hidden columns. If additional columns are available, a{"  "}
                <span className={classes.iconWrapper}>
                    <ViewColumnIcon fontSize="inherit" />
                    {"  "}
                    <span>COLUMNS</span>
                </span>
                {"  "}
                button will be present in the table toolbar. Clicking this button will open a dialog box listing all
                available columns. Column visibility can be set by toggling the switch next to the column name.
            </Typography>
            <img src={`${imagePath}/add-columns.png`} />
        </Box>
    );

    const renderOverview = () => (
        <Box mt={2} mb={2}>
            <Typography variant="body1">
                The GenomicsDB use tables (<strong>1</strong>) to report metadata and annotations. When a table contains
                more than 10 rows, the results are paged and a table navigation bar is provided (<strong>2</strong>).
                Tables that can be searched, filtered, or have selectable rows have a toolbar and applied filter
                indicator (<strong>3</strong> and <strong>4</strong>, respectively).
            </Typography>
            <img src={`${imagePath}/table-overview.png`} width="100%" />
        </Box>
    );

    const renderExportHelp = () => (
        <Box mt={2} mb={2}>
            <Typography variant="body1">
                Most tables can be exported in tab-delimited format using the{"  "}
                <span className={classes.iconWrapper}>
                    <DownloadIcon fontSize="inherit" />
                    {"  "}
                    EXPORT
                </span>
                {"  "} button in the table toolbar. Exports will match the current view of the table data (columns and
                rows after applying search criteria or filters). The (unfiltered) table contents can be exported in JSON
                format using the{"  "}
                <span className={classes.iconWrapper}>
                    <Icon fontSize="inherit" className="fa fa-download"></Icon>
                    {"  "}EXPORT RECORD
                </span>
                {"  "}
                button in the report navigation panel.
            </Typography>
        </Box>
    );

    return (
        <Dialog maxWidth="md" aria-labelledby="dialog-title" open={isOpen} onClose={handleClose}>
            <DialogTitle id="dialog-title">
                How to browse and mine data tables
                {renderNav()}
            </DialogTitle>
            <DialogContent dividers>
                <a id="overview">
                    <Typography variant="subtitle1" className={classes.title}>
                        Overview
                    </Typography>
                </a>

                {renderOverview()}

                <a id="export">
                    <Typography variant="subtitle1" className={classes.title}>
                        Export
                    </Typography>
                </a>

                {renderExportHelp()}

                <a id="columns">
                    <Typography variant="subtitle1" className={classes.title}>
                        {canAddColumns ? "Sorting by and Adding Columns" : "Sorting by Column"}
                    </Typography>
                </a>

                <Box mt={2} mb={2}>
                    <Typography variant="body1">
                        Tables can be sorted by toggling (clicking) on a column header. Toggle to sort ascending,
                        descending, or remove the sort. When sorting is toggled, an arrow indicator will display
                        indicating the direction of sort.
                    </Typography>
                    <img src={`${imagePath}/table-column-sort.png`} />
                </Box>

                {canAddColumns && renderAddColumnsHelp()}

                <a id="filter">
                    <Typography variant="subtitle1" className={classes.title}>
                        Advanced filters
                    </Typography>
                </a>

                {canFilter ? (
                    renderFilterHelp()
                ) : (
                    <InfoAlert title="Info" message="This table has no advanced filters"></InfoAlert>
                )}

                {hasLinkedPanel && (
                    <a id="paired">
                        <Typography variant="subtitle1" className={classes.title}>
                            LocusZoom
                        </Typography>
                    </a>
                )}

                {hasLinkedPanel && renderLinkedPanelHelp()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const MemoTableHelpDialog = React.memo(TableHelpDialog);
