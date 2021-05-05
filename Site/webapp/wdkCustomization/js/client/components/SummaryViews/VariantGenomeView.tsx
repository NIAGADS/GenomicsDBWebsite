import React, { useState } from "react";
import { connect } from "react-redux";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { IdeogramPlot } from "../Visualizations";
import { LoadingOverlay } from "wdk-client/Components";
import { getCustomReport } from "wdk-client/Utils/WdkResult";

const HistogramIdeogramView: React.FC<any> = ({ resultType, projectId }) => {
    const [data, setData] = useState<{ [key: string]: any }>();

    let legend: any = [];

    const config = {
        annotationHeight: 4,
        chrWidth: 15,
        chrHeight: 750,
        chrMargin: 20,
        rotatable: true,
        assembly: projectId,
        showBandLabels: true,
        annotationsLayout: "histogram",
        histogramScaling: 'absolute',
        orientation: "vertical"
    };

    // load data from WDK service if necessary
    useWdkEffect(
        (wdkService) => {
            getCustomReport(wdkService, resultType, {
                format: "genomeViewReporter",
                formatConfig: { bin_features: false },
            }).then((data) => setData(data));
        },
        [resultType]
    );

    return data ? (
        data.exceeds_limit ? (
            <div>{`The number of ${data.record_type}s in the result exceeds the display limit (50000 IDs).  Genome-wide Summary View is not available for the result.`}</div>
        ) : (
            <IdeogramPlot container="ideogram" annotations={data.ideogram_annotation} config={config} />
        )
    ) : (
        <LoadingOverlay>Loading results...</LoadingOverlay>
    );
};

const mapStateToProps = (state: any) => {
    return {
        projectId: state.globalData.siteConfig.projectId,
    };
};

export default connect(mapStateToProps)(HistogramIdeogramView);
