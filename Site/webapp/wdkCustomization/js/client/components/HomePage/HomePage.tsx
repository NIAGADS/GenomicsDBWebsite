import React from "react";
import { connect } from "react-redux";
//import AutoCompleteSearch from "../../components/AutoCompleteSearch/AutoCompleteSearch";
import { MultiSearch } from "../../components/Shared";
import { Link } from "wdk-client/Components";
import FeatureItem from "./FeatureItem/FeatureItem";

// background: image-url('search-panel-bkgrd.jpg') no-repeat 0px -200px;
interface SectionProps {
    webAppUrl: string;
}

const SearchHero: React.FC<SectionProps> = (props) => {
    const { webAppUrl } = props;

    return (
        <div
            className="search-panel container-fluid"
            style={{
                background: `url(${webAppUrl}/wdkCustomization/images/layout/search-panel-bkgrd.jpg) no-repeat 0px -170px`,
                backgroundSize: "cover",
                backgroundColor: "#233543",
            }}
        >
            <div className="row justify-content-md-center mb-4">
                <div className="col-sm-6 ml-5">
                    <h1 className="main-title">
                        NIAGADS <br /> Alzheimer's Genomics Database
                    </h1>
                    <div className="welcome-text">Explore Alzheimer's disease genetics and genomic annotations.</div>
                </div>
            </div>
            <div className="row justify-content-md-center">
                <div className="col-sm-6 search-panel quick-search-container-main">
                    <div className="quick-search-container-main">
                        <MultiSearch selected={null} setSelected={(arg: any) => console.log(arg)} />
                        <div className="search-examples mt-1">
                            <p>
                                Examples - Gene: <Link to={"record/gene/ENSG00000130203"}> APOE</Link> - Variant by
                                RefSNP: <Link to="record/variant/rs6656401">rs6656401</Link> - Variant:{" "}
                                <Link to="record/variant/19:45411941:T:C_rs429358">19:45411941:T:C</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Features: React.FC<SectionProps> = (props) => {
    const { webAppUrl } = props;
    return (
        <div className="container-fluid feature-highlight">
            <div className="row feature-highlight section-heading justify-content-md-center">
                <div className="col-sm-4">
                    <h3 className="text-center">Featured Datasets</h3>
                    <h2 className="text-center">
                        GWAS summary statistics from the International Genomics of Alzheimer's Project (IGAP)
                    </h2>
                </div>
            </div>
            <div className="row justify-content-md-center">
                <div className="d-flex">
                    {_featureConfig.map((feature) => (
                        <FeatureItem key={feature.title} feature={feature} webAppUrl={webAppUrl} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const HomePage: React.SFC<SectionProps> = (props) => {
    const { webAppUrl } = props;
    return (
        <div className="home-page">
            <SearchHero webAppUrl={webAppUrl} />
            <Features webAppUrl={webAppUrl} />
        </div>
    );
};

const _featureConfig = [
    {
        title: "Discovery Phase 1 (Lambert et al. 2013)",
        description:
            "NG00036: Summary statistics from the 2013 meta-analysis of the IGAP discovery phase 1 GWAS data in Alzheimer's disease",
        id: "NG00036",
    },
    {
        title: "APOE Stratified (Jun et al. 2016)",
        id: "NG00078",
        description:
            "NG00078: Summary statistics from an APOE-stratified genome-wide association meta-analysis for AD status performed using the IGAP discovery phase dataset. Summary statistics are available for all samples, as well as subsets of just APOE&epsilon;4 carriers or APOE&epsilon;4 non-carriers. Summary statistics from an interaction test with APOE&epsilon;4 status are also available",
    },
    {
        title: "Rare Variants (Kunkle et al 2019)",
        id: "NG00075",
        description:
            "NG00075: Summary statistics from meta-analysis results examining SNPs genotyped or imputed in at least 30% of the AD cases and 30% of the control samples across all datasets",
    },
];

export default connect<{ webAppUrl: string }, any, {}>((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}))(HomePage);
