import React from "react";
import { Box, Grid } from "@material-ui/core";
import { PrimaryExternalLink } from "../../MaterialUI";

import { useGoto } from "../../../hooks";
import { BaseText, Heading, Subheading } from "../../MaterialUI/Typography";

import { GreyBackgroundSection } from "./Sections";
import { NarrowerWidthRow } from "../CustomGridElements";
import { _externalUrls } from "../../../data/_externalUrls";

interface AboutSection {
    webAppUrl: string;
}

export const AboutSection: React.FC<AboutSection> = ({ webAppUrl }) => {
    return (
        <GreyBackgroundSection>
            <NarrowerWidthRow>
                <Grid container item justify="center">
                    <a id="about"/>
                    <Heading>About the Project</Heading>
                    <BaseText>
                        The NIAGADS Alzheimer's Genomics Database is developed by a team of researchers at the
                        University of Pennsylvania as part of the{" "}
                        <PrimaryExternalLink href={_externalUrls.NIAGADS_BASE_URL}>
                            National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                        </PrimaryExternalLink>{" "}
                        (NIAGADS), a national genetics repository created by NIA to facilitate access to genotypic data
                        for the study of the genetics of late-onset Alzheimer's disease. We welcome the involvement of
                        interested researchers.{" "}
                        <PrimaryExternalLink href={`${_externalUrls.NIAGADS_BASE_URL}/data`}>
                            Click here to learn more
                        </PrimaryExternalLink>{" "}
                        about contributing data or making formal data access requests. Or{" "}
                        <PrimaryExternalLink href={`${_externalUrls.NIAGADS_BASE_URL}/contact`}>
                            contact us
                        </PrimaryExternalLink>{" "}
                        for more information. The GenomicsDB is a collaboration among the following organizations which
                        may also provide funding or governance:
                    </BaseText>
                </Grid>

                <Box padding={2}/>

                <Grid container item spacing={4} direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                        <img width="210" src={`${webAppUrl}/images/home/nih-logo.svg`} />
                    </Grid>
                    <Grid item>
                        <img width="145px" src={`${webAppUrl}/images/home/adsp-logo.svg`} />
                    </Grid>
                    <Grid item>
                        <img width="210px" src={`${webAppUrl}/images/home/psom_logo_blue.png`} />
                    </Grid>
                </Grid>
            </NarrowerWidthRow>
        </GreyBackgroundSection>
    );
};

