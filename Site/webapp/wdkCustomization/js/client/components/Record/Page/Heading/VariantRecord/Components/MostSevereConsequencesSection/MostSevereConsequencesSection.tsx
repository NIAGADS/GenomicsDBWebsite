import React from "react";
import { resolveJsonInput } from "../../../../../../../util/jsonParse";
import { ImpactIndicator } from "../../../Shared/index";
import { Box, List } from "@material-ui/core";
import { BaseTextSmall, UnpaddedListItem } from "../../../../../../MaterialUI";
import { RecordAttributes } from '../../../RecordHeadingTypes';

const MostSevereConsequencesSection: React.FC<{ attributes: RecordAttributes }> = ({ attributes }) => (
    <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
        <List disablePadding={true}>
            <UnpaddedListItem>
                <BaseTextSmall variant="caption">
                    <strong>Consequence:</strong>&nbsp;
                    {attributes.most_severe_consequence}&nbsp;
                    {attributes.msc_is_coding && resolveJsonInput(attributes.msc_is_coding.toString())}
                </BaseTextSmall>
            </UnpaddedListItem>
            {attributes.msc_impact && (
                <UnpaddedListItem>
                    <BaseTextSmall variant="caption">
                        <strong>Impact:</strong>&nbsp;
                        <ImpactIndicator impact={attributes.msc_impact.toString()} />
                    </BaseTextSmall>
                </UnpaddedListItem>
            )}
        </List>
        <Box marginLeft={1}>
            <List disablePadding={true}>
                {attributes.msc_amino_acid_change && (
                    <UnpaddedListItem>
                        <BaseTextSmall variant="caption">
                            Amino Acid Change:&nbsp;
                            {attributes.msc_amino_acid_change}
                        </BaseTextSmall>
                    </UnpaddedListItem>
                )}
                {attributes.msc_codon_change && (
                    <UnpaddedListItem>
                        <BaseTextSmall variant="caption">
                            Codon Change:&nbsp;
                            {attributes.msc_codon_change}
                        </BaseTextSmall>
                    </UnpaddedListItem>
                )}

                {attributes.msc_impacted_gene_link && (
                    <UnpaddedListItem>
                        <BaseTextSmall variant="caption">
                            Impacted Gene:&nbsp;
                            {resolveJsonInput(attributes.msc_impacted_gene_link.toString())}
                        </BaseTextSmall>
                    </UnpaddedListItem>
                )}
                {attributes.msc_impacted_transcript && (
                    <UnpaddedListItem>
                        <BaseTextSmall variant="caption">
                            Impacted Transcript:&nbsp;
                            {resolveJsonInput(attributes.msc_impacted_transcript.toString())}
                        </BaseTextSmall>
                    </UnpaddedListItem>
                )}
            </List>
        </Box>
    </Box>
);

export default MostSevereConsequencesSection;
