import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "../Shared";
import { RecordHeading } from "../RecordHeadingTypes";
import { Grid } from "@material-ui/core";
import { BaseText, Heading, Subheading } from "../../../MaterialUI";
import { RecordInstance, RecordClass } from 'wdk-client/Utils/WdkModel';

import './DatasetRecordHeading.scss';


const DatasetRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => (
    <Grid container direction="column" style={{ marginLeft: "10px" }}>
        <Heading>{record.attributes.name}</Heading>
        <Subheading>{record.attributes.description}</Subheading>
    </Grid>
);

export default DatasetRecordSummary;
