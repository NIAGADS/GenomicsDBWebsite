import React from "react";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

import { PanelProps, LightBackgroundPanel } from ".";
import { _externalUrls } from "../../../../data/_externalUrls";
import { _siteStatistics } from "../../../../data/_siteStatistics";
import { abbreviateLargeNumber } from "../../../../util/util";

import { HighchartsDatasetSummaryDonut as DatasetSummary } from "../../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut";

export const StatsPanel: React.FC<PanelProps> = ({ classes, background = "light" }) => {
    const bodyTextColor = background === "dark" ? classes.darkContrastText : classes.lightContrastText;
    const headingTextColor = background === "dark" ? classes.headingSecondary : classes.headingPrimary;
    const linkType = background === "dark" ? classes.darkBgLink : classes.lightBgLink;

    return (
        <LightBackgroundPanel classes={classes} hasBaseArrow={true}>
            <Grid item container direction="column" spacing={6} xs={12} sm={10}>
                <Grid item>
                    <Typography variant="h3" className={headingTextColor} align="center">
                        Explore AD/ADRD Genetic Evidence for AD/ADRD
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid item container direction="row" alignItems="center" justifyContent="space-evenly" spacing={4}>
                        <Grid item>
                            <Typography variant="body1" className={bodyTextColor} align="left">
                                For each dataset we provide a detailed interactive report summarizing the top
                                risk-associated variants. These variants are are annotated using the ADSP Annotation
                                Pipeline (PMID:{" "}
                                <Link className={linkType} href={`${_externalUrls.PUBMED_URL}/29590295`}>
                                    29590295
                                </Link>
                                ) and mapped against sequence features and functional genomics data tracks to help
                                researchers explore the potential impact of risk-associated variants in a broader
                                genomics context.
                            </Typography>
                        </Grid>
                        <Grid item alignItems="center" justifyContent="center" spacing={6}>
                            <Typography
                                align="left"
                                variant="h3"
                                className={`${classes.secondaryText} ${classes.bold} ${classes.smallCaps}`}
                            >
                                {abbreviateLargeNumber(_siteStatistics.ANNOTATED_VARIANTS, 2)} Annotated Variants
                            </Typography>
                            <Typography align="left" className={`${classes.highlightStat} ${classes.smallCaps}`}>
                                29M from the ADSP
                            </Typography>
                            <Typography align="left" className={`${classes.highlightStat} ${classes.smallCaps}`}>
                                {abbreviateLargeNumber(_siteStatistics.SIGNIFICANT_VARIANTS, 2)} with significant
                                AD/ADRD-risk association
                            </Typography>
                            <Typography align="left" className={`${classes.highlightStat} ${classes.smallCaps}`}>
                                {abbreviateLargeNumber(_siteStatistics.ANNOTATED_GENES, 2)} Annotated Genes
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </LightBackgroundPanel>
    );
};
