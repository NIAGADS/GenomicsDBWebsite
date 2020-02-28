import React from 'react';
import { isEmpty, assign } from 'lodash';
import HighchartPlot from './HighchartPlot';


// https://jsfiddle.net/65mbxwc9/

interface PlotProps {
	charts: string,
	attribute: string;
}

class HighchartTrellisPlot extends React.Component<PlotProps> {
	constructor(props: PlotProps) {
		super(props);
	}

	render = (): any => {
		return isEmpty(this.props.charts) || !this.props.charts ? "None reported" :
			<div className="highcharts-plot-list row">
				{JSON.parse(this.props.charts).map((item: any) => {
					return (<HighchartPlot multiPlot={true} chart={item.chart} key={this.props.attribute.concat('_').concat(item.name)} />)
				})}
			</div>
	}
}

export default HighchartTrellisPlot;
