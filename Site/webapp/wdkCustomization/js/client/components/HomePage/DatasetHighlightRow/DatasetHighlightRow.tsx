import React from 'react';
import { DatasetHighlightConfig } from '../../../data/highlightItems';


type DatasetHighlightRow = Pick<DatasetHighlightConfig,
	'id' | 'imgCaption' | 'imgUrl' | 'imgCaptionLink' | 'description' | 'actions'> &
{ scrollRef: React.RefObject<any> };


const DatasetHighlightRow: React.ComponentClass<DatasetHighlightRow> = class extends React.Component<DatasetHighlightRow> {

	private iconMap: { [key: string]: string } = {
		download: 'fa fa-download',
		jbrowse: 'fa fa-sliders',
		link: 'fa fa-caret-right',
		search: 'fa fa-search'
	}

	resolveIcon = (icon: string) => {
		return this.iconMap[icon];
	}

	render = () => <div className="row dataset-highlight-row" ref={this.props.scrollRef}>
		<div className="col-sm-12">
			<h4 className="highlight-title">Dataset Highlights</h4>
			<h2>{this.props.id}: {this.props.description}</h2>
		</div>
		<div className="col-md-7 caption">
			<img src={this.props.imgUrl} />
			<small
			><p>
					{this.props.imgCaption}
					{this.props.imgCaptionLink.pmid &&
						<span>
							&nbsp;PMID:&nbsp;<a href={this.props.imgCaptionLink.link}>{this.props.imgCaptionLink.pmid}</a>
						</span>}
				</p>
			</small>
		</div>
		<div className="col-md-5">
			<ul>
				{this.props.actions.map((action, i) => <li key={i}>
					<a href={action.link} title={action.title} className="badge">
						{action.anchorText}
						&nbsp;
						<i className={this.resolveIcon(action.icon)} />
					</a>
				</li>)}
			</ul>
		</div>
	</div>
}

export default DatasetHighlightRow;