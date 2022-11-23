import React from "react";

import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { BooleanAttribute, VariantConsequenceImpactSpan as ImpactIndicator, LinkAttribute } from "@components/Record/Attributes";

import { UnpaddedListItem as ListItem } from "@components/MaterialUI";
import { useTypographyStyles } from "@components/MaterialUI/styles";

import { _externalUrls } from "genomics-client/data/_externalUrls";


export const MostSevereConsequenceSection: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const attributes = record.attributes;
    const classes = useTypographyStyles();

    return (
        <Box paddingTop={1} paddingBottom={1}>
            <List disablePadding={true}>
                <ListItem>
                    <Typography className={classes.small}>
                        <strong>Consequence:</strong> {attributes.most_severe_consequence}{" "}
                        {attributes.msc_is_coding && <BooleanAttribute value={attributes.msc_is_coding.toString()} htmlColor="green"/>}
                    </Typography>
                </ListItem>
                {attributes.msc_impact && <ListItem></ListItem>}
            </List>
            <Box marginLeft={1}>
                <List disablePadding={true}>
                    <Typography variant="caption">
                        Impact:&nbsp;
                        <ImpactIndicator value={attributes.msc_impact.toString()} />
                    </Typography>
                    {attributes.msc_impacted_gene_link && (
                        <ListItem>
                            <Typography variant="caption">
                                Impacted Gene:&nbsp;
                                <LinkAttribute value={attributes.msc_impacted_gene_link.toString()}/>
                            </Typography>
                        </ListItem>
                    )}
                    {attributes.msc_impacted_transcript && (
                        <ListItem>
                            <Typography variant="caption">
                                Impacted Transcript:&nbsp;
                                <LinkAttribute value={attributes.msc_impacted_transcript.toString()}/>
                            </Typography>
                        </ListItem>
                    )}
                    {attributes.msc_amino_acid_change && (
                        <ListItem>
                            <Typography variant="caption">
                                Amino Acid Change:&nbsp;
                                {attributes.msc_amino_acid_change}
                            </Typography>
                        </ListItem>
                    )}
                    {attributes.msc_codon_change && (
                        <ListItem>
                            <Typography variant="caption">
                                Codon Change:&nbsp;
                                {attributes.msc_codon_change}
                            </Typography>
                        </ListItem>
                    )}
                </List>
            </Box>
        </Box>
    );
};
