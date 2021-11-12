import React from "react";

import { Breakpoint, BreakpointProvider } from "react-socks";
// NOTE: useMediaQuery did not work for changing views on desktop/ react-socks does

import { PanelProps } from "@components/MaterialUI";
import { _externalUrls } from "genomics-client/data/_externalUrls";
import { _siteStatistics } from "genomics-client/data/_siteStatistics";

import { HighchartsDatasetSummaryDonut as DatasetSummary } from "@viz/Highcharts/HighchartsDatasetSummaryDonut";

export const DatasetOverviewChart: React.FC<PanelProps> = ({ classes }) => {
    //const theme = useTheme();
    //const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
    return (
        <BreakpointProvider>
            <Breakpoint small up>
                <DatasetSummary className={classes.donutChart} showDataLabels={true} />
            </Breakpoint>
            <Breakpoint small down>
                <DatasetSummary className={classes.donutChart} showDataLabels={false} />
            </Breakpoint>
        </BreakpointProvider>
    );

};
