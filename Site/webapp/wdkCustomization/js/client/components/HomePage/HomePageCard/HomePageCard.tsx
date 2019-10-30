import React from 'react';

interface HomePageCard {
	imgUrl: string;
	title: string;
}

let HomePageCard: React.SFC<HomePageCard> = props =>
	<div className="home-page-card-container">
		<div className="home-page-card-header">
			<div className="image-container">
				<img src={props.imgUrl} />
			</div>
			<div className="home-page-card-title">
				<h4>{props.title}</h4>
			</div>
		</div>
		<div className="home-page-card-content">
			{props.children}
		</div>
	</div>

export default HomePageCard;