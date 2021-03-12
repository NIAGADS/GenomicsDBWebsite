import React from "react";
import { findExportWith } from "ebrc-client/component-wrappers/util";
import theme from "./../theme";
import { Container, ThemeProvider } from "@material-ui/core";

export function RecordHeading(DefaultComponent: any) {
    const DynamicRecordHeading = makeDynamicWrapper("RecordHeading")(DefaultComponent);
    return function NiagadsRecordHeading(props: any) {
        return (
            <ThemeProvider theme={theme}>
                {/* class needed for toggling header-width on contents-box expansion */}
                <Container maxWidth={false} className="record-heading-container">
                    <DynamicRecordHeading {...props} />
                </Container>
            </ThemeProvider>
        );
    };
}

export function RecordMainSection(DefaultComponent: React.Component) {
    const DynamicRecordMainSection = makeDynamicWrapper("RecordMainSection")(DefaultComponent);
    return function NiagadsRecordMainSection(props: any) {
        return (
            <ThemeProvider theme={theme}>
                <DynamicRecordMainSection {...props} />
            </ThemeProvider>
        );
    };
}

//cast webpack's global
//@ts-ignore;
const requireCast = require as any;

//https://webpack.js.org/guides/dependency-management/
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
