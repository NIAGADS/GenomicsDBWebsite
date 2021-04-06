import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import {
    PrimaryExternalLink,
    MultiSearch,
    PrimaryActionButton,
    PrimaryLink,
    SearchResult,
    SecondaryLink,
    BoldPrimaryLink,
} from "../../components/Shared";
import { useGoto } from "../../hooks";

import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";

import { DarkContrastText, BaseText, Heading, Subheading } from "../Shared/Typography";



import { WhiteBackgroundSection, GreyBackgroundSection} from './Sections';
import { NarrowerWidthRow } from './CustomGridElements';
import { HighlightStatsSection } from './HighlightStatsSection';
import { LatestDatasetSection } from './NewsSection';
import { SearchSection } from './SearchSection';
import { GenomeBrowserSection } from './GenomeBrowserSection';
import { AboutSection } from './AboutSection';

interface HomePage {
    webAppUrl: string;
    endpoint: string;
}

const HomePage: React.FC<HomePage> = ({ endpoint, webAppUrl }) => {
    const goto = useGoto();

    useLayoutEffect(() => {
        //remove the padding that's required everywhere but here
        document.querySelectorAll(".wdk-PageContent")[0].setAttribute("style", "padding: 0;");
        return () => document.querySelectorAll(".wdk-PageContent")[0].setAttribute("style", "padding: 0 2em;");
    }, []);

    return (
        <Grid justify="center" container>
            {/* header */}
            <SearchSection webAppUrl={webAppUrl}/>
            {/* genome browser section */}
            <GenomeBrowserSection webAppUrl={webAppUrl} endpoint={endpoint}/>
            {/* variant counts section */}
            <HighlightStatsSection/>
            <LatestDatasetSection />
            <AboutSection webAppUrl={webAppUrl}/>
          
            {/* <WhiteBackgroundSection>
                <NarrowerWidthRow>
                    <Grid item container justify="center">
                        <Heading>ADSP Collaboration</Heading>
                        <BaseText>
                            The NIAGADS Alzheimer's Genomics Database (NIAGADS GenomicsDB) has an ongoing collaboration
                            with the{" "}
                            <PrimaryExternalLink href={`${_externalUrls.NIAGADS_BASE_URL}/adsp`}>
                                Alzheimer's Disease Sequencing Project
                            </PrimaryExternalLink>{" "}
                            (ADSP). The NIAGADS GenomicsDB allows browsing, searching, and analysis of variants and
                            genes linked to the risk of developing late-onset Alzheimer's disease that were identified
                            through the ADSP's sequencing efforts and downstream meta-analyses.
                        </BaseText>
                    </Grid>
                    <Grid container item direction="row" justify="flex-start">
                        <Grid item xs={12}>
                            <Subheading>ADSP Variants</Subheading>
                        </Grid>
                        <Grid container item spacing={5} direction="row">
                            <Grid item xs={12} sm={6}>
                                <BaseText>
                                    Annotated variants in the NIAGADS GenomicsDB include SNPs and short-indels
                                    identified during the ADSP Discovery Phase whole-genome (WGS) and whole-exome
                                    sequencing (WES) efforts. These variants are highlighted in variant and dataset
                                    reports and their quality control status is provided. Annotated tracks are available
                                    for both the WES and WGS variants on the genome browser.
                                </BaseText>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid item container direction="column" wrap="nowrap">
                                    <img width={"100%"} src={`${webAppUrl}/images/home/NG00061.png`} />
                                    <Typography variant="caption">
                                        <em>
                                            After Butkiewicz et al. (2018) Functional annotation of genomic variants in
                                            studies of late-onset Alzheimer's disease. Bioinformatics 34(16):2724-2731
                                            (after Table 1). PMID:{" "}
                                        </em>
                                        <PrimaryExternalLink href={`${_externalUrls.PUBMED_URL}/29590295`}>29590295</PrimaryExternalLink>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" justify="flex-start">
                        <Subheading>ADSP Annotation</Subheading>
                        <BaseText>
                            As part of this sequencing effort, the ADSP developed an annotation pipeline that
                            efficiently integrates standard annotations and ranks potential variant impacts according to
                            predicted effect (such as codon changes, loss of function, and potential deleteriousness). 
                            All variants in the NIAGADS GenomicsDB have been annotated using this pipeline. 
                        </BaseText>
                    </Grid>
                    <Grid container item direction="column" spacing={1}>
                        <Subheading>ADSP Meta-analysis Results</Subheading>
                        <BaseText>
                            The NIAGADS GenomicsDB provides access to summary statistics from the following ADSP
                            meta-analyses:
                        </BaseText>
                        <Box mt={1}></Box>
                        <Box display="flex">
                            <Typography>
                                <BoldPrimaryLink to="/record/dataset/NG00065">NG00065:&nbsp;</BoldPrimaryLink>
                            </Typography>
                            <BaseText>
                                <strong>ADSP Discovery Case/Control Association Results</strong>
                            </BaseText>
                        </Box>
                        <Box>
                            <BaseText>
                                These datasets contain results from single variant and
                                gene-based rare variant aggregation tests,
                                performed separately by ancestry (European ancestry, Caribbean Hispanic) and
                                meta-analyzed.
                            </BaseText>
                        </Box>
                    </Grid>
                </NarrowerWidthRow>
            </WhiteBackgroundSection> */}
        
        </Grid>
    );
};


export default connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
    endpoint: state.globalData.siteConfig.endpoint,
}))(HomePage);

