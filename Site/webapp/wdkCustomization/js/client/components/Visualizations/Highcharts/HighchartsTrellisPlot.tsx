import React, { useEffect, useState } from 'react';
import { isEmpty, assign } from 'lodash';
import HighchartsPlot, { HighchartsPlotProps, buildOptions } from './HighchartsPlot';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


// https://jsfiddle.net/65mbxwc9/

const HighchartsTrellisPlot: React.FC<HighchartsPlotProps> = props => {
	const { data, properties, noDataMessage, displayNoDataMessage } = props;
	
	return (
		<Container>
			<Row>
				{data.map((item: any, index: number) => {
					return (
						<Col key={`col_${index}`}>						
							<HighchartsPlot data={item} properties={properties} noDataMessage={noDataMessage} 
							displayNoDataMessage={displayNoDataMessage}/>
						</Col>
					)
				})}
			</Row>
		</Container>
	)
}

export default HighchartsTrellisPlot