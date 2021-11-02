import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "../Shared";
import { RecordHeading } from "../RecordHeadingTypes";
import { Grid } from "@material-ui/core";
import { BaseText, Heading, Subheading } from "../../../MaterialUI";
import { RecordInstance, RecordClass } from 'wdk-client/Utils/WdkModel';
import { DefaultBackgroundPanel } from "../../../MaterialUI";

import './DatasetRecordHeading.scss';


const DatasetRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => (
    <DefaultBackgroundPanel hasBaseArrow={false}>
        <Heading>{record.attributes.name}</Heading>
        <Subheading>{record.attributes.description}</Subheading>
    </DefaultBackgroundPanel>
);

export default DatasetRecordSummary;
