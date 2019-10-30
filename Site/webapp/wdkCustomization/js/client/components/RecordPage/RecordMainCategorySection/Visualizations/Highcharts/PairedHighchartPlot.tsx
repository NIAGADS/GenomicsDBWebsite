import React from 'react';

import Highcharts, { Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts); // add module to namespacew

import Data from 'highcharts/modules/data';
Data(Highcharts);

import Heatmap from 'highcharts/modules/heatmap';
Heatmap(Highcharts);


interface HighchartBaseProps {
	chart: Options
}


type HighchartPlotProps = HighchartBaseProps;

class HighchartPlot extends React.Component<HighchartPlotProps> {
	constructor(props: HighchartPlotProps) {
		super(props);
	}


	render = ():any => {
		return <HighchartsReact highcharts={Highcharts} options={this.props.chart}/>
	}
}

export default HighchartPlot;
