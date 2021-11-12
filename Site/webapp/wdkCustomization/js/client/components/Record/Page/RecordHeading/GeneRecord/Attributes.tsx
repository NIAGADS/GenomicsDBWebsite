import React from "react";

import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { resolveJsonInput } from "genomics-client/util/jsonParse";

import { UnpaddedListItem as ListItem } from "@components/MaterialUI";
import { RecordAttributeItem } from "../Shared";

const AttributeList: React.FC<{ record: RecordInstance }> = ({ record }) => {
    return (
        <List disablePadding={true} dense={true}>
            <ListItem>
                <Typography>
                    <em>{record.attributes.gene_name}</em>
                </Typography>
            </ListItem>

            {record.attributes.synonyms && (
                <ListItem>
                    <RecordAttributeItem label="Also known as:" attribute={record.attributes.synonyms.toString()} />
                </ListItem>
            )}

            <ListItem>
                <RecordAttributeItem label="Gene Type:" attribute={record.attributes.gene_type.toString()} />
            </ListItem>

            <ListItem>
                <RecordAttributeItem
                    label="Location:"
                    attribute={`${record.attributes.span}${
                        record.attributes.cytogenetic_location
                            ? "/ ".concat(record.attributes.cytogenetic_location.toString())
                            : ""
                    } `}
                />
            </ListItem>

            {record.attributes.has_genetic_evidence_for_ad_risk && (
                <ListItem>
                    <Typography>
                        Genetic Evidence for AD?&nbsp;
                        {resolveJsonInput(record.attributes.has_genetic_evidence_for_ad_risk_display.toString())}
                    </Typography>
                </ListItem>
            )}
        </List>
    );
};

export default AttributeList;
