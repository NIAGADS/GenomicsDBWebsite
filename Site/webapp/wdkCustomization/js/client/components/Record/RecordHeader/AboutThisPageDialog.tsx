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

import { isLeaf, getLeaves, getBranches } from "wdk-client/Utils/TreeUtils";
import { getNodeChildren } from "wdk-client/Utils/OntologyUtils";

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

const recordOverview: { [key: string]: any } = {
    Dataset: <Typography variant="body1">About dataset reports</Typography>,
    Gene: <Typography variant="body1">About gene reports</Typography>,
    Variant: <Typography variant="body1">About variant reports</Typography>,
};

interface AboutThisPageDialogOptions {
    isOpen: boolean;
    handleClose: any;
    recordClass: any;
    categoryTree: any;
}

export const AboutThisPageDialog: React.FC<AboutThisPageDialogOptions> = ({
    isOpen,
    handleClose,
    recordClass,
    categoryTree,
}) => {
    const imagePath = webAppUrl + "/images/help/records";
    const classes = useStyles();

    const renderSections = () => <Box className={classes.mx}>{getLeaves(categoryTree, getNodeChildren)}</Box>;

    const renderNav = () => (
        <Box>
            <List className={classes.nav} dense={true}>
                <ListItem>
                    <a href="#overview">Overview</a>
                </ListItem>
                <ListItem>
                    <a href="#export">Export</a>
                </ListItem>
                {recordClass.shortDisplayName === "Dataset" && (
                    <ListItem>
                        <a href="#manhattan">Manhattan Plot</a>
                    </ListItem>
                )}
                <ListItem>
                    <a href="#sections">Sections</a>
                </ListItem>
            </List>
        </Box>
    );

    const renderOverview = () => <Box className={classes.mx}>{recordOverview[recordClass.shortDisplayName]}</Box>;

    return recordClass.shortDisplayName == "Ontology" ? (
        <ComingSoonAlert message="More information about navigating the data dictionary is coming soon."></ComingSoonAlert>
    ) : (
        <Dialog maxWidth="md" aria-labelledby="dialog-title" open={isOpen} onClose={handleClose}>
            <DialogTitle id="dialog-title">
                About this Page
                {renderNav()}
            </DialogTitle>
            <DialogContent dividers>
                <a id="overview">
                    <Typography variant="subtitle1" className={classes.title}>
                        Overview: {recordClass.shortDisplayName} Report
                    </Typography>
                </a>

                {renderOverview()}

                <a id="export">
                    <Typography variant="subtitle1" className={classes.title}>
                        Export
                    </Typography>
                </a>
                <ComingSoonAlert message="More about Exporting this record coming soon" />

                <a id="sections">
                    <Typography variant="subtitle1" className={classes.title}>
                        Sections
                    </Typography>
                </a>
                {renderSections()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
