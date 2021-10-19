import React from "react";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { PanelProps } from ".";
import { DarkSecondaryExternalLink } from "../../../MaterialUI/Links";
import { _externalUrls } from "../../../../data/_externalUrls";
import { _siteStatistics } from "../../../../data/_siteStatistics";

export const AboutPanel: React.FC<PanelProps> = ({ classes }) => {
    return (
        <Grid item container direction="column" spacing={6} xs={12} sm={10} md={6}>
            <Grid item>
                <Typography variant="h3" className={classes.headingPrimary} align="center">
                    About the GenomicsDB
                </Typography>

                <Box py={6}>
                    <Typography variant="body1" className={classes.lightContrastText} align="left">
                        The NIAGADS Alzheimer's Genomics Database enables browsing, searching, and analysis of publicly
                        available summary statistics from AD/ADRD genome-wide association studies (GWAS) deposited at{" "}
                        <DarkSecondaryExternalLink href={_externalUrls.NIAGADS_BASE_URL}>
                            NIAGADS
                        </DarkSecondaryExternalLink>
                        . Variants contained within these datasets are annotated using the ADSP Annotation Pipeline
                        (PMID:{" "}
                        <DarkSecondaryExternalLink href={`${_externalUrls.PUBMED_URL}/29590295`}>
                            29590295
                        </DarkSecondaryExternalLink>
                        ) and mapped against sequence features and functional genomics data tracks to help researchers
                        explore the potential impact of risk-associated variants in a broader genomics context.
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};
