import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { CustomLink as Link } from "@components/MaterialUI";

import { PanelProps, DefaultBackgroundPanel } from "@components/MaterialUI";
import { _externalUrls } from "genomics-client/data/_externalUrls";
import { _siteStatistics } from "genomics-client/data/_siteStatistics";

import useHomePageStyles, { useTypographyStyles as useHomePageTypographyStyles } from "../styles";
import Box from "@material-ui/core/Box";

export const AboutPanel: React.FC<PanelProps> = ({ background = "light", webAppUrl }) => {
    const classes = useHomePageStyles();
    const tClasses = useHomePageTypographyStyles();
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.secondaryText : classes.primaryText;
    const linkType = background === "dark" ? "secondary" : "initial";
    const bodyText = bodyTextColor + " " + tClasses.largeBody;

    return (
        <DefaultBackgroundPanel classes={classes} hasBaseArrow={false}>
            <a id="about" />
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Typography variant="h3" className={headingTextColor} align="center">
                        About the Project
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography variant="body1" className={bodyText} align="left">
                        The NIAGADS Alzheimer's Genomics Database is developed by a team of researchers at the
                        University of Pennsylvania as part of the{" "}
                        <Link color={linkType} href={_externalUrls.NIAGADS_BASE_URL}>
                            National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                        </Link>{" "}
                        (NIAGADS), a national genetics repository created by NIA to facilitate access to genotypic data
                        for the study of the genetics of late-onset Alzheimer's disease. We welcome the involvement of
                        interested researchers.{" "}
                        <Link color={linkType} href={`${_externalUrls.NIAGADS_BASE_URL}/data`}>
                            Click here to learn more
                        </Link>{" "}
                        about contributing data or making formal data access requests. Or{" "}
                        <Link color={linkType} href={`${_externalUrls.NIAGADS_BASE_URL}/contact`}>
                            contact us
                        </Link>{" "}
                        for more information. The GenomicsDB is a collaboration among the following organizations which
                        may also provide funding or governance:
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h5">How to cite this resource</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" className={bodyText} align="left">
                        We encourage you to use the data and insights offered in the NIAGADS Alzheimers's Genomics
                        database along with the following acknowledgement statement:
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
                            If referencing a specific GWAS summary statistics dataset from the NIAGADS repository,
                            please follow the accession link provided in the{" "}
                            <a href="dataset/accessions" target="_blank">
                                dataset browser
                            </a>{" "}
                            to obtain original publication information for the dataset to directly acknowledge.
                        </Typography>
                    </Box>
                </Grid>

                <Grid item>
                    <Grid container item spacing={4} direction="row" justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <img width="210" src={`${webAppUrl}/images/home/nih-logo.svg`} />
                        </Grid>
                        <Grid item>
                            <img width="145px" src={`${webAppUrl}/images/home/adsp-logo.svg`} />
                        </Grid>
                        <Grid item>
                            <img width="210px" src={`${webAppUrl}/images/home/psom_logo_blue.png`} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DefaultBackgroundPanel>
    );
};
