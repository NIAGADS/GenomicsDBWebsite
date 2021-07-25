import React from "react";
import { Box, Grid } from "@material-ui/core";
import { PrimaryActionButton, PrimaryLink } from "../../Shared";

import { useGoto } from "../../../hooks";
import { BaseText, Heading, Subheading } from "../../Shared/Typography";

import { WhiteBackgroundSection } from "./Sections";
import { NarrowerWidthRow } from "../CustomGridElements";

import { _news } from "../../../data/news";
import { truncate } from "lodash";

interface DatasetItem {
    content: string;
    date: string;
    target: string;
    title: string;
    subtitle?: string;
    anchor: string;
    truncateContent?: boolean;
}

const DatasetItem: React.FC<DatasetItem> = ({ content, date, target, title, subtitle, anchor, truncateContent = true }) => {
    const goto = useGoto();

    let maxContentLength: number = 200;

    return (
        <Grid container item xs={12} sm={4}>
            <Grid alignItems="flex-start" container item direction="column" justify="space-between" spacing={2}>
                <Grid style={{ flexGrow: 1 }} item container direction="column">
                    <Grid style={{ flexGrow: 1 }} item container direction="column" spacing={2}>
                        <Grid item>
                            <Subheading>{title}</Subheading>
                        </Grid>
                        {subtitle && (
                            <Grid item>
                                <BaseText>{subtitle}</BaseText>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container item direction="column">
                        <BaseText variant="body2">
                            {(truncateContent && content.length > length)
                                ? truncate(content, { length: maxContentLength })
                                : content}
                        </BaseText>
                    </Grid>
                </Grid>
                <Box pl={1} pr={1} pt={5} pb={5}>
                    <PrimaryActionButton href={target}>Explore</PrimaryActionButton>
                </Box>
            </Grid>
        </Grid>
    );
};

export const DatasetReleasesSection: React.FC<{}> = ({}) => {
    return (
        <WhiteBackgroundSection>
            <NarrowerWidthRow>
                <Grid direction="column" alignItems="center" container>
                    <Grid item>
                        <Box p={3}>
                            <Heading>Latest Datasets</Heading>
                        </Box>
                    </Grid>
                    <Grid item container spacing={10} justify="center" direction="row">
                        {_news
                            .filter((item, idx) => idx < 3)
                            .map((item, idx) => {
                                return (
                                    <DatasetItem
                                        key={`news-${idx}`}
                                        content={item.content}
                                        date={item.date}
                                        target={item.target}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        anchor={item.anchor}
                                    />
                                );
                            })}
                    </Grid>
                </Grid>
            </NarrowerWidthRow>
        </WhiteBackgroundSection>
    );
};
