import React from 'react';
import { connect } from 'react-redux';
import QuickSearchMulti from '../../components/QuickSearchMulti';
import DatasetHighlightSummary from './DatasetHighlightSummary/DatasetHighlightSummary';
import { adspHighlights, igapHighlights } from '../../data/highlightItems';
import HomePageCard from './HomePageCard/HomePageCard';
import DatasetHighlightRow from './DatasetHighlightRow/DatasetHighlightRow';

const HomePage = class extends React.Component<{ webAppUrl: string }> {
	private igapRef: React.RefObject<any>;
	private adspRef: React.RefObject<any>;

	constructor(props: { webAppUrl: string }) {
		super(props);
		this.igapRef = React.createRef();
		this.adspRef = React.createRef();
	}

	render = () => (<div className="container-fluid main-content home-page">
		<div className="row top-content">
			<div className="col-sm-12">
				<h1 className="site-title">
					Explore Alzheimer's Disease genetics and genomic annotations using the NIAG<span className="purple">AD</span>S Genomics Database.
	    	  </h1>
			</div>
			<div className="col-sm-12 quick-search-container-main">
				<div className="ml-3 quick-search-container-main">
					<QuickSearchMulti webappUrl={this.props.webAppUrl} showTooltip={false} />
					<div className="text-center">Examples - Gene: <a href="showRecord.do?name=GeneRecordClasses.GeneRecordClass&amp;primary_key=ENSG00000130203">APOE</a> - Variant by RefSNP: <a href="showRecord.do?name=VariantRecordClasses.VariantRecordClass&amp;primary_key=1:207692049:A:G_rs6656401">rs6656401</a> - Variant: <a href="showRecord.do?name=VariantRecordClasses.VariantRecordClass&amp;primary_key=19:45411941:T:C_rs429358">19:45411941:T:C</a></div>
				</div>
			</div>
		</div>
		<DatasetHighlightSummaryRow
			igapRef={this.igapRef}
			adspRef={this.adspRef}
		/>
		<div className="cards-container mt-5">
			<div className="row">
				<div className="col-md-4 card-column">
					<HomePageCard
						title="Explore"
						imgUrl="images/explore.png"
					>
						<div className="card-text"><p>Found something interesting? Download your result for further analysis.</p>
							<p>Registered users can share strategy and analysis results with the community or generate a static link for a publication.</p>
							<p>Bookmark your <a href="showFavorite.do">favorite</a> genes and variants and <a href="showApplication.do">save and annotate strategies</a> to create a personalized workspace.</p>
						</div>
					</HomePageCard>
				</div>
				<div className="col-md-4 card-column">
					<HomePageCard
						title="Aanalyze"
						imgUrl="images/analyze.png"
					>
						<div className="card-text">
							<p>Search strategies make it easy to ask sophisticated questions about your data.  Find <a href="showQuestion.do?questionFullName=VariantQuestions.VariantsByNiagadsDataset">variants associated with AD in NIAGADS GWAS datasets</a> or explore all available <a href="search.jsp">searches</a>.</p>
							<p><a href="showQuestion.do?questionFullName=GeneQuestions.GeneUpload">Upload a gene list</a> and take advantage of our functional and pathway enrichment tool to gain new insight into an existing dataset.</p>
							<p>Browse our <a href="javascript:void(0)">example search strategies</a> for some ideas.</p>
						</div>
					</HomePageCard>
				</div>
				<div className="col-md-4 card-column">
					<HomePageCard
						title="Share"
						imgUrl="images/share.png"
					>
						<div className="card-text">
							<p>The GenomicsDB provides a <a href="jbrowse.jsp">genome browser</a> that allows comparison of AD GWAS summary statistics tracks to sequence variation and transcriptional regulation.</p>
							<p>Not sure where to start? Search for your favorite gene or variant to explore its genomic context and then switch to a full browser view to add additional tracks.</p>
						</div>
					</HomePageCard>
				</div>
			</div>
		</div>
		<div className="highlights-container mt-5">
			{igapHighlights.map(hl => <div className="highlights-inner-container" key={hl.id}>
				<DatasetHighlightRow
					id={hl.id}
					imgCaption={hl.imgCaption}
					imgUrl={hl.imgUrl}
					imgCaptionLink={hl.imgCaptionLink}
					description={hl.description}
					actions={hl.actions}
					scrollRef={this.igapRef}
				/></div>)}
			{adspHighlights.map(hl => <div key={hl.id} className="highlights-inner-container">
				<DatasetHighlightRow
					id={hl.id}
					imgCaption={hl.imgCaption}
					imgUrl={hl.imgUrl}
					imgCaptionLink={hl.imgCaptionLink}
					description={hl.description}
					actions={hl.actions}
					scrollRef={this.adspRef}
				/></div>)}
		</div>
	</div>);
}

interface DatasetHighlightSummaryRow  {
	igapRef: React.RefObject<any>
	adspRef: React.RefObject<any>
}

const DatasetHighlightSummaryRow: React.SFC<DatasetHighlightSummaryRow> = props => {
	return <div className="dataset-highlight-summary-container mt-5">
		<div className="dataset-highlight-inner-container row">
			<div className="col-sm-12">
				<h4 className="highlight-title">Dataset Highlights</h4>
			</div>
			<div className="col-md-6 d-flex">
				<DatasetHighlightSummary
					project="IGAP"
					descriptions={igapHighlights}
					target={props.igapRef}
				/>
			</div>
			<div className="col-md-6 d-flex">
				<DatasetHighlightSummary
					project="ADSP"
					descriptions={adspHighlights}
					target={props.adspRef}
				/>
			</div>
		</div>
	</div>
}

const enhance = connect<{ webAppUrl: string }, any, {}>(
	(state: any) => ({ webAppUrl: state.globalData.siteConfig.webAppUrl })
);

export default enhance(HomePage);