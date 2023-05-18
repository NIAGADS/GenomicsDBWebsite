import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import {
    useTypographyStyles,
    StyledTooltip as Tooltip,
    CustomLink as Link,
    ComingSoonAlert,
} from "@components/MaterialUI";
import { RecordHeader, SummaryPlotHeader } from "@components/Record/RecordHeader";
import { RecordHeading } from "@components/Record/Types";

import { _externalUrls } from "genomics-client/data/_externalUrls";

const OntologyRecordHeader: React.FC<RecordHeading> = ({ record, recordClass, categoryTree, headerActions }) => {
    const { displayName, attributes } = record;
    const tClasses = useTypographyStyles();
    const linkOutRef = React.createRef();

    const renderTitle = (
        <Box pb={1}>
            <Typography variant="h5">
                <strong>{attributes.name}</strong>
            </Typography>
            <Typography variant="caption">{attributes.description}</Typography>
        </Box>
    );

    const renderSummary = (
        <ComingSoonAlert message="More information about how to use the data dictionary will be coming soon." />
    );

    return (
        <RecordHeader
            categoryTree={categoryTree}
            recordClass={recordClass}
            title={renderTitle}
            summary={renderSummary}
        />
    );
};

export default OntologyRecordHeader;
