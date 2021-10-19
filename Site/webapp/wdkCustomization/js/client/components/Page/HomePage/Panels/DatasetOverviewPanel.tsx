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

export const DatasetOverviewPanel: React.FC<PanelProps> = ({ classes }) => {
    return (
        <Grid item container direction="column" justifyContent="center" alignItems="center" xs={12} spacing={4}>
            <Grid item container direction="row">
                <Grid item>
                    <Box mb="-100px">
                        <Typography
                            variant="h3"
                            align="center"
                            className={`${classes.smallCaps} ${classes.primaryText} ${classes.bold}`}
                        >
                            {_siteStatistics.DATASETS} Datasets
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <DatasetSummary className={classes.donutChart} />
                </Grid>
            </Grid>
        </Grid>
    );
};
