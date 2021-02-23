import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "./../Shared";
import * as gr from "./../../types";
import { resolveJsonInput } from "../../../../util/jsonParse";

interface StoreProps {
    externalUrls: { [key: string]: any };
    webAppUrl: string;
}

const enhance = connect<StoreProps, any, RecordHeading>((state: any) => ({
    externalUrls: state.globalData.siteConfig.externalUrls,
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}));

interface RecordHeading {
    record: gr.NIAGADSDatasetRecord;
    recordClass: { [key: string]: any };
    headerActions: gr.HeaderActions[];
}

const NIAGADSDatasetRecordSummary: React.FC<RecordHeading & StoreProps> = (props) => {
    const { record, recordClass, headerActions, externalUrls } = props;
    return (
        <React.Fragment>
            <div className="record-summary-container dataset-record-summary-container">
                <div>
                    <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                    <h1 className="wdk-record-heading">Dataset: {record.displayName}</h1>
                </div>
                <h2>
                    {record.attributes.name}
                    {record.attributes.is_adsp && <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp)}</strong>}
                </h2>
                <ul>
                    <li>
                        <h5 className="dataset-subtitle">{record.attributes.description}</h5>
                    </li>
                    <li>
                        <span className="label">Download these data:</span>
                        {resolveJsonInput(record.attributes.external_link)}{" "}
                    </li>
                </ul>
            </div>
        </React.Fragment>
    );
};

export default enhance(NIAGADSDatasetRecordSummary);
