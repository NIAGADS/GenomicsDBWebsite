import { Options, OptionsStackingValue } from 'highcharts';
import { Term, Glossary } from '../../../data/glossary';
import { merge } from 'lodash';

/* const HIGHCHARTS_EXPORTING_MENU_ITEMS = [
    "printChart",
    "separator",
    "downloadPNG",
    "downloadJPEG",
    "downloadPDF",
    "downloadSVG",
    "separator",
    "downloadCSV",
    "downloadXLS",
    "viewData",
    "openInCloud"
]; */


const PuBlRd_COLOR_BLIND_PALETTE = ["#601A4A", "#EE442F", "#63ACBE"];
const RdBlPu_COLOR_BLIND_PALETTE = ["#EE442F",  "#601A4A", "#63ACBE"];

export const HIGHCHARTS_DEFAULTS: Options = {
    credits: { enabled: false }
}

export function buildChartOptions(chartType: string) {
    switch (chartType) {
        case "column":
            return buildColumnChartOptions();
        case "gene_gws_summary":
            return buildGeneGwsSummaryOptions();
        default:
            return HIGHCHARTS_DEFAULTS;
    }
}


export function buildGeneGwsSummaryOptions(options?: Options) {
    let plotOptions: Options = {
        chart: {
            height: 250,
            width: 250
        },
        title: {
            align: "left",
            style: { fontSize: "12px" },
            x: 0
        },
        yAxis: {
            title: { text: "N GWS Variants" }
        },
        legend: {
            enabled: false
        },
        navigation: {
            buttonOptions: {
                symbolSize: 10,
                symbolStrokeWidth: 1,
            }
        },
        plotOptions: {
            series: {
                borderWidth: 0 // no white border around stacked elements
            }
        }
    }

    plotOptions = merge(plotOptions, disableLegendClick());
    plotOptions = merge(plotOptions, disableLegendHover());
    plotOptions = merge(plotOptions, limitedExportMenu());
    plotOptions = merge(plotOptions, disableSeriesAnimationOnLoad());
    plotOptions = merge(plotOptions, applyCustomSeriesColor(RdBlPu_COLOR_BLIND_PALETTE));

    if (options) {
        plotOptions = merge(plotOptions, options);
    }

    return buildColumnChartOptions(true, "normal", plotOptions) // stacked bar (inverted column) w/additional formatting from above
}


export function buildColumnChartOptions(inverted?: boolean, stacking?: OptionsStackingValue, options?: Options) {
    const sharedTooltip = true;
    const drawTooltipsOutside = true;

    let plotOptions: Options = {
        chart: {
            type: "column",
            inverted: inverted ? inverted : false
        },
        legend: {
            reversed: inverted ? inverted : false
        },
        plotOptions: {
            column: {
                stacking: stacking ? stacking : undefined
            }
        }
    }

    plotOptions = Object.assign(plotOptions, buildTooltipOptions(sharedTooltip, drawTooltipsOutside));

    if (options) {
        plotOptions = merge(plotOptions, options)
    }

    return Object.assign({}, HIGHCHARTS_DEFAULTS, plotOptions);
}



function limitedExportMenu() {
    const plotOptions:Options = {
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["printChart", "separator", "downloadPNG", "downloadPDF", "downloadSVG", "separator", "downloadCSV"]
                }
            }
        }
    }

    return plotOptions;
}

export function disableSeriesAnimationOnLoad() {
    const plotOptions: Options = {
        plotOptions: {
            series: {
                animation: false
            }
        }
    }

    return plotOptions;
}

export function applyCustomSeriesColor(palette: string[]) {
    const plotOptions:Options = {
        colors: palette    
    }

    return plotOptions;
}


export function disableLegendClick() {
    const plotOptions: Options = {
        plotOptions: {
            series: {
                events: {
                    legendItemClick: function () {
                        return false;
                    }
                }
            }
        }
    }

    return plotOptions;
}

export function disableLegendHover() {
    const plotOptions: Options = {
        plotOptions: {
            series: {
                states: {
                    inactive: {
                        opacity: 1
                    },
                    hover: {
                        enabled: false
                    }
                }
            }

        }
    }

    return plotOptions;
}


export function addSeries(series: any) {
    const plotOptions: Options = {
        series: series
    }
    return plotOptions;
}


export function buildTooltipOptions(shared?: boolean, outside?: boolean) {
    const plotOptions: Options = {
        tooltip: {
            shared: shared ? shared : false,
            outside: outside ? outside : false
        }
    }

    return plotOptions;
}

export function addCategories(categories: string[]) {
    const plotOptions: Options = {
        xAxis: {
            categories: categories
        }
    }

    return plotOptions;
}

export function addTitle(title: string) {
    const plotOptions: Options = {
        title: {
            text: title
        }
    }

    return plotOptions;
}

