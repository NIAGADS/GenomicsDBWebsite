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

import { RecordSectionDocumentation } from "@components/Record/Types";
import _recordDocumentation from "genomics-client/data/record_properties/_recordDocumentation";

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
    const rcName = recordClass.shortDisplayName;

    const renderSectionDocumentation = (documentation: RecordSectionDocumentation[]) => (
        <Box>
            {documentation.map((item: RecordSectionDocumentation) => (
                <Typography className={classes.mx}>
                    {item.text}
                    {item.routerLink && <h1>ROUTER LINK FOUND!!!!</h1>}
                    {item.link && <h1>LINK FOUND!!!</h1>}
                </Typography>
            ))}
        </Box>
    );

    const renderSections = () => {
        const doc = _recordDocumentation[rcName];
        return (
            <>
                {categoryTree.children.map((category: any) => {
                    const anchor = category.properties["label"][0].toLowerCase().replace(/, /g, "-").replace(/ /g, "-");
                    const title = category.properties["EuPathDB alternative term"][0];
                    const key = category.properties["display order"][0];
                    return (
                        <Box className={classes.mx}>
                            <a id={anchor} key={`target_${key}`}>
                                <Typography key={`title_${key}`} variant="subtitle1" className={classes.title}>
                                    {title}
                                </Typography>
                            </a>
                            {renderSectionDocumentation(doc[anchor])}
                        </Box>
                    );
                })}
            </>
        );
    };

    const renderSectionNav = () => {
        return (
            <>
                {categoryTree.children.map((category: any) => {
                    const anchor = category.properties["label"][0].toLowerCase().replace(/, /g, "-").replace(/ /g, "-");
                    const title = category.properties["EuPathDB alternative term"][0];
                    const key = category.properties["display order"][0];
                    return (
                        <ListItem key={`item_${key}`}>
                            <a key={`anchor_${key}`} href={`#${anchor}`}>
                                {title}
                            </a>
                        </ListItem>
                    );
                })}
            </>
        );
    };

    const renderNav = () => (
        <Box>
            <List className={classes.nav} dense={true}>
                <ListItem>
                    <a href="#overview">Overview</a>
                </ListItem>
                {recordClass.shortDisplayName === "Dataset" && (
                    <ListItem>
                        <a href="#manhattan">Manhattan Plot</a>
                    </ListItem>
                )}
                {categoryTree && renderSectionNav()}
                <ListItem>
                    <a href="#export">Export this Report</a>
                </ListItem>
            </List>
        </Box>
    );

    const renderOverview = () => (
        <Box className={classes.mx}>
            <ComingSoonAlert message="header documentation coming soon"></ComingSoonAlert>
        </Box>
    );

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
                        {recordClass.shortDisplayName} Report Overview
                    </Typography>
                </a>

                {renderOverview()}

                <a id="export">
                    <Typography variant="subtitle1" className={classes.title}>
                        Export
                    </Typography>
                </a>
                <ComingSoonAlert message="More about Exporting this record coming soon" />

                {categoryTree && renderSections()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
