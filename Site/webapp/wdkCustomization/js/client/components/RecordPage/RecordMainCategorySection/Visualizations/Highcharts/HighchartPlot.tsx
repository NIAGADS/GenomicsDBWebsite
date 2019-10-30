import React from 'react';
import { isEmpty } from 'lodash';

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


interface HighchartBaseProps {
	chart: Options,
	multiPlot: boolean
}


type HighchartPlotProps = HighchartBaseProps;

class HighchartPlot extends React.Component<HighchartPlotProps> {
	constructor(props: HighchartPlotProps) {
		super(props);
	}


	render = (): any => {
		return isEmpty(this.props.chart) || !this.props.chart ? "None reported" :
			this.props.multiPlot ?
				<div className="highchart-plot col-sm">
					<HighchartsReact highcharts={Highcharts} options={this.props.chart} />
				</div>
				:
				<div className="highchart-plot">
					<HighchartsReact highcharts={Highcharts} options={this.props.chart} />
				</div>
	}
}

export default HighchartPlot;