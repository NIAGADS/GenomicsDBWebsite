import { Options, OptionsStackingValue } from 'highcharts';
import { Term, Glossary } from '../../../data/glossary';
import { merge } from 'lodash';
import { _color_blind_friendly_palettes as PALETTES} from '../palettes';

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

export const HIGHCHARTS_DEFAULTS: Options = {
    credits: { enabled: false }
}

export function buildChartOptions(chartType: string) {
    switch (chartType) {
        case "pie":
            return buildPieChartOptions();
        case "column":
            return buildColumnChartOptions();
        case "bubble":
            return buildBubbleChartOptions();
        case "gene_gws_summary":
            return buildGeneGwsSummaryOptions();
        case "variant_gws_summary":
            return buildVariantGwsSummaryOptions();
        case "imanhattan":
            return buildInteractiveManhattanOptions();
        default:
            return HIGHCHARTS_DEFAULTS;
    }
}


export function buildInteractiveManhattanOptions(options?: Options) {

    function formatTooltip(point: any) {
        var label = point.refsnp ? point.refsnp : point.variant;
        var link =
            '<a href="../variant/' +
            point.variant +
            '">' +
            label +
            "</a>";

        return (
            link + "<br/> <strong>p-value = " + point.pvalue + "</strong></br>");
    }

    let plotOptions: Options = {
        plotOptions: {
            series: {
                turboThreshold: 500000,
                marker: {
                    radius: 2
                }
            }
        },
        title: {
            text: ""
        },
        loading: {
            showDuration: 10000
        },
        yAxis: {
            min: 0,
            max: 50,
            title: {
                useHTML: true,
                text: "-log<sub>10</sub> <em>p</em>-value"
            },
            labels: {
                formatter: function () {
                    if (this.value == 50) { return ">=" + this.value.toString(); }
                    return this.value.toString();
                }
            },
            plotLines: [
                {
                    color: "red",
                    width: 1,
                    dashStyle: "Dash",
                    value: 7.30102999566,
                    label: { text: "p <= 5e-8", style: { color: "red" }, align: "right" },
                    zIndex: 5
                }
            ]
        },
        tooltip: {
            useHTML: true,
            hideDelay: 3000,
            style: {
                pointerEvents: "auto"
            },
            headerFormat: "",
            pointFormatter: function () {
                return formatTooltip(this);
            }
        },

        legend: {
            enabled: false
        },
        xAxis: {
            min: 1,
            max: 22,
            minTickInterval: 1,
            tickInterval: 1,
            title: { text: "Chromosome" },
            labels: {
                align: "left"
            }
        }
    }


    if (options) {
        plotOptions = merge(plotOptions, options);
    }

    plotOptions = merge(plotOptions, noDataExports());

    return buildScatterChartOptions(plotOptions);
}

export function buildVariantGwsSummaryOptions(options?: Options) {
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
            title: { text: "N Datasets" }
        },
        legend: {
            enabled: false
        },
        navigation: {
            buttonOptions: {
                symbolSize: 10,
                symbolStrokeWidth: 1,
            }
        }
    }

    plotOptions = merge(plotOptions, disableLegendClick());
    plotOptions = merge(plotOptions, disableLegendHover());
    plotOptions = merge(plotOptions, limitedExportMenu());
    plotOptions = merge(plotOptions, disableSeriesAnimationOnLoad());
    plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.RdBlPu.slice(0, 2)));

    if (options) {
        plotOptions = merge(plotOptions, options);
    }

    return buildColumnChartOptions(true, "normal", plotOptions);
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
            title: { text: "N Variants (p < 5e-8)" }
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
    plotOptions = merge(plotOptions, applyCustomSeriesColor(PALETTES.RdBlPu));

    if (options) {
        plotOptions = merge(plotOptions, options);
    }

    return buildColumnChartOptions(true, "normal", plotOptions) // stacked bar (inverted column) w/additional formatting from above
}


export function buildPieChartOptions(options?: Options) {
    let plotOptions: Options = {
        chart: {
            type: "pie",
            plotShadow: false,
        }
    }

    if (options) {
        plotOptions = merge(plotOptions, options);
    }

    return Object.assign({}, HIGHCHARTS_DEFAULTS, plotOptions);
}

export function buildScatterChartOptions(options?: Options) {
    let plotOptions: Options = {
        chart: {
            type: "scatter",
            zoomType: "xy"
        }
    }

    if (options) {
        plotOptions = merge(plotOptions, options);
    }

    return Object.assign({}, HIGHCHARTS_DEFAULTS, plotOptions);
}

export function buildBubbleChartOptions(options?: Options) {
    let plotOptions: Options = {
        chart: {
            type: "bubble"
        }
    }

    if (options) {
        plotOptions = merge(plotOptions, options);
    }

    return Object.assign({}, HIGHCHARTS_DEFAULTS, plotOptions);
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



export function disableExport() {
    const plotOptions: Options = {
        exporting: {
            enabled: false
        }
    }

    return plotOptions;
}

export function noDataExports() {
    const HIGHCHARTS_EXPORTING_MENU_ITEMS = [
        "printChart",
        "separator",
        "downloadPNG",
        "downloadJPEG",
        "downloadPDF",
        "downloadSVG",
        "separator",
        "openInCloud"
    ];

    const plotOptions: Options = {
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: HIGHCHARTS_EXPORTING_MENU_ITEMS
                }
            }
        }
    }

    return plotOptions;

}

export function limitedExportMenu() {
    const plotOptions: Options = {
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

export function disableChartAnimationOnUpdate() {
    const plotOptions: Options = {
        chart: {
            animation: false
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
    const plotOptions: Options = {
        colors: palette
    }

    return plotOptions;
}

export function formatLegend(options:any) {
    const plotOptions: Options = {
        legend: options
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

export function backgroundTransparent() {
    const plotOptions: Options = {
        chart: {
            backgroundColor: "transparent"
        }
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

export function addCategories(categories: string[], axis: string = "xAxis") {

    const plotOptions: Options = axis === "xAxis"
        ? { xAxis: { categories: categories } }
        : { yAxis: { categories: categories } }

    return plotOptions;
}

export function addTitle(title: string, layout: any = null, style: any = null ) {

    const plotOptions: Options = title !== null
        ? {
            title: {
                text: title
            }
        }
        : {
            title: {
                text: undefined
            }
        }

    if (layout) {
        plotOptions.title = merge(plotOptions.title, layout);
    }
    if (style) {
        plotOptions.title = merge(plotOptions.title, style)
    }

    return plotOptions;
}

