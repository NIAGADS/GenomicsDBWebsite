import React from "react";
import { Grid, List, Typography } from "@material-ui/core";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { resolveJsonInput } from "../../../../../util/jsonParse";
import { BaseText, BaseTextSmall, UnpaddedListItem } from "../../../../MaterialUI";
import { RecordAttributeItem } from "../Shared";

const GeneRecordAttributesList: React.FC<{ record: RecordInstance }> = ({ record }) => {
    return (
        <List>
            <UnpaddedListItem>
                <BaseText>
                    <em>{record.attributes.gene_name}</em>
                </BaseText>
            </UnpaddedListItem>

            {record.attributes.synonyms && (
                <UnpaddedListItem>
                    <RecordAttributeItem label="Also known as:" attribute={record.attributes.synonyms.toString()} />
                </UnpaddedListItem>
            )}

            <UnpaddedListItem>
                <RecordAttributeItem label="Gene Type:" attribute={record.attributes.gene_type.toString()} />
            </UnpaddedListItem>

            <UnpaddedListItem>
                <RecordAttributeItem
                    label="Location:"
                    attribute={`${record.attributes.span}${
                        record.attributes.cytogenetic_location
                            ? "/ ".concat(record.attributes.cytogenetic_location.toString())
                            : ""
                    } `}
                />
            </UnpaddedListItem>
            {record.attributes.has_genetic_evidence_for_ad_risk && (
                <UnpaddedListItem>
                    <BaseTextSmall>
                        Genetic Evidence for AD?&nbsp;
                        {resolveJsonInput(record.attributes.has_genetic_evidence_for_ad_risk_display.toString())}
                    </BaseTextSmall>
                </UnpaddedListItem>
            )}
        </List>
    );
};

export default GeneRecordAttributesList;
