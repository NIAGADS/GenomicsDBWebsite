import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "../Shared";
import { RecordHeading } from "../RecordHeadingTypes";
import { resolveJsonInput } from "../../../../util/jsonParse";
import { Grid } from "@material-ui/core";
import { BaseText, Heading, Subheading } from "../../../Shared";

const ResourceDatasetRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => (
    <Grid container direction="column" style={{ marginLeft: "10px" }}>
        <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
        <Heading>
            <strong>Dataset: {record.displayName}</strong>
        </Heading>
        <Subheading>
            {record.attributes.name}&nbsp;
            {record.attributes.is_adsp && <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp.toString())}</strong>}
        </Subheading>
        <BaseText variant="body2">{record.attributes.description}</BaseText>
        <BaseText variant="body2">
            Download these data:&nbsp;{resolveJsonInput(record.attributes.external_link.toString())}
        </BaseText>
    </Grid>
);

export default ResourceDatasetRecordSummary;
