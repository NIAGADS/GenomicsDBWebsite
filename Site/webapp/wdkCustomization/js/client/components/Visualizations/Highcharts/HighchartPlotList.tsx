import React from 'react';
import { isEmpty, assign } from 'lodash';
import HighchartPlot from './HighchartPlot';

interface HighchartListBaseProps {
	charts: string,
	attribute: string;
}


type HighchartPlotListProps = HighchartListBaseProps;

class HighchartPlotList extends React.Component<HighchartPlotListProps> {
	constructor(props: HighchartPlotListProps) {
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

export default HighchartPlotList;
