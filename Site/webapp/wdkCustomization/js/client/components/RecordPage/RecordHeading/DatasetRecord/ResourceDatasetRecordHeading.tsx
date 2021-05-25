import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "../Shared";
import { ResourceDatasetRecord, HeaderActions } from "../../types";
import { resolveJsonInput } from "../../../../util/jsonParse";
import { Grid } from "@material-ui/core";
import { BaseText, Heading, Subheading } from "../../../Shared";

const enhance = connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}));

interface RecordHeading {
    headerActions: HeaderActions[];
    record: ResourceDatasetRecord;
    recordClass: { [key: string]: any };
    webAppUrl: string;
}

const ResourceDatasetRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => (
    <Grid container direction="column" style={{ marginLeft: "10px" }}>
        <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
        <Heading>
            <strong>Dataset: {record.displayName}</strong>
        </Heading>
        <Subheading>
            {record.attributes.name}&nbsp;
            {record.attributes.is_adsp && <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp)}</strong>}
        </Subheading>
        <BaseText variant="body2">{record.attributes.description}</BaseText>
        <BaseText variant="body2">
            Download these data:&nbsp;{resolveJsonInput(record.attributes.external_link)}
        </BaseText>
    </Grid>
);

export default enhance(ResourceDatasetRecordSummary);
