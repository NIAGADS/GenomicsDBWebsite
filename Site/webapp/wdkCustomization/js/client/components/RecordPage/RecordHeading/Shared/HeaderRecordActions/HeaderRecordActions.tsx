import React from 'react';
import { HeaderActions } from './../../../types';
import { RecordActionLink } from 'wdk-client/Components';

interface HeaderRecordActions {
	record: any,
	recordClass: any,
	headerActions: HeaderActions[],
	className?: string,
	href?: string,
	showLabel?: boolean
}

const HeaderRecordActions: React.SFC<HeaderRecordActions> = props => {
	return <ul className="wdk-RecordActions d-flex">
		{props.headerActions.map((action, index) => {
			return (
				<li key={index} className="wdk-RecordActionItem">
					<RecordActionLink
						record={props.record}
						recordClass={props.recordClass}
						{...action}
					/>
				</li>
			);
		})}
	</ul>
}

// return the attribute details from the record class
export function getAttributeByName(recordClass: any, attributeName:string) {
	let targetAttribute = recordClass.attributes.filter(
		function(attribute: any){ return attribute.name == attributeName }
	);
	return targetAttribute[0];
  }


  // return attribute properties (specified in propertyList in model)
export function getAttributePropertiesByName(recordClass: any, attributeName:string) {
	let targetAttribute = recordClass.attributes.filter(
		function(attribute: any){ return attribute.name == attributeName }
	);
	return targetAttribute[0].properties;
}

// return chartProperties (specified in propertyList (name=chartProperties) in model)
export function getAttributeChartProperties(recordClass: any, attributeName: string) {
	let targetAttribute = recordClass.attributes.filter(
		function(attribute: any){ return attribute.name == attributeName }
	);
	return targetAttribute[0].properties.chartProperties;
}

export default HeaderRecordActions;