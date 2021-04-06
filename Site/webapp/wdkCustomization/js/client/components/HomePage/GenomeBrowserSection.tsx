import React from "react";
import { WhiteBackgroundSection } from "./Sections";
import { NarrowerWidthRow, DownArrowRow } from "./CustomGridElements";
import { Grid, Box } from "@material-ui/core";
import { Heading, BaseText } from "../Shared/Typography";
import {
    PrimaryExternalLink,
    PrimaryActionButton,
    PrimaryLink
} from "../Shared";

import { useGoto } from "../../hooks";
import { _externalUrls } from "../../data/_externalUrls";

import Browser from "../Visualizations/Igv/IgvBrowser";

interface GenomeBrowserSection {
    webAppUrl: string,
    endpoint: string;
}

export const GenomeBrowserSection: React.FC<GenomeBrowserSection> = ({ webAppUrl, endpoint }) => {
    const goto = useGoto();

    const buildBrowser = (b: any) => {
        b.loadTrack({
            name: "IGAP 2019",
            type: "niagadsgwas",
            id: "niagadsgwas",
            url: `${endpoint}/track/gwas?track=NG00075_STAGE1`,
            maxLogP: 25,
            autoscale: false,
            displayMode: "EXPANDED",
            visibilityWindow: 100000,
            snpField: "record_pk",
        });
    };

    const MemoBrowser = React.memo(Browser);

    return (
        <WhiteBackgroundSection>
            <NarrowerWidthRow>
                <Grid container alignItems="center" item direction="column" spacing={6}>
                    <Heading>Explore datasets in their genomic context</Heading>
                    <Grid item container spacing={4} direction="row" alignContent="center">
                        <Grid container item xs={12} sm={6} alignContent="space-between" justify="center" alignItems="center">
                            <BaseText>
                                Use our interactive genome browser to visually inspect NIAGADS GWAS summary
                                statistics datasets in their broader genomic context. Compare datasets
                                to each other, against annotated gene or variant tracks, and to functional genomics tracks 
                                from the NIAGADS{" "}
                                <PrimaryExternalLink href={_externalUrls.FILER_TRACK_URL}>FILER</PrimaryExternalLink>{" "}
                                functional genomics repository.
                            </BaseText>
                            
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" justifyContent="flex-end"><PrimaryLink to="/visualizations/browser?locus=ABCA7">Full Broswer View</PrimaryLink></Box>
                            <MemoBrowser
                                searchUrl={`${window.location.origin}${webAppUrl}/service/track/feature?id=`}
                                defaultSpan="ABCA7"
                                onBrowserLoad={buildBrowser}
                                serviceUrl={endpoint}
                                webappUrl={webAppUrl}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </NarrowerWidthRow>
        </WhiteBackgroundSection>
    );
};
