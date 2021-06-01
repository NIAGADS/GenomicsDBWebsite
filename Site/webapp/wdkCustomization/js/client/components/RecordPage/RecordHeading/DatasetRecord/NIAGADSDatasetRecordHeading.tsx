import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "./../Shared";
import { NIAGADSDatasetRecord, HeaderActions } from "./../../types";
import { Grid } from "@material-ui/core";
import { BaseText, Heading, Subheading } from "../../../Shared";

import './NIAGADSDatasetRecordHeading.scss';

const enhance = connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}));

interface RecordHeading {
    headerActions: HeaderActions[];
    record: NIAGADSDatasetRecord;
    recordClass: { [key: string]: any };
    webAppUrl: string;
}

const NIAGADSDatasetRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => (
    <Grid container direction="column" style={{ marginLeft: "10px" }}>
        <Heading>
            Browse NIAGADS Accessions
        </Heading>
        <Subheading>{record.attributes.name}</Subheading>
        <BaseText variant="body2">{record.attributes.description}</BaseText>
    </Grid>
);

export default enhance(NIAGADSDatasetRecordSummary);
