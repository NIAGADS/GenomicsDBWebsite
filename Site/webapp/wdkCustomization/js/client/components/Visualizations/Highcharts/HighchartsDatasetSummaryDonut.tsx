import React, { useEffect, useState } from 'react';
import { isEmpty, assign, merge } from 'lodash';
import { Options } from 'highcharts';
import HighchartsPlot from './HighchartsPlot';
import {
    addTitle,
    disableExport,
    applyCustomSeriesColor,
    backgroundTransparent,
    disableSeriesAnimationOnLoad
} from './HighchartsOptions';
import { _color_blind_friendly_palettes as PALETTES } from '../palettes';
import WdkService, { useWdkEffect } from 'wdk-client/Service/WdkService';
import { Loading, LoadingOverlay } from 'wdk-client/Components';



interface DatasetSummaryDonutProps {
    webAppUrl: string;
}


interface ChartData {
    data: any;
}

export const HighchartsDatasetSummaryDonut: React.FC<DatasetSummaryDonutProps> = props => {
    const { webAppUrl } = props;
    const initialData: any = ['Datasets', 69, 'All Summary Statistics Datasets']; // TODO lookup total # datasets from model.prop
    const [series, setSeries] = useState(initialData);
    const [seriesUpdated, setSeriesUpdated] = useState(false); // since the request for the series is a one-off, set flag to limit re-rendering


    function searchDatasets(point: any) {
        let endpoint = webAppUrl + "/app/search/gwas_summary/neuropathology?autoRun=true&value="
        location.href = endpoint + point.name;
    }

    function buildSeries(data: any) {
        let series = {
            series: [
                {
                    name: "Datasets",
                    innerSize: "60%",
                    showInLegend: true,
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: false
                    },
                    point: {
                        events: {
                            click: function () { return searchDatasets(this); },
                            legendItemClick: function () { return false; } // for pies this is a point, not a series property
                        }
                    },
                    keys: ["name", "y", "full_name"],
                    data: data,

                }
            ]
        }

        return series;
    }

    function buildDonutPlotOptions() {
        let plotOptions: Options = {
            tooltip: {
                pointFormat: "{point.full_name}: <b>{point.y}</b>"
            },
            legend: {
                align: "right",
                verticalAlign: "middle",
                layout: "vertical",
                itemStyle: { color: "white", fontSize: "1.15em", fontWeight: "normal" },
                itemHoverStyle: { color: "#ffc665" }
            }
        }

        plotOptions = merge(plotOptions, addTitle(null));
        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());
        plotOptions = merge(plotOptions, disableSeriesAnimationOnLoad());

        console.log(plotOptions);
        return plotOptions;
    }

    const sendRequest = () => (service: WdkService) => {

        service
            ._fetchJson<ChartData>(
                "get",
                `/dataset/summary_plot`
            )
            .then((res: ChartData) => setSeries(buildSeries(res)))
            .then(() => setSeriesUpdated(true))
            .catch(err => console.log(err));
    };

    useWdkEffect(sendRequest(), [seriesUpdated]);

    return (
        <HighchartsPlot data={series} properties={{ type: "pie" }} plotOptions={buildDonutPlotOptions()} />
    );
}