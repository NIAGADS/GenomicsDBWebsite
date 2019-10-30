import React from 'react';

interface NewsItem {
	config: {
		title: string,
		date: string,
		description: string,
	}
	className?: string
}

const NewsItem: React.SFC<NewsItem> = props => {
	const { config, className } = props;
	return <div className={`news-item ${className}`}>
		<div>
			<small className='date'>{config.date}</small>
			<h4 className='title'>
				{config.title}
			</h4>
		</div>
		<p>{config.description}</p>
		<div>
			<a className='read-more'>Read more</a>
		</div>
	</div>
}

export default NewsItem;