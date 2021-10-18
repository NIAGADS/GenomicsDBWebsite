import React from "react";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { PanelProps } from ".";
import { DarkSecondaryExternalLink } from "../../../MaterialUI/Links";
import { _externalUrls } from "../../../../data/_externalUrls";
import { _siteStatistics } from "../../../../data/_siteStatistics";
import { abbreviateLargeNumber } from "../../../../util/util";

import { HighchartsDatasetSummaryDonut as DatasetSummary } from "../../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut";

export const AboutPanel: React.FC<PanelProps> = ({ classes }) => {
    return (
        <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={6} xs={12}>
            <Grid item container xs={10} md={6} justifyContent="center" direction="column">
                <Typography variant="h3" className={classes.headingPrimary} align="center">
                    About the GenomicsDB
                </Typography>

                <Box pt={6}>
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

            {/* split 2 columns */}

            <Grid item container direction="row" justifyContent="center" alignItems="center" xs={12} spacing={0}>
                <Grid container direction="column" item md={6} xs={12} spacing={0}>
                    <Box sx={{ maxWidth: "sm" }}>
                        <DatasetSummary className={classes.donutChart}/>
                    </Box>
                    <Box mt="-100px">
                        <Typography variant="h3" align="center" className={`${classes.secondaryText} ${classes.bold}`}>
                            {_siteStatistics.DATASETS}{" "}
                            <Typography component="span" className={classes.upperCase}>
                                Datasets
                            </Typography>
                        </Typography>
                    </Box>
                </Grid>

                <Grid item alignItems="center" justifyContent="center">
                    <Typography variant="h3" className={`${classes.secondaryText} ${classes.bold}`}>
                        {abbreviateLargeNumber(_siteStatistics.ANNOTATED_VARIANTS, 2)}{" "}
                        <Typography component="span" className={classes.upperCase}>
                            Annotated Variants
                        </Typography>
                    </Typography>
                    <Typography>29M from the ADSP</Typography>
                    <Typography>
                        {abbreviateLargeNumber(_siteStatistics.SIGNIFICANT_VARIANTS, 2)} with significant AD/ADRD-risk
                        association
                    </Typography>
                    <Typography>{abbreviateLargeNumber(_siteStatistics.ANNOTATED_GENES, 2)} Annotated Genes</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};
