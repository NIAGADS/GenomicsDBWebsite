import React, { useEffect } from 'react';
//@ts-ignore
import Ideogram from 'ideogram';

interface IdeogramProps {
	annotations: any;
	container: string;
	legend?: any;
	config?: any; // set options from the ideogram API
	tracks?: any; // maybe set in config/ this is for legacy support
}

const IdeogramPlot: React.SFC<IdeogramProps> = props => {
	const { annotations, container, legend, tracks, config } = props;

	useEffect(() => {
		if (annotations) {
			let baseConfig:any = {
				organism: 'human',
				container: '#'.concat(container),
				dataDir: 'https://unpkg.com/ideogram@1.16.0/dist/data/bands/native/',
				annotations: annotations
			}
			
			if (legend) {
				baseConfig['legend'] = legend;
			}		

			if (tracks) {
				baseConfig['tracks'] = tracks;
 			}
			
			new Ideogram(Object.assign({}, baseConfig, config));
		}
	}, []);

	return (
		<div id={container} className="ideogram-plot"></div>
	)

}

export default IdeogramPlot;
