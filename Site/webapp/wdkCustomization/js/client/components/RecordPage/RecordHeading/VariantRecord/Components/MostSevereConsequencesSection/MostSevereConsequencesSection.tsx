import React from 'react';
import * as gr from './../../../../types';
import { resolveJsonInput, isJson } from './../../../../../../util/jsonParse';
import { ImpactIndicator } from '../../../Shared/index';

interface MSConsequencesSection {
	attributes: gr.VariantRecordAttributes
}
const MostSevereConsequencesSection: React.SFC<MSConsequencesSection> = props => {
	const { attributes } = props;
	return (
	<div className="record-detail-container bordered mb-2 pb-2">
		<p>
			<span className='label'><strong>Consequence:</strong>&nbsp;</span>{attributes.most_severe_consequence}&nbsp;
			{attributes.msc_is_coding && resolveJsonInput(attributes.msc_is_coding)}
		</p>

		{attributes.msc_impact &&
			<p><span className='label'><strong>Impact:</strong>&nbsp;</span><ImpactIndicator impact={attributes.msc_impact} /></p>}

		<div className='attributes-container ml-2'>
			{attributes.msc_amino_acid_change && <p><span className='label'>Amino Acid Change:&nbsp;</span>{attributes.msc_amino_acid_change}</p>}
			{attributes.msc_codon_change && <p><span className='label'>Codon Change:&nbsp;</span>{attributes.msc_codon_change}</p>}

			{attributes.msc_impacted_gene_link && <p><span className='label'>Impacted Gene:&nbsp;</span>{resolveJsonInput(attributes.msc_impacted_gene_link)}</p>}
			{attributes.msc_impacted_transcript && <p><span className='label'>Impacted Transcript:&nbsp;</span>{resolveJsonInput(attributes.msc_impacted_transcript)}</p>}
		</div>
	</div>);
}

export default MostSevereConsequencesSection;

