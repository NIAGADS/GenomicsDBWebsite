import React, { useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { HeaderRecordActions } from './../Shared';
import * as gr from './../../types';
import { resolveJsonInput } from '../../../../util/jsonParse';
import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";
import { HelpIcon } from 'wdk-client/Components';
//import { useHistory } from 'react-router-dom';

const cx = makeClassNameHelper("InlineSearch");

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

interface SearchProps {
	accession: string;
	dataset: string;
}

type GWASDatasetRecord = StoreProps & gr.GWASDatasetRecord;

const SEARCH_ROUTE = "/app/search/variant_gwas_stats";
const ACCESSION_PARAM_NAME = "gwas_accession";
const DATASET_PARAM_NAME = "gwas_dataset";
const PVALUE_PARAM_NAME = "pvalue";


const GWASDatasetSearchHelp: React.SFC<any> = props => {
	return (
		<div>
		<p>Set the adjusted p-value threshold for GWAS significant. The search will return all genes supported by an p-value &le; the specified threshold.</p> 
		<br/> 
		<p>p-values may be specified in decimal (e.g., 0.000003) or scientific (e.g., 3e-6 or 3^-6 or 3 x 10^-6) notation.</p> 
		<p>For exome array studies a p-value threshold of 1e-3 is recommended.</p>
		</div>
	)
}

const GWASDatasetSearch: React.SFC<SearchProps> = props => {
	const {accession, dataset} = props;
	const inputRef = useRef<HTMLInputElement>(null);
	//const history = useHistory();

	/* const onSearch = useCallback((queryString: string) => {
		history.push(`${SEARCH_ROUTE}?${queryString}`);
	  }, [ history ]); */

	/* const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const queryString = new URLSearchParams(formData as any).toString();
		onSearch(queryString);
	  }, [ onSearch ]);*/

 /*onSubmit={handleSubmit}*/ 
	return (
		<form action={SEARCH_ROUTE} className={cx("--SearchBox")}>
		<input type="hidden" name={ACCESSION_PARAM_NAME} value={accession}/>
		<input type="hidden" name={DATASET_PARAM_NAME} value={dataset}/>
		<label>Mine this dataset <HelpIcon children={<GWASDatasetSearchHelp/>}></HelpIcon></label>

		<input
		  ref={inputRef}
		  type="input"
		  onFocus={e => e.target.select()}
		  name={PVALUE_PARAM_NAME}
		  defaultValue='5e-8'
		  placeholder={'5e-8'}
		/>
		<button type="submit">
        <i className="fa fa-search" />
      </button>
		</form>
	);
}

const GWASDatasetRecordSummary: React.SFC<IRecordHeading & StoreProps> = props => {
	const { record, recordClass, headerActions, externalUrls } = props;
	return <React.Fragment>
		<div className="record-summary-container dataset-record-summary-container">
			<div>
				<HeaderRecordActions
					record={record}
					recordClass={recordClass}
					headerActions={headerActions}
				/>
				<h1 className="record-heading">Dataset: {record.attributes.name} </h1>
			</div>
			<h2>
				{record.attributes.is_adsp && <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp)}</strong>}
			</h2>
			<ul>
			
				<li><h5 className="dataset-subtitle">{record.attributes.description}</h5></li>
				<li><span className="label">Category:</span> {recordClass.displayName}</li> 
				<li><span className="label">Explore related datasets:</span>{resolveJsonInput(record.attributes.accession_link)} </li>
				<GWASDatasetSearch accession={record.attributes.niagads_accession} dataset={record.displayName} ></GWASDatasetSearch>
			</ul>
		</div>
	</React.Fragment>
}

export default enhance(GWASDatasetRecordSummary);
