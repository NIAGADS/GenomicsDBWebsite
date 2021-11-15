import React from 'react';

import "./ImpactIndicator.scss";

interface ImpactIndicator {
	impact: string;
}

export const ImpactIndicator: React.SFC<ImpactIndicator> = props => {
	const { impact } = props;
	return <span className={`impact-indicator ${impact.toLowerCase()}`}>{impact}</span>
}

