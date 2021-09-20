import React from "react";
import { Box, Grid } from "@material-ui/core";
import { BaseText, Heading } from "../../MaterialUI/Typography";
import { LargeHighlightText } from "../Styles";
import { GreyBackgroundSection } from "./Sections";
import { NarrowerWidthRow, DownArrowRow } from "../CustomGridElements";

interface HighlightStatistic {
    caption: string;
    statistic: string;
    leadIn?: string;
    recordTypePlural: string;
}

const HighlightStatistic: React.FC<HighlightStatistic> = ({ caption, statistic, leadIn, recordTypePlural }) => (
    <Box>
        {leadIn && <BaseText>{leadIn}</BaseText>}
        <LargeHighlightText>{statistic}</LargeHighlightText>
        <Box>
            <BaseText>{recordTypePlural}&nbsp;</BaseText>
            <BaseText>
                <strong>{caption}</strong>
            </BaseText>
        </Box>
    </Box>
);

export const HighlightStatsSection: React.FC<{}> = ({}) => {
    return (
        <GreyBackgroundSection>
            <Heading>Discover AD/ADRD-associated variants</Heading>
            <Box padding={2}/>
            <Grid item container direction="row" spacing={4}>
                <Grid item xs={12} sm={6}>
                    <HighlightStatistic
                        leadIn="this resource contains"
                        recordTypePlural="variants"
                        statistic="250+ million"
                        caption="annotated by AD/ADRD GWAS summary statistics"
                    />
                </Grid>
                <Grid item>
                    <HighlightStatistic
                        leadIn="including"
                        recordTypePlural="variants"
                        statistic="29+ million"
                        caption="flagged by the Alzheimer’s Disease Sequencing Project (ADSP)"
                    />
                </Grid>
            </Grid>
        </GreyBackgroundSection>
    );
};
