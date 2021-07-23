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
import { FeaturesSection } from './FeaturesSection';
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
            <FeatureSection webAppUrl={webAppUrl} endpoint={endpoint}/>     
            <HighlightStatsSection/>
            <LatestDatasetSection />
            <AboutSection webAppUrl={webAppUrl}/> 
        </Grid>
    );
};


export default connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
    endpoint: state.globalData.siteConfig.endpoint,
}))(HomePage);

