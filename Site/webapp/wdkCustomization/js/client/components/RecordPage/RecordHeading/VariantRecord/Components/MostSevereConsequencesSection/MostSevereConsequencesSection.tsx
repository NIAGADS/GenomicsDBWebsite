import React from "react";
import * as gr from "./../../../../types";
import { resolveJsonInput } from "./../../../../../../util/jsonParse";
import { ImpactIndicator } from "../../../Shared/index";
import { Box, List } from "@material-ui/core";
import { LightContrastTextSmall, UnpaddedListItem } from "../../../../../Shared";

interface MSConsequencesSection {
    attributes: gr.VariantRecordAttributes;
}
const MostSevereConsequencesSection: React.FC<MSConsequencesSection> = ({ attributes }) => (
    <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
        <List disablePadding={true}>
            <UnpaddedListItem>
                <LightContrastTextSmall variant="caption">
                    <strong>Consequence:</strong>&nbsp;
                    {attributes.most_severe_consequence}&nbsp;
                    {attributes.msc_is_coding && resolveJsonInput(attributes.msc_is_coding)}
                </LightContrastTextSmall>
            </UnpaddedListItem>
            {attributes.msc_impact && (
                <UnpaddedListItem>
                    <LightContrastTextSmall variant="caption">
                        <strong>Impact:</strong>&nbsp;
                        <ImpactIndicator impact={attributes.msc_impact} />
                    </LightContrastTextSmall>
                </UnpaddedListItem>
            )}
        </List>
        <Box marginLeft={1}>
            <List disablePadding={true}>
                {attributes.msc_amino_acid_change && (
                    <UnpaddedListItem>
                        <LightContrastTextSmall variant="caption">
                            Amino Acid Change:&nbsp;
                            {attributes.msc_amino_acid_change}
                        </LightContrastTextSmall>
                    </UnpaddedListItem>
                )}
                {attributes.msc_codon_change && (
                    <UnpaddedListItem>
                        <LightContrastTextSmall variant="caption">
                            Codon Change:&nbsp;
                            {attributes.msc_codon_change}
                        </LightContrastTextSmall>
                    </UnpaddedListItem>
                )}

                {attributes.msc_impacted_gene_link && (
                    <UnpaddedListItem>
                        <LightContrastTextSmall variant="caption">
                            Impacted Gene:&nbsp;
                            {resolveJsonInput(attributes.msc_impacted_gene_link)}
                        </LightContrastTextSmall>
                    </UnpaddedListItem>
                )}
                {attributes.msc_impacted_transcript && (
                    <UnpaddedListItem>
                        <LightContrastTextSmall variant="caption">
                            Impacted Transcript:&nbsp;
                            {resolveJsonInput(attributes.msc_impacted_transcript)}
                        </LightContrastTextSmall>
                    </UnpaddedListItem>
                )}
            </List>
        </Box>
    </Box>
);

export default MostSevereConsequencesSection;
