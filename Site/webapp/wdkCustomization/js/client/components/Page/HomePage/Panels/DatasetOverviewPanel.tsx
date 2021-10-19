import React from "react";

import { Breakpoint, BreakpointProvider } from "react-socks";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";


import { PanelProps } from ".";
import { _externalUrls } from "../../../../data/_externalUrls";
import { _siteStatistics } from "../../../../data/_siteStatistics";

import { HighchartsDatasetSummaryDonut as DatasetSummary } from "../../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut";


export const DatasetOverviewPanel: React.FC<PanelProps> = ({ classes }) => {
    return (
        <Grid item container direction="column" justifyContent="center" alignItems="center" xs={12} spacing={4}>
            <Grid item xs={12} alignItems="center" justifyContent="center">
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

            <Grid item xs={12} alignItems="center" justifyContent="center">
            <BreakpointProvider>
                <Breakpoint small down>
                    <DatasetSummary className={classes.donutChart} showDataLabels={false} />
                </Breakpoint>
                <Breakpoint medium up>
                    <DatasetSummary className={classes.donutChart} showDataLabels={true} />
                </Breakpoint>
                </BreakpointProvider>
            </Grid>
        </Grid>
    );
};
