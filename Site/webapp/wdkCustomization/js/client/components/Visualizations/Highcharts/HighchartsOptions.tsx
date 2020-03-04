import { Options, OptionsStackingValue } from 'highcharts';

export const HIGHCHARTS_DEFAULTS: Options = {
    credits: { enabled: false }
}


export function buildChartOptions(chartType:string) {
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
    let plotOptions:Options = {
        yAxis: {
            title: { text: "N GWAS Variants within +/- 100kb of the gene" }
        },
    }
    if (options) {
        plotOptions = Object.assign(plotOptions, options);
    }
    return buildColumnChartOptions(true, "normal", plotOptions)
}


export function buildColumnChartOptions(inverted?: boolean, stacking?: OptionsStackingValue, options?: Options) {
    const sharedTooltip = true;
    const drawTooltipsOutside = true;

    let plotOptions:Options = { 
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
        plotOptions = Object.assign(plotOptions, options);
    }
    
    return Object.assign(HIGHCHARTS_DEFAULTS, plotOptions);
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

