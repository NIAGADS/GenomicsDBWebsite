import React from 'react';

interface RecordOutLink {
	baseUrl: string;
	modelKey: string;
	title: string;
	attributes?: any;
	render?: { (props: RecordOutLink, val: string): React.ReactElement<any> }
}

const RecordOutLink: React.SFC<RecordOutLink> = props => {
	const val = props.attributes[props.modelKey];
	return val ? props.render(props, val) : null;
}

export default RecordOutLink;