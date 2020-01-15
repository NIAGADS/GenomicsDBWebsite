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

export default HeaderRecordActions;