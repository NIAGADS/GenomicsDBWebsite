import React, { useState } from 'react'
import { Link } from 'wdk-client/Components';
interface Carousel {
	items: {
		title: string;
		description: string;
		iconClass: string;
		example: string;
		image: string;
	}[]
}

const Carousel: React.SFC<Carousel> = props => {
	const { items } = props,
		maxIndex = items.length ? items.length - 1 : 0,
		[index, setIndex] = useState(0),
		incrementIndex = () => {
			const idx = index === maxIndex ? 0 : index + 1;
			return setIndex(idx);
		},
		decrementIndex = () => {
			const idx = index === 0 ? maxIndex : index - 1;
			return setIndex(idx);
		}

	return <div className='carousel'>
		<div className='content-section'>
			<div className='top-section'>
				<h2>{items[index].title}</h2>
				<p>{items[index].description}</p>
				<div className='search-buttons'>

					<Link className="carousel-example-button" to={items[index].example}>View</Link>

				</div>
			</div>
			{/* <div>
				<span className='fa fa-2x fa-arrow-circle-o-left carousel-toggle'
					onClick={decrementIndex} />
				<span className='fa fa-2x fa-arrow-circle-o-right carousel-toggle'
					onClick={incrementIndex} />

			</div> */}
		</div>
		<div className='icon-section'>
			<img src={items[index].image} className="carousel-example-image" />
			{/*<span className={`fa fa-${items[index].iconClass}`} />*/}
		</div>
	</div>
}

export default Carousel;