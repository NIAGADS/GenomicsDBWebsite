import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "./../Shared";
import { RecordHeading } from "../RecordHeadingTypes";
import { Grid } from "@material-ui/core";
import { BaseText, Heading, Subheading } from "../../../Shared";
import { RecordInstance, RecordClass } from 'wdk-client/Utils/WdkModel';

import './NIAGADSDatasetRecordHeading.scss';


const NIAGADSDatasetRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => (
    <Grid container direction="column" style={{ marginLeft: "10px" }}>
        <Heading>
            Browse NIAGADS Accessions
        </Heading>
        <Subheading>{record.attributes.name}</Subheading>
        <BaseText variant="body2">{record.attributes.description}</BaseText>
    </Grid>
);

export default NIAGADSDatasetRecordSummary;
