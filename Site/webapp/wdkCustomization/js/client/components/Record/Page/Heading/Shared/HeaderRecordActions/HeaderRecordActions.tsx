import React from "react";
import { HeaderActions } from "../../RecordHeadingTypes";
import { RecordActionLink } from "wdk-client/Components";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

interface HeaderRecordActions {
    record: any;
    recordClass: any;
    headerActions: HeaderActions[];
    className?: string;
    href?: string;
    showLabel?: boolean;
}

const HeaderRecordActions: React.FC<HeaderRecordActions> = (props) => {
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

// return attribute properties (specified in propertyList in model)
export function getAttributePropertiesByName(recordClass: any, attributeName: string) {
    const targetAttribute = recordClass.attributes.filter(function (attribute: any) {
        return attribute.name == attributeName;
    });
    return targetAttribute[0].properties;
}

// return chartProperties (specified in propertyList (name=chartProperties) in model)
export function getAttributeChartProperties(recordClass: any, attributeName: string) {
    const targetAttribute = recordClass.attributes.filter(function (attribute: any) {
        return attribute.name == attributeName;
    });
    return targetAttribute[0].properties.chartProperties;
}

export default HeaderRecordActions;
