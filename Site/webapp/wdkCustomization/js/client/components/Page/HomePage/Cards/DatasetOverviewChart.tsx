import React from "react";

import { Breakpoint, BreakpointProvider } from "react-socks";
// NOTE: useMediaQuery did not work for changing views on desktop/ react-socks does

import { PanelProps } from "../Panels";
import { _externalUrls } from "../../../../data/_externalUrls";
import { _siteStatistics } from "../../../../data/_siteStatistics";

import { HighchartsDatasetSummaryDonut as DatasetSummary } from "../../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut";

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
