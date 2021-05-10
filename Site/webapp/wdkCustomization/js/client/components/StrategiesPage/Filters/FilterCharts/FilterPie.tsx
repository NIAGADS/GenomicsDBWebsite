import React, { useState } from 'react';
import { isEmpty, assign, merge } from 'lodash';
import WdkService, { useWdkEffect } from 'wdk-client/Service/WdkService';
import { Options } from "highcharts";
import HighchartsPlot from "../../../Visualizations/Highcharts/HighchartsPlot";
import {
    addTitle,
    disableExport,
    applyCustomSeriesColor,
    backgroundTransparent,
    disableSeriesAnimationOnLoad,
    disableChartAnimationOnUpdate,
} from "../../../Visualizations/Highcharts/HighchartsOptions";
import { _color_blind_friendly_palettes as PALETTES } from "../../../Visualizations/palettes";


interface FilterPieProps {
    recordClassName: string;
    filterField: string;
}

export const FilterPie: React.FC<FilterPieProps> = props => {
    const { recordClassName, filterField } = props;
    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(false);

    const buildPlotOptions = () => {
        let plotOptions: Options = {
            tooltip: {
                pointFormat: "{point.full_name}: <b>{point.y}</b> <br/>Click to filter result.",
            },
            legend: {
                align: "right",
                verticalAlign: "middle",
                layout: "vertical",
                itemStyle: { color: "white", fontSize: "1.15em", fontWeight: "normal" },
                itemHoverStyle: { color: "#ffc665" },
            },
        };

        plotOptions = merge(plotOptions, disableExport());
        plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.eight_color));
        plotOptions = merge(plotOptions, backgroundTransparent());
        plotOptions = merge(plotOptions, disableSeriesAnimationOnLoad());
        plotOptions = merge(plotOptions, disableChartAnimationOnUpdate());

        return plotOptions;
    };

   // useWdkEffect(sendRequest(track), [track]);

    return (
        series ? <HighchartsPlot data={series} properties={{type: "pie"}} plotOptions={buildPlotOptions()}/>
            : null
    )
}