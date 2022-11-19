import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import { HeaderActions } from "../Types";
import { RecordActionLink } from "wdk-client/Components";


interface RecordHeaderActions {
    record: any;
    recordClass: any;
    headerActions: HeaderActions[];
    className?: string;
    href?: string;
    showLabel?: boolean;
}

export const RecordHeaderActions: React.FC<RecordHeaderActions> = (props) => {
    return (
        <Grid item>
            <Box mt="5px">
            {props.headerActions.map((action, index) => (
                <Box paddingRight={2} key={index} component="span">
                    <RecordActionLink record={props.record} recordClass={props.recordClass} {...action} />
                </Box>
            ))}
            </Box>
        </Grid>
    );
};

// return the attribute details from the record class
export function getAttributeByName(recordClass: any, attributeName: string) {
    const targetAttribute = recordClass.attributes.filter(function (attribute: any) {
        return attribute.name == attributeName;
    });
    return targetAttribute[0];
}

