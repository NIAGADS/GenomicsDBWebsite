import React, { useEffect, useState } from 'react';
import { isEmpty, assign } from 'lodash';
import { Options } from 'highcharts';
import HighchartsPlot, { HighchartsPlotProps, buildOptions } from './HighchartsPlot';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import './HighchartsTrellisPlot.scss';

// https://jsfiddle.net/65mbxwc9/

export const HighchartsColumnTrellis: React.FC<HighchartsPlotProps> = props => {
	const { data, properties, noDataMessage, displayNoDataMessage } = props;

	return (
		data ? <Container>
			<Row>
				{data.map((item: any, index: number) => {
					return (
						<Col key={`col_${index}`}>
							<HighchartsPlot data={item} properties={properties} />
						</Col>
					)
				})}
			</Row>
		</Container> : null
	)
}

interface TableTrellisProps {
	yAxisTitle: string;

}

export const HighchartsTableTrellis: React.FC<HighchartsPlotProps & TableTrellisProps> = props => {
	const { yAxisTitle, data, properties, noDataMessage, displayNoDataMessage } = props;

	return (
		data ? <Container>
			<Table className="table-trellis-plot">
				<tbody>
					<tr>
						{data.map((item: any, index: number) => {
							let plotOptions: Options = {				
								legend: {
									enabled: index == (data.length - 1),
									layout: "vertical",
									align: "right",
									verticalAlign: "middle",
									itemStyle: {fontWeight: "10px", fontSize: "10px"},
								},
								chart: {
									width: index == (data.length - 1) ? 300 : 250
								}
							}
							return (
								<td key={index}>
									<HighchartsPlot data={item} properties={properties} plotOptions={plotOptions} />
								</td>
							)
						})}
					</tr>
				</tbody>
			</Table>
		</Container> : null
	)
}


