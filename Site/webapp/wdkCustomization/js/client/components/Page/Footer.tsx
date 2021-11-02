import React from "react";
import { webAppUrl } from "ebrc-client/config";

import { makeStyles, createStyles, Theme } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import moment from "wdk-client/Utils/MomentUtils";
import { _externalUrls } from "../../data/_externalUrls";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.primary.main,
            paddingTop: theme.spacing(2),
            marginTop: theme.spacing(3),
        },
        darkContrastText: {
            color: theme.palette.primary.contrastText,
        },
        darkContrastTextButton: {
            color: theme.palette.primary.contrastText,
        },
        secondaryText: {
            color: theme.palette.secondary.main,
        },
        bold: {
            fontWeight: theme.typography.fontWeightBold,
        },
        primaryText: {
            color: theme.palette.primary.main,
        },
        link: {
            color: theme.palette.primary.contrastText,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
    })
);

const Footer: React.FC = () => {
    const logo = webAppUrl + "/images/footer/niagads_logo.svg";
    const classes = useStyles();
    return (
        <Grid container alignItems="center" direction="column" className={classes.root}>
            <Grid item>
                <Button
                    aria-label="The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site"
                    color="inherit"
                    href={`${_externalUrls.NIAGADS_BASE_URL}`}
                >
                    <img src={logo} width="200px" alt="NIAGADS" />
                </Button>

                <Button
                    className={classes.link}
                    aria-label="The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site"
                    href={`${_externalUrls.NIAGADS_BASE_URL}`}
                >
                    The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                </Button>
            </Grid>
            <Grid item>
                <Button
                    className={classes.link}
                    aria-label="NIAGADS privacy policy"
                    href={`${_externalUrls.NIAGADS_BASE_URL}/privacy-policy`}
                >
                    Privacy Policy
                </Button>
                <Typography component="span" className={classes.darkContrastText}>
                    {"  "}|{"  "}
                </Typography>
                <Button
                    className={classes.link}
                    aria-label="contact NIAGADS"
                    href={`${_externalUrls.NIAGADS_BASE_URL}/contact`}
                >
                    Contact Us
                </Button>
            </Grid>

            <Grid item>
                <Typography variant="caption" className={classes.darkContrastText}>
                    {`©2014-${moment().format(
                        "YYYY"
                    )} University of Pennsylvania, School of Medicine. All rights reserved.`}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Footer;
