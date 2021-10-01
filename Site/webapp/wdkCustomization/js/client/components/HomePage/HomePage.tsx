import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import { useGoto } from "../../hooks";

import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";

import { DarkContrastText, BaseText, Heading, Subheading } from "../MaterialUI/Typography";

import { WhiteBackgroundSection, GreyBackgroundSection} from './Sections/Sections';
import { NarrowerWidthRow } from './CustomGridElements';
import {HighlightStatsSection, DatasetReleasesSection, SearchSection, FeaturesSection, AboutSection}  from './Sections';


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
            <FeaturesSection webAppUrl={webAppUrl} endpoint={endpoint}/>     
            <HighlightStatsSection/>
            <DatasetReleasesSection />
            <AboutSection webAppUrl={webAppUrl}/> 
        </Grid>
    );
};


export default connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
    endpoint: state.globalData.siteConfig.endpoint,
}))(HomePage);

