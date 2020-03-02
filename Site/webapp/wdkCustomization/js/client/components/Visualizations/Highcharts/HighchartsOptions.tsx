import { Options } from 'highcharts';

export const HIGHCHARTS_DEFAULTS: Options = {
    credits: { enabled: false }
}

export function buildColumnChartOptions(options: any) {
    const sharedTooltip = true;
    const drawTooltipsOutside = true;

    let plotOptions:Options = { 
        chart: {
            type: "column",
            inverted: options.isInverted ? options.isInverted : false
        },
        legend: { 
            reversed: options.isInverted ? options.isInverted : false
        },
        plotOptions: {
            column: { 
                stacking: options.stacking ? options.stacking === "none" ? undefined : options.stacking
                    : undefined
            }
        }
    }

    plotOptions = Object.assign(plotOptions, buildTooltipOptions(sharedTooltip, drawTooltipsOutside));

    return Object.assign(HIGHCHARTS_DEFAULTS, plotOptions);
}

export function buildGeneGwsSummaryOptions(options: any) {
    const plotOptions:Options = {
        yAxis: {
            title: { text: "N GWS Variants" }
        },
    }
    return Object.assign(buildColumnChartOptions(options), plotOptions)
}

export function addSeries(series: any) {
    const plotOptions:Options = {
        series: series
    }
    return plotOptions;
}

export function buildTooltipOptions(shared?: boolean, outside?: boolean) {
    const plotOptions:Options = {
        tooltip: {
            shared: shared ? shared : false,
            outside: outside ? outside: false
        }
    }

    return plotOptions;
}

export function addCategories(categories:string[]) {
    const plotOptions:Options = {
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

export function buildChartOptions(chartType:string, options:any) {
    switch (chartType) {
        case "column":
            return buildColumnChartOptions(options);
        case "gene_gws_summary":
            return buildGeneGwsSummaryOptions(options);
        default:
            return HIGHCHARTS_DEFAULTS;
    }
}