import React from 'react';

interface ImpactIndicator {
	impact: string;
}

const ImpactIndicator: React.SFC<ImpactIndicator> = props => {
	const { impact } = props;
	return <span className={`impact-indicator ${impact.toLowerCase()}`}>{impact}</span>
}

export default ImpactIndicator; 