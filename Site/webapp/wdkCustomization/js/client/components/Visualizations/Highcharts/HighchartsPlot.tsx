import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

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

export interface HighchartsPlotProps {
	data: any,
	properties: any
	noDataMessage?: string;
	displayNoDataMessage?: boolean;

}

function _buildOptions(props: HighchartsPlotProps) {
	const {data, properties} = props;

	let opts = {};
	if (data) {
		opts = buildChartOptions(properties.chartType, properties);
	}

	if (data.categories)
		Object.assign(opts, addCategories(data.categories));

	if (data.series) {
		Object.assign(opts, addSeries(data.series))
	}

	if (data.title) {
		Object.assign(opts, addTitle(data.title));
	}

	return (opts);
}


const HighchartsPlot: React.FC<HighchartsPlotProps> = props => {
	const { data, properties, noDataMessage, displayNoDataMessage } = props;

	const message = noDataMessage ? noDataMessage : "None reported.";
	const displayMessage = displayNoDataMessage === false ? false : true;

	const options = _buildOptions(props);

	return (
		data ?
			<HighchartsReact highcharts={Highcharts} options={options} />
			: displayMessage ? <div>{message}</div> : null
	);
}

export default HighchartsPlot;