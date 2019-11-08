import React from 'react';
import { Link } from 'wdk-client/Components';
import { safeHtml } from 'wdk-client/Utils/ComponentUtils';
import { loadSearches } from 'ebrc-client/App/Searches/SearchCardActionCreators';
interface FeatureItem {
	config: {
		title: string,
		description: string,
		id: string
	},
	className?: string
}

const FeatureItem: React.SFC<FeatureItem> = props => {
	const { config, className } = props;
	return <div className={`feature-item ${className}`}>
		{/*<div className='icon-section mr-2'>
			<span className='fa fa-check-circle-o fa-5x' />
</div>*/}
		<div className='text-section'>
			<h4>{config.title}</h4>
			<p>{safeHtml(config.description)}</p>
			<div className='search-buttons'>
				<Link className='feature-link-button' to={'record/dataset/'.concat(config.id)}>Explore this dataset</Link></div>
			</div>
		
		</div>
	
}

export default FeatureItem;