import React, { useEffect } from 'react';
//@ts-ignore
import Ideogram from 'ideogram';

interface IdeogramProps {
	annotations: any;
	tracks: any;
	container: string;
	legend?: any;
	annotationHeight?: number;
	chrWidth?: number;
	genomeBuild?: "GRCh37" | "GRCh38";
	orientation?: "vertical" | "horizontal";
	rotatable?: boolean;
	showBandLabels?: boolean;
}

const IdeogramPlot: React.SFC<IdeogramProps> = props => {
	const { annotations, tracks, container, legend, annotationHeight, chrWidth, genomeBuild, orientation, rotatable, showBandLabels } = props;

	useEffect(() => {
		let ideogramProps:any = {
			organism: 'human',
			asm: genomeBuild ? genomeBuild : 'GRCh37',
			container: '#'.concat(container),
			dataDir: 'https://unpkg.com/ideogram@1.9.0/dist/data/bands/native/',
			orientation: orientation ? orientation : 'vertical',
			rotatable: rotatable ? rotatable : false,
			showBandLabels: showBandLabels ? showBandLabels: false,
			annotationHeight: annotationHeight ? annotationHeight : 5,
			annotationTracks: tracks
		}

		if (chrWidth) {
			ideogramProps['chrWidth'] = chrWidth;
		}

		if (legend) {
			ideogramProps['legend'] = legend;
		}



		if (annotations) {
			ideogramProps['annotations'] = annotations;
			new Ideogram(ideogramProps);
		}
	}, []);

	return (
		<div id={container} className="ideogram-plot"></div>
	)

}

export default IdeogramPlot;
