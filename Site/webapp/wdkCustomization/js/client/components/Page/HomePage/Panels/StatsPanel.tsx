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

export const StatsPanel: React.FC<PanelProps> = ({ classes }) => {
    return (
        <Grid item container direction="column" justifyContent="center" alignItems="center" xs={12} spacing={4}>
            <Grid item alignItems="center" xs={12} sm={12} md={4} justifyContent="center">
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
                    {abbreviateLargeNumber(_siteStatistics.SIGNIFICANT_VARIANTS, 2)} with significant AD/ADRD-risk
                    association
                </Typography>
                <Typography align="left" className={`${classes.highlightStat} ${classes.smallCaps}`}>
                    {abbreviateLargeNumber(_siteStatistics.ANNOTATED_GENES, 2)} Annotated Genes
                </Typography>
            </Grid>
        </Grid>
    );
};
