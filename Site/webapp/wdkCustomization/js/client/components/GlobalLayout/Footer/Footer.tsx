import React from "react";
import { webAppUrl } from "ebrc-client/config";
import { Box, Grid, ThemeProvider, withStyles } from "@material-ui/core";
import theme from "./../../../theme";
import { DarkContrastGreyText, DarkContrastText } from "../../Shared/Typography";
import { WhiteExternalLink } from "../../Shared";
import moment from "wdk-client/Utils/MomentUtils";

const Footer: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <FooterWrapper container alignItems="center" direction="column">
                <Grid container item direction="column" spacing={3}>
                    <Grid item container justify="center" alignItems="center">
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
                                <WhiteExternalLink href="https://www.niagads.org/contact">Contact</WhiteExternalLink>
                            </DarkContrastText>
                        </Box>
                    </Grid>
                    <Grid item container direction="column" alignItems="center">
                        <a href="https://www.niagads.org/" rel="noopener noreferrer" target="_blank">
                            <img src={`${webAppUrl}/images/footer/niagads_logo.svg`} height="58px" />
                        </a>
                        <a href="https://www.niagads.org/" rel="noopener noreferrer" target="_blank">
                            <DarkContrastText variant="body2">
                                The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                            </DarkContrastText>
                        </a>
                    </Grid>
                </Grid>
                <Grid item>
                    <DarkContrastGreyText variant="caption">
                        {`©2018-${moment().format(
                            "YYYY"
                        )} University of Pennsylvania, School of Medicine. All rights reserved.`}
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
