import React, { useState, useMemo } from "react";
import { merge } from "lodash";
import { Options } from "highcharts";
import HighchartsPlot from "./HighchartsPlot";
import {
    addTitle,
    disableExport,
    applyCustomSeriesColor,
    backgroundTransparent,
    disableSeriesAnimationOnLoad,
    disableChartAnimationOnUpdate,
} from "./HighchartsOptions";
import { _color_blind_friendly_palettes as PALETTES } from "../palettes";
import WdkService, { useWdkEffect } from "wdk-client/Service/WdkService";
import { useGoto } from "../../../hooks";
import { Point, PointClickEventObject } from "highcharts";

type ChartData = [string, number, string];

interface DSDonutProps {
    className: string;
}

/* note allowable values for maxWidth come from https://mui.com/system/sizing/ */
export const HighchartsDatasetSummaryDonut: React.FC<DSDonutProps> = ({className}) => {
    const buildSeries = (data: ChartData[]) => {
        const series = {
            series: [
                {
                    name: "Datasets",
                    innerSize: "50%",
                    showInLegend: false,
                    allowPointSelect: false,
                    //cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        distance: 50,
                        style: {
                            color: "black",
                        },
                    },

                    startAngle: -90,
                    endAngle: 90,
                    center: ["50%", "75%"],

                    point: {
                        events: {
                            //click: (e: PointClickEventObject) => searchDatasets(e.point),
                            legendItemClick: () => false,
                        },
                    },
                    keys: ["name", "y", "full_name"],
                    data: data,
                },
            ],
        };

        return series;
    };

    const [series, setSeries] = useState(buildSeries([[null, null, null]])),
        goto = useGoto();

    const searchDatasets = (point: Point) =>
        goto(`search/gwas_summary/neuropathology?autoRun=true&param.phenotype=${point.name}`);

    useWdkEffect((service: WdkService) => {
        service
            ._fetchJson<ChartData[]>("get", `/dataset/summary_plot`)
            .then((res) => setSeries(buildSeries(res)))
            .catch((err) => console.log(err));
    }, []);

    const buildDonutPlotOptions = () => {
        let plotOptions: Options = {
            tooltip: {
                // pointFormat: "{point.full_name}: <b>{point.y}</b> <br/>Click on chart to browse these datasets.",
                pointFormat: "{point.full_name}: n = <b>{point.y}</b>",
            },
            /*legend: {
                //align: "right",
                //verticalAlign: "middle",
                //layout: "vertical",
                //itemStyle: { color: "white", fontSize: "1.15em", fontWeight: "normal" },
                //itemHoverStyle: { color: "#ffc665" },
            },*/
            /*caption: {
                text: 'Click on chart to find datasets associated with the selected AD-related dementia or neuropathology.',
                style: {color: "white"}
            }*/
        };

        plotOptions = merge(plotOptions, addTitle(null));
        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());
        plotOptions = merge(plotOptions, disableSeriesAnimationOnLoad());
        plotOptions = merge(plotOptions, disableChartAnimationOnUpdate());

        return plotOptions;
    };

    return useMemo(() => {
        return <HighchartsPlot data={series} properties={{ type: "pie" }} plotOptions={buildDonutPlotOptions()} containerProps={{className: {className}}}/>;
    }, [series]);
};
