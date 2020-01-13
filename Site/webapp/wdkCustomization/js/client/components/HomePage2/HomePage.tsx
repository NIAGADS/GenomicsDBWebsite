import React from "react";
import { connect } from "react-redux";
import AutoCompleteSearch from "../../components/AutoCompleteSearch/AutoCompleteSearch";
import FeatureItem from "./FeatureItem/FeatureItem";
import Carousel from "./Carousel/Carousel";
import { Link } from "wdk-client/Components";

interface HomePage {
  webAppUrl: string;
}

const HomePage: React.SFC<HomePage> = props => {
  const { webAppUrl } = props;
  return (
    <div className="home-page2">
      <div
        className="row section-1"
        style={{
          background: `url(${webAppUrl}/images/genomicsdb-hero.jpg) 0 -500px`
        }}
      >
        <div className="section col-sm-12 pt-5 pb-5">
          <div className="col-sm-12 site-title">
            <div>
              <h1>NIAGADS</h1>
              <h1>Alzheimer's Genomics Database</h1>
            </div>
            <div>
              <h5>
                Explore Alzheimer's disease genetics and genomic annotations.
              </h5>
            </div>
          </div>
          <div className="col-sm-12 quick-search-container-main">
            <div className="quick-search-container-main">
              <AutoCompleteSearch />
              <div className="search-examples">
                <p>
                  Examples - Gene:{" "}
                  <Link to={"record/gene/ENSG00000130203"}> APOE</Link> -
                  Variant by RefSNP:{" "}
                  <Link to="record/variant/rs6656401">rs6656401</Link> -
                  Variant:{" "}
                  <Link to="record/variant/19:45411941:T:C_rs429358">
                    19:45411941:T:C
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row section-2">
        <div className="section col-sm-12">
          <div className="heading">
            <h1>Featured Datasets</h1>
            <p className="subtitle">
              GWAS summary statistics from the International Genomics of
              Alzheimer's Project (IGAP)
            </p>
          </div>
          <div className="feature-items row">
            {_featureConfig.map(config => (
              <FeatureItem
                key={config.title}
                className="col-md-4 "
                config={config}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="row section-3">
        <div className="section col-sm-12">
          <Carousel items={_carouselConfig} />
        </div>
      </div>
      {/*<div className="row section-4">
			<div className="section col-sm-12">
				<div className='heading'>
					<h1>Latest News</h1>
				</div>
				<div className='news-items row'>
					{
						_newsConfig.map((conf, i) => <NewsItem key={i} config={conf} className='col-md-4 ' />)
					}
				</div>
			</div>
				</div>*/}
    </div>
  );
};

export default connect<{ webAppUrl: string }, any, {}>((state: any) => ({
  webAppUrl: state.globalData.siteConfig.webAppUrl
}))(HomePage);

const _featureConfig = [
  {
    title: "Discovery Phase 1 (Lambert et al. 2013)",
    description:
      "NG00036: Summary statistics from the 2013 meta-analysis of the IGAP discovery phase 1 GWAS data in Alzheimer's disease",
    id: "NG00036"
  },
  {
    title: "APOE Stratified (Jun et al. 2016)",
    id: "NG00078",
    description:
      "NG00078: Summary statistics from an APOE-stratified genome-wide association meta-analysis for AD status performed using the IGAP discovery phase dataset. Summary statistics are available for all samples, as well as subsets of just APOE&epsilon;4 carriers or APOE&epsilon;4 non-carriers. Summary statistics from an interaction test with APOE&epsilon;4 status are also available"
  },
  {
    title: "Rare Variants (Kunkle et al 2019)",
    id: "NG00075",
    description:
      "NG00075: Summary statistics from meta-analysis results examining SNPs genotyped or imputed in at least 30% of the AD cases and 30% of the control samples across all datasets"
  }
];

const _carouselConfig = [
  {
    title: "INFERNO Reports",
    description:
      "New to the GenomicsDB are in-depth reports of GWAS summary statistics datasets.  These reports provide an overview of the top-variants identified by the study and summarize an INFERNO2 (inferring the molecular mechanisms of noncoding genetic variants, version 2) report that integrates the GWAS results with context-specific regulatory activity and linkage disequilibrium annotations. Support for the full INFERNO2 pipeline is coming soon.",
    image: "/genomics/images/inferno_report_example.png",
    iconClass: "chart",
    example: "record/gwas_summary/NG00036_STAGE1"
  }
];

const _newsConfig = [
  {
    title: "Title",
    date: "January 1, 2019",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque."
  },
  {
    title: "Title",
    date: "January 1, 2019",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque."
  },
  {
    title: "Title",
    date: "January 1, 2019",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque."
  }
];
