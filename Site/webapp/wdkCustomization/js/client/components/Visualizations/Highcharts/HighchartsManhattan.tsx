import React, { useEffect, useState } from 'react';
import { isEmpty, assign } from 'lodash';
import { Options } from 'highcharts';
import HighchartsPlot, { HighchartsPlotProps, buildOptions } from './HighchartsPlot';
import WdkService, { useWdkEffect } from 'wdk-client/Service/WdkService';


import { LoadingOverlay, Error as ErrorPage } from 'wdk-client/Components';

interface ManhattanPlotProps {
    properties: any;
    track: string;
}

interface PointProps {
    chr: string;
    position: string;
    pvalue: string;
    refsnp: string;
    variant: string;
    x: number;
    y: number;
}

interface ChartData {
    data: PointProps[]
}

export const HighchartsManhattan: React.FC<ManhattanPlotProps> = props => {
    const { properties, track } = props;
    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(false);

    function buildSeries(data: any) {
        let chrs = [...Array(25 + 1).keys()].slice(1);
        let zones: any = [];

        chrs.map(function (chrNum) {
            zones.push({
                value: chrNum,
                color: chrNum % 2 === 0 ? "#5C164E" : "lightgrey"
            });
        });
        let series = {series: [
            {
                data: data,
                zoneAxis: "x",
                zones: zones
            }
        ]};

        return series;
    }

    const sendRequest = (track: string) => (service: WdkService) => {
        setLoading(true);
        service
            ._fetchJson<ChartData>(
                "get",
                `/manhattan/iplot?chromosome=all&track=${track}`
            )
            .then((res: ChartData) => setSeries(buildSeries(res)))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    };

    useWdkEffect(sendRequest(track), [track]);

    return (
        series ? <HighchartsPlot data={series} properties={properties} />
            : <LoadingOverlay></LoadingOverlay>
    )
}