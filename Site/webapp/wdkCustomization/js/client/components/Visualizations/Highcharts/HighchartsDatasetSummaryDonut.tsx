import React, { useEffect, useState } from 'react';
import { isEmpty, assign, merge } from 'lodash';
import { Options } from 'highcharts';
import HighchartsPlot from './HighchartsPlot';
import {
    addTitle,
    disableLegendClick,
    disableExport,
    applyCustomSeriesColor,
    backgroundTransparent
} from './HighchartsOptions';
import {_color_blind_friendly_palettes as PALETTES} from '../palettes';
import WdkService, { useWdkEffect } from 'wdk-client/Service/WdkService';
import { Loading, LoadingOverlay } from 'wdk-client/Components';



interface DatasetSummaryDonutProps {
    properties: any;
}


interface ChartData {
    data: any;
}

export const HighchartsDatasetSummaryDonut: React.FC<DatasetSummaryDonutProps> = props => {
    const { properties } = props;
    const [series, setSeries] = useState(null);

    function searchDatasets(point: any) {
        let endpoint = properties.webAppUrl + "/app/search/gwas_summary/neuropathology?autoRun=true&value="
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
                            legendItemClick: function() {return false;} // for pies this is a point, not a series property
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
            .catch(err => console.log(err));
    };

    useWdkEffect(sendRequest(), []);

    return (
        series ?
            <HighchartsPlot data={series} properties={properties} plotOptions={buildDonutPlotOptions()} />
            : <LoadingOverlay></LoadingOverlay>
    );
}