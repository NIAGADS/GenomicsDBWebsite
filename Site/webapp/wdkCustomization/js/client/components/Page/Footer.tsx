import React from "react";
import { webAppUrl } from "ebrc-client/config";

import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

import { theme } from "../MaterialUI";
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
        <ThemeProvider theme={theme}>
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
            </Grid>
        </ThemeProvider>
    );
};

export default Footer;

/*</ThemeProvider>      <Grid item container justify="center" alignItems="center">
                        <Box p={3} display="flex">
                            <Box pl={3} pr={3}>
                                <DarkContrastText variant="body2">
                                    <WhiteExternalLink href="https://www.niagads.org/privacy-policy">
                                        Privacy policy
                                    </WhiteExternalLink>{" "}
                                </DarkContrastText>
                            </Box>
                            <Box pl={3} pr={3}>
                                <DarkContrastText variant="body2" color="secondary">
                                    |
                                </DarkContrastText>
                            </Box>
                            <Box pl={3} pr={3}>
                                <DarkContrastText variant="body2">
                                    <WhiteExternalLink href="https://www.niagads.org/contact">
                                        Contact
                                    </WhiteExternalLink>
                                </DarkContrastText>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item container direction="column" alignItems="center">
                   
                    </Grid>
                </Grid>
                <Grid item>
                    <Box pt={3}>
                        <DarkContrastGreyText variant="caption">
                            {`©2018-${moment().format(
                                "YYYY"
                            )} University of Pennsylvania, School of Medicine. All rights reserved.`}
                        </DarkContrastGreyText>
                    </Box>
                </Grid>
            </FooterWrapper>
*/

