import React from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { PanelProps } from ".";
import { _externalUrls } from "../../../../data/_externalUrls";
import { _siteStatistics } from "../../../../data/_siteStatistics";

import { HighchartsDatasetSummaryDonut as DatasetSummary } from "../../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut";

export const DatasetOverviewChart: React.FC<PanelProps> = ({ classes }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
    return isDesktop ? (
        <DatasetSummary className={classes.donutChart} showDataLabels={true} />
    ) : (
        <DatasetSummary className={classes.donutChart} showDataLabels={false} />
    );
};
