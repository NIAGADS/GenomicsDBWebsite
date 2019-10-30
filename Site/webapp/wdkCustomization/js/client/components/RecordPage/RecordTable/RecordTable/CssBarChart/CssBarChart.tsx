import React from 'react';

interface CssBarChart {
	pctFull: number;
	original: any;
}

const CssBarChart: React.SFC<CssBarChart> = props => {
	return <span className='css-bar-chart'>
		<span className='pct-text'>{props.original}</span>
		<span className='chart-container'>
			<span className='filled' style={{ width: `${props.pctFull}%` }} />
			<span className='empty' />
		</span>
	</span>
}

export default CssBarChart;