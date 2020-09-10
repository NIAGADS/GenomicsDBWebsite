import React from "react";
import { findExportWith } from "ebrc-client/component-wrappers/util";

//todo: typings (esp dynamic record interface, cause that's going to become a problem)
export function RecordHeading(DefaultComponent: any) {
    const DynamicRecordHeading = makeDynamicWrapper("RecordHeading")(DefaultComponent);
    return function NiagadsRecordHeading(props: any) {
        return (
            <div className="container-fluid">
                <div className="record-heading-container row">
                    <DynamicRecordHeading {...props} />
                </div>
            </div>
        );
    };
}

export function RecordMainSection(DefaultComponent: React.Component) {
    const DynamicRecordMainSection = makeDynamicWrapper("RecordMainSection")(DefaultComponent);
    return function NiagadsRecordMainSection(props: any) {
        return <DynamicRecordMainSection {...props} />;
    };
}

//cast webpack's global
//@ts-ignore;
const requireCast = require as any;

const findRecordPageComponent = findExportWith(requireCast.context("../components/RecordTypes", true));

function makeDynamicWrapper(componentName: string) {
    return function dynamicWrapper(DefaultComponent: React.Component) {
        return function DynamicWrapper(props: any) {
            const ResolvedComponent =
                findRecordPageComponent(componentName)(`./${props.recordClass.fullName}`) || DefaultComponent;
            return <ResolvedComponent {...props} DefaultComponent={DefaultComponent} />;
        };
    };
}
