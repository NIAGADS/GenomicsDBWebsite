import React from 'react';
import Ideogram from 'ideogram';

import { isEmpty } from 'lodash';

interface IdeogramBaseProps {
	data: string,
	tracks: string,
	container: string;
}


type IdeogramPlotProps = IdeogramBaseProps;

class IdeogramPlot extends React.Component<IdeogramPlotProps> {
	constructor(props: IdeogramPlotProps) {
		super(props);
	}

	componentDidMount = () => new Ideogram(  
	{
		organism: 'human',
		asm: 'GRCh37',
		orientation: 'vertical',
		//chrWidth: 20,
		annotations: this.props.data,
		annotationTracks:  this.props.tracks,
		annotationHeight: 5,
		container: '#'.concat(this.props.container),
		dataDir: 'https://unpkg.com/ideogram@1.9.0/dist/data/bands/native/',
		rotatable: false
		//showBandLabels: true,
	});

	render = ():any => {
		return isEmpty(this.props.data) || !this.props.data ? "No annotations reported" : <div id={this.props.container} className="ideogram-plot"></div>
	}
}

export default IdeogramPlot;
