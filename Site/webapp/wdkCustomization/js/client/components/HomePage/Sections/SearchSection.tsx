import React from "react";
import { BlueBackgroundSection } from "./Sections";
import { NarrowerWidthRow, DownArrowRow } from "../CustomGridElements";
import { Grid, Box } from "@material-ui/core";
import { MainText } from "../Styles";
import { DarkContrastText } from "../../MaterialUI/Typography";
import { HighchartsDatasetSummaryDonut as Donut } from "../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut";
import { SiteSearch, SearchResult } from "../../Tools";
import { SecondaryLink } from "../../MaterialUI";
import { buildRouteFromResult, buildSummaryRoute } from "../../../util/util";

import { useGoto } from "../../../hooks";

interface SearchSection {
    webAppUrl: string;
}

export const SearchSection: React.FC<SearchSection> = ({ webAppUrl }) => {
    const goto = useGoto();
    return (
        <BlueBackgroundSection>
            {/*<NarrowerWidthRow spacing={0}>*/}
            {/* chart and search bar */}
            {/* should be 6 ems of padding here total... */}
            <Grid item container direction="row" justify="center" spacing={7}>
                {/* heading and search bar column */}
                <Grid item direction="row" container xs={12}>
                    <Grid item container spacing={2} direction="column">
                        <Grid item>
                           
                        </Grid>
                        <Grid item>
                            <DarkContrastText>
                                An interactive knowledgebase for Alzheimer's disease (AD) genetics that provides a
                                platform for data sharing, discovery, and analysis to help advance the understanding of
                                the complex genetic underpinnings of AD neurodegeneration and accelerate the progress of
                                research on AD and AD related dementias (ADRD).
                            </DarkContrastText>
                        </Grid>
                        <Grid item>
                            <SiteSearch variant="dark"
                                onSelect={(value: SearchResult, searchTerm: string) =>
                                    goto(
                                        !value || value.type == "summary"
                                            ? buildSummaryRoute(searchTerm)
                                            : buildRouteFromResult(value)
                                    )
                                }
                            />
                        </Grid>
                        <Grid item>
                            <DarkContrastText variant="caption">
                                Examples - Gene: <SecondaryLink to={"record/gene/ENSG00000130203"}> APOE</SecondaryLink>{" "}
                                - Variant by RefSNP:{" "}
                                <SecondaryLink to="record/variant/rs6656401">rs6656401</SecondaryLink> - Variant:{" "}
                                <SecondaryLink to="record/variant/19:45411941:T:C_rs429358">
                                    19:45411941:T:C
                                </SecondaryLink>
                            </DarkContrastText>
                        </Grid>
                    </Grid>
                </Grid>
                {/* chart column 
                    <Grid item justify="center" alignItems="center" container xs={12} md={6}>
                        <Donut />
                    </Grid> */}
            </Grid>
            {/* </NarrowerWidthRow> */}
            <DownArrowRow />
        </BlueBackgroundSection>
    );
};
