import { get } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeDynamicWrapper } from '../../component-wrappers/componentWrapperUtils';

import RecordHeading from '../RecordPage/RecordHeading/VariantRecord/VariantRecordHeading';
import RecordMainSection from '../RecordPage/RecordMainSection/RecordMainSection';
import { VariantFilter } from "../StrategiesPage/Filters/VariantFilter/VariantFilter";

//import ResultTable  from '../StrategiesPage/Filters/VariantFilter/VariantFilter';


export function ResultTable(props: any) {
    return (
        <React.Fragment>
            <div style={{ display: "flex", paddingTop: "1em", alignItems: "stretch" }}>
                <VariantFilter {...props} />
                <div style={{ flex: 1, overflow: "auto" }}>
                    <props.DefaultComponent {...props} />
                </div>
            </div>
            {/* <ConnectedTranscriptViewFilter {...props}/> */}
        </React.Fragment>
    );
}

export { RecordHeading, RecordMainSection };
