import React from 'react';

interface ImpactIndicator {
	impact: string;
}

export const ImpactIndicator: React.SFC<ImpactIndicator> = props => {
	const { impact } = props;
	return <span className={`impact-indicator ${impact.toLowerCase()}`}>{impact}</span>
}

