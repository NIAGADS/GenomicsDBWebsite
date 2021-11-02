import React from "react";
import { HeaderActions } from "../../RecordHeadingTypes";
import { RecordActionLink } from "wdk-client/Components";
import { Box } from "@material-ui/core";

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
        <Box marginTop={1} display="flex" justifyContent="space-between">
            {props.headerActions.map((action, index) => (
                <RecordActionLink key={index} record={props.record} recordClass={props.recordClass} {...action} />
            ))}
        </Box>
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
