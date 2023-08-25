import React from "react";
import { Link as RouterLink } from "react-router-dom";
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

import { safeHtml } from "wdk-client/Utils/ComponentUtils";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: theme.spacing(2),
    },
    mb: {
        marginBottom: theme.spacing(2),
    },
    my: {
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

interface DialogOptions {
    isOpen: boolean;
    handleClose: any;
}

const AboutGenomeBrowserDialog: React.FC<DialogOptions> = ({ isOpen, handleClose }) => {
    const imagePath = webAppUrl + "/images/help/browser";
    const classes = useStyles();

    const renderOverview = () => {
        return (
            <Box className={classes.my}>
                <Typography>
                    The NIAGADS IGV Genome Browser provides a comprehensive view of NIAGADS GWAS Summary Statistics
                    datasets and annotated ADSP variants in a broader genomic context.
                </Typography>
                <Typography>
                    For a quick overview of genome browser usage, please view the following tutorial:
                </Typography>
                <iframe
                    width="200px"
                    height="200px"
                    allow="fullscreen"
                    src="https://www.youtube.com/embed/h6ImfJwByyU"
                ></iframe>
                <Typography>
                    Details on how to load user defined tracks are provided in the{" "}
                    <RouterLink to="documentation/about#FAQ">FAQ</RouterLink>.
                </Typography>
                <ComingSoonAlert message="More detailed documentation for the Genome Browser is coming soon"></ComingSoonAlert>
            </Box>
        );
    };
    return (
        <Dialog maxWidth="md" aria-labelledby="dialog-title" open={isOpen} onClose={handleClose}>
            <DialogTitle id="dialog-title">About this Page</DialogTitle>
            <DialogContent dividers>
                <a id="overview">
                    <Typography variant="subtitle1" className={classes.title}>
                        The NIAGADS IGV Genome Browser
                    </Typography>
                </a>

                {renderOverview()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AboutGenomeBrowserDialog;
