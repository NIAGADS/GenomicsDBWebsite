import React from "react";
import { WhiteBackgroundSection } from "./Sections";
import { NarrowerWidthRow, DownArrowRow } from "../CustomGridElements";
import { Grid, Box, Paper, Button } from "@material-ui/core";
import { Heading, BaseText } from "../../Shared/Typography";

import Carousel from "react-material-ui-carousel";

import { PrimaryExternalLink, PrimaryActionButton, PrimaryLink } from "../../Shared";
import { _externalUrls } from "../../../data/_externalUrls";

import { GenomeBrowserSection, DatasetOverviewSection } from '../Sections';

interface FeaturesSection {
    webAppUrl: string;
    endpoint: string;
}

export const FeaturesSection: React.FC<FeaturesSection> = ({ webAppUrl, endpoint }) => {
    return (
        <WhiteBackgroundSection>
            <NarrowerWidthRow>
                <Carousel animation="fade" timeout={1000} autoPlay={false} navButtonsAlwaysVisible={true}>
                    <DatasetOverviewSection webAppUrl={webAppUrl}/>
                    <GenomeBrowserSection webAppUrl={webAppUrl} endpoint={endpoint}/>
                </Carousel>
            </NarrowerWidthRow>
        </WhiteBackgroundSection>
    );
};
