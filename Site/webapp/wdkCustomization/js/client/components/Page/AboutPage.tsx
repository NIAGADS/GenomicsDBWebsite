import React, { useState } from "react";
import { Link as RouterLink, withRouter, RouteComponentProps } from "react-router-dom";
import { webAppUrl, projectId } from "ebrc-client/config";

import { useWdkEffect } from "wdk-client/Service/WdkService";

import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { CustomLink as Link, DefaultBackgroundPanel } from "@components/MaterialUI";
import { AboutPanel } from "@components/Page/HomePage/Panels";

import useHomePageStyles, {
    useTypographyStyles as useHomePageTypographyStyles,
} from "@components/Page/HomePage/styles";

const AboutPage: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const classes = useHomePageStyles();
    const tClasses = useHomePageTypographyStyles();
    const bodyTextColor = classes.lightContrastText;
    const headingTextColor = classes.primaryText;
    const linkType = "initial";
    const bodyText = bodyTextColor + " " + tClasses.largeBody;

    const AboutPageNav: React.FC<{}> = () => {
        return (
            <Box mt={4}>
                <List disablePadding={true}>
                    <ListItem>
                        <Link color="initial" href="#cite" target="_self">
                            How to cite
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link color="initial" href="#faq" target="_self">
                            FAQ
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link color="initial" href="#datasources" target="_self">
                            Data Sources
                        </Link>
                    </ListItem>
                </List>
            </Box>
        );
    };

    const renderHowToCite = () => (
        <DefaultBackgroundPanel hasBaseArrow={false} classes={classes}>
            <Grid item>
                <a id="cite"></a>
                <Typography variant="h5">How to cite this resource</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1" className={bodyText} align="left">
                    We encourage you to use the data and insights offered in the NIAGADS Alzheimers's Genomics database
                    along with the following acknowledgement statement:
                </Typography>
                <Box mt={2}>
                    <Typography variant="body1">
                        <em>
                            The results published here are in whole or part based on data obtained from the NIAGADS
                            Alzheimer's GenomicsDB, available at https://www.niagads.org{webAppUrl}.
                        </em>
                    </Typography>
                </Box>
                <Box mt={2}>
                    <Typography variant="body1" className={bodyText} align="left">
                        To cite the resource using the following:
                    </Typography>
                </Box>
                <Box mt={2}>
                    <Typography variant="body1">
                        Greenfest-Allen et al. (28 April 2023). "NIAGADS Alzheimer’s GenomicsDB: A resource for
                        exploring Alzheimer’s Disease genetic and genomic knowledge":{" "}
                        <a href="https://doi.org/10.1101/2020.09.23.310276">
                            https://doi.org/10.1101/2020.09.23.310276
                        </a>
                    </Typography>
                </Box>
                <Box mt={2}>
                    <Typography className={bodyText} align="left">
                        If referencing a specific GWAS summary statistics dataset from the NIAGADS repository, please
                        follow the accession link provided in the{" "}
                        <a href="dataset/accessions" target="_blank">
                            dataset browser
                        </a>{" "}
                        to obtain original publication information for the dataset to directly acknowledge.
                    </Typography>
                </Box>
            </Grid>
        </DefaultBackgroundPanel>
    );

    return (
        <Grid container spacing={2} alignContent="flex-start">
            <Grid item xs={1}>
                <AboutPageNav></AboutPageNav>
            </Grid>
            <Grid item xs={9}>
                <AboutPanel webAppUrl={webAppUrl}></AboutPanel>
                {renderHowToCite()}
            </Grid>
        </Grid>
    );
};

export default withRouter(AboutPage);
