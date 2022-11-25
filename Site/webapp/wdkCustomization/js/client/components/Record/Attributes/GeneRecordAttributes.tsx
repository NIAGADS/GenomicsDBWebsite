import React from "react";

import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { UnpaddedListItem as ListItem, useTypographyStyles } from "@components/MaterialUI";
import { LabeledAttributeItem as RecordAttributeItem } from "@components/Record/Attributes";

export const GeneAttributeList: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const classes = useTypographyStyles();
    return (
        <List disablePadding={true} dense={true}>
            {record.attributes.synonyms && (
                <ListItem>
                    <RecordAttributeItem small={true} label="Also known as" attribute={record.attributes.synonyms.toString()} />
                </ListItem>
            )}

            <ListItem>
                <RecordAttributeItem small={true} label="Gene Type" attribute={record.attributes.gene_type.toString()} />
            </ListItem>

            <ListItem>
                <RecordAttributeItem small={true}
                    label="Location"
                    attribute={`${record.attributes.span}${
                        record.attributes.cytogenetic_location
                            ? "/ ".concat(record.attributes.cytogenetic_location.toString())
                            : ""
                    } `}
                />
            </ListItem>

            {/*record.attributes.has_genetic_evidence_for_ad_risk && (
                <ListItem>
                    <Typography className={classes.small}>
                        Genetic Evidence for AD?{" "}
                        {resolveJsonInput(record.attributes.has_genetic_evidence_for_ad_risk_display.toString())}
                    </Typography>
                </ListItem>
            ) */}
        </List>
    );
};

