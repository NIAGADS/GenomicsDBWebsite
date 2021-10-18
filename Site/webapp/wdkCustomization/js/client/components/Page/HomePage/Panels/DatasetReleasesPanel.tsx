import React from "react";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { HighchartsDatasetSummaryDonut as DatasetSummary } from "../../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut";

import { PanelProps } from ".";
import { PrimaryLink } from "../../../MaterialUI/Links";
import { _externalUrls } from "../../../../data/_externalUrls";

export const DatasetReleasesPanel: React.FC<PanelProps> = ({ classes }) => {
    return (
        <Grid item container direction="column" justifyContent="space-evenly" alignItems="center">
            <Grid item>
                <Typography variant="h3" className={classes.headingPrimary} align="center">
                    Available Data
                </Typography>
            </Grid>

            <Grid item>
                <Typography variant="body1" className={classes.lightContrastText} align="left">
                    The NIAGADS Alzheimer's Genomics Database provides unrestricted access to summary statistics from
                    AD/ADRD genome-wide association studies (GWAS) deposited at{" "}
                    <PrimaryLink to={_externalUrls.NIAGADS_BASE_URL}>NIAGADS</PrimaryLink>. For each dataset we provide
                    a detailed interactive report summarizing the top risk-associated variants Explore AD-risk
                    associated variants and genes. Making these data both accessible and interpretable. Learn more about
                    the role these genes and variants may play in AD.
                </Typography>

                <Button
                    variant="contained"
                    href="app/record/dataset/accessions"
                    color="secondary"
                    endIcon={<ArrowRightIcon />}
                >
                    Browse Datasets
                </Button>
            </Grid>
            <Grid item md={6} alignContent="center">

                <Typography variant="caption"></Typography>
            </Grid>
        </Grid>
    );
};
