import React from "react";
import { webAppUrl } from "ebrc-client/config";
import { Box, Grid, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import theme from "./../../../theme";
import { DarkContrastGreyText, DarkContrastText } from "../../Shared/Typography";
import { LightSecondaryExternalLink } from "../../Shared";

const Footer: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <FooterWrapper spacing={3} container alignItems="center" direction="column">
                <Grid item container justify="center" alignItems="center">
                    <Box pl={3} pr={3}>
                        <Typography variant="body2">
                            <LightSecondaryExternalLink href="https://www.niagads.org/privacy-policy">
                                Privacy policy
                            </LightSecondaryExternalLink>{" "}
                        </Typography>
                    </Box>
                    <Box pl={3} pr={3}>
                        <Typography variant="body2" color="secondary">
                            |
                        </Typography>
                    </Box>
                    <Box pl={3} pr={3}>
                        <Typography variant="body2">
                            <LightSecondaryExternalLink href="https://www.niagads.org/contact">
                                Contact
                            </LightSecondaryExternalLink>
                        </Typography>
                    </Box>
                </Grid>
                <Grid item container direction="column" alignItems="center">
                    <a href="https://www.niagads.org/" rel="noopener noreferrer" target="_blank">
                        <img src={`${webAppUrl}/images/niagads_logo.svg`} height="58px" />
                    </a>
                    <a href="https://www.niagads.org/" rel="noopener noreferrer" target="_blank">
                        <DarkContrastText variant="body2">
                            The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                        </DarkContrastText>
                    </a>
                </Grid>
                <Grid item>
                    <DarkContrastGreyText variant="caption">
                        ©2018-2020 University of Pennsylvania, School of Medicine. All rights reserved.
                    </DarkContrastGreyText>
                </Grid>
            </FooterWrapper>
        </ThemeProvider>
    );
};

const FooterWrapper = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark,
        paddingTop: theme.spacing(3),
    },
}))(Grid);

export default Footer;
