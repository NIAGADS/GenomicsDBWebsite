import React from "react";
import { WhiteBackgroundSection } from "./Sections";
import { NarrowerWidthRow, DownArrowRow } from "../CustomGridElements";
import { Grid, Box } from "@material-ui/core";
import { Heading, BaseText } from "../../Shared/Typography";
import { PrimaryExternalLink, PrimaryActionButton, PrimaryLink } from "../../Shared";

import { HighchartsDatasetSummaryDonut as Donut } from '../../Visualizations/Highcharts/HighchartsDatasetSummaryDonut'

import { _externalUrls } from "../../../data/_externalUrls";



interface DatasetOverviewSection {
    webAppUrl: string;
}

export const DatasetOverviewSection: React.FC<DatasetOverviewSection> = ({ webAppUrl, }) => {

    return (
        <WhiteBackgroundSection>
            <Grid container alignItems="center" item direction="column" spacing={6}>
                <Heading>Available datasets</Heading>
                <Grid item container spacing={4} direction="row" alignContent="center">
                    <Grid
                        container
                        item
                        xs={12}
                        sm={6}
                        alignContent="space-between"
                        justify="center"
                        alignItems="center"
                    >
                        <BaseText>
                            The NIAGADS Alzheimer's GenomicsDB provides unrestricted access to published 
                            summary statistics from AD/ADRD genome-wide association studies (GWAS) deposited at NIAGADS. 
                        </BaseText>
                        <Box display="flex" justifyContent="flex-end">
                            <PrimaryActionButton href="record/dataset/accessions">
                                <span>
                                    Browse Datasets{"    "}
                                    <i className="fa fa-caret-right"></i>
                                </span>
                            </PrimaryActionButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Donut />
                    </Grid>
                </Grid>
            </Grid>
        </WhiteBackgroundSection>
    );
};
