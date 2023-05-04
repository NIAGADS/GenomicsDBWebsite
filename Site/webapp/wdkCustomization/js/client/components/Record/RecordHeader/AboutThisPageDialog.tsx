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

import { blue } from "@material-ui/core/colors";

import { ComingSoonAlert, InfoAlert } from "@components/MaterialUI";

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

interface AboutThisPageDialogOptions {
    isOpen: boolean;
    handleClose: any;
    recordClass: any;
}

export const AboutThisPageDialog: React.FC<AboutThisPageDialogOptions> = ({ isOpen, handleClose, recordClass }) => {
    const imagePath = webAppUrl + "/images/help/records";
    const classes = useStyles();

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
                    <a href="#links">Link Outs</a>
                </ListItem>
                {recordClass.shortDisplayName === "Dataset" && (
                    <ListItem>
                        <a href="#manhattan">Manhattan Plot</a>
                    </ListItem>
                )}
            </List>
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

    return (
        <Dialog maxWidth="md" aria-labelledby="dialog-title" open={isOpen} onClose={handleClose}>
            <DialogTitle id="dialog-title">
                About this Page
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

                <ComingSoonAlert message="More about Exporting this record coming soon"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
