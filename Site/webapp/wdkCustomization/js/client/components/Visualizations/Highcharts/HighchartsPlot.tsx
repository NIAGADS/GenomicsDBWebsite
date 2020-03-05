import React, { useLayoutEffect, useState } from 'react';
import { isEmpty, merge } from 'lodash';

import { buildChartOptions, addCategories, addTitle, addSeries } from './HighchartsOptions';

import Highcharts, { Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts); // add module to namespace

import ExportData from 'highcharts/modules/export-data';
ExportData(Highcharts);

import Data from 'highcharts/modules/data';
Data(Highcharts);

import Heatmap from 'highcharts/modules/heatmap';
Heatmap(Highcharts);

require('highcharts/highcharts-more')(Highcharts); // bubble plot & others

export interface HighchartsPlotProps {
	data: any,
	properties: any
	noDataMessage?: string;
	displayNoDataMessage?: boolean;
	plotOptions?: Options;
}

export function buildOptions(data: any, properties: any, options: Options) {

	let opts = buildChartOptions(properties.type);

	if (data.categories)
		opts = merge(opts, addCategories(data.categories));

	if (data.ycategories) {
		opts = merge(opts, addCategories(data.ycategories, 'yAxis'));
	}

	if (data.series) {
		opts = merge(opts, addSeries(data.series))
	}

	if (data.title) {
		opts = merge(opts, addTitle(data.title));
	}

	if (options) 
		opts = merge(opts, options);

	return opts;
}


const HighchartsPlot: React.FC<HighchartsPlotProps> = props => {
	const { data, properties, noDataMessage, displayNoDataMessage, plotOptions } = props;
	const [options, setOptions] = useState(plotOptions);

	useLayoutEffect(() => {
		setOptions(buildOptions(data, properties, plotOptions))
		/*if (!plotOptions) {
			setOptions(buildOptions(data, properties))
		}
		else {
			!options && setOptions(plotOptions);
		}*/
	}, [data, plotOptions]);

	const message = options ? "Loading..." : noDataMessage ? noDataMessage : "None reported.";
	const displayMessage = displayNoDataMessage === false ? false : true;

	return (
		options ?
			<HighchartsReact highcharts={Highcharts}
				options={options} />
			: displayMessage ? <div>{message}</div> : null
	);
}

export default HighchartsPlot;