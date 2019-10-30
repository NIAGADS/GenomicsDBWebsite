import React from 'react';
import { connect } from 'react-redux';
import { RecordHeading } from 'wdk-client/Components';
import { HeaderRecordActions, RecordOutLink } from './../Shared';
import * as gr from './../../types';
import { resolveJsonInput, LinkType, withTooltip } from '../../../../util/jsonParse';
import { recordClassDisplayName } from 'wdk-client/Core/MoveAfterRefactor/StoreModules/StepAnalysis/StepAnalysisSelectors';

interface StoreProps {
	externalUrls: { [key: string]: any },
	webAppUrl: string
}

const enhance = connect<StoreProps, any, IRecordHeading>(
	(state: any) => ({ externalUrls: state.globalData.siteConfig.externalUrls, webAppUrl: state.globalData.siteConfig.webAppUrl })
);

interface IRecordHeading {
	record: gr.GWASDatasetRecord;
	recordClass: { [key: string]: any };
	headerActions: gr.HeaderActions[];
}

type GWASDatasetRecord = StoreProps & gr.GWASDatasetRecord;

const GWASDatasetRecordSummary: React.SFC<IRecordHeading & StoreProps> = props => {
	const { record, recordClass, headerActions, externalUrls } = props;
	return <React.Fragment>
		<div className="dataset-record-summary-container">
			<div>
				<HeaderRecordActions
					record={record}
					recordClass={recordClass}
					headerActions={headerActions}
				/>
				<h1 className="wdk-RecordHeading">Dataset: {record.displayName}</h1>
			</div>
			<h2>
				{record.attributes.name} 
				{record.attributes.is_adsp && <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp)}</strong>}
			</h2>
			<ul>
			
				<li><h5 className="dataset-subtitle">{record.attributes.description}</h5></li>
				<li><span className="label">Category:</span> {recordClass.displayName}</li> 
				<li><span className="label">Explore related datasets:</span>{resolveJsonInput(record.attributes.accession_link)} </li>
				<li>{resolveJsonInput(record.attributes.search_link)}</li>	
			</ul>
		</div>
	</React.Fragment>
}

export default enhance(GWASDatasetRecordSummary);
