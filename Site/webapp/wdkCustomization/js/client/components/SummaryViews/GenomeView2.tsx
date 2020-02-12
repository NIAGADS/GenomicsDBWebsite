import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useWdkEffect } from 'wdk-client/Service/WdkService';
import { IdeogramPlot } from '../Visualizations';
import { LoadingOverlay } from 'wdk-client/Components';
import { ResultType, getCustomReport } from 'wdk-client/Utils/WdkResult';

const GenomeView: React.FC<any> = ({ resultType, projectId }) => {

    const [data, setData] = useState<{ [key: string]: any }>();

    const featureTrackColor = '#EE442F';
    const locusTrackColor = '#63ACBE'
    let legend: any = [];

    const annotationTracks = [
        { id: 'single_feature', displayName: 'Feature', color: featureTrackColor, shape: 'triangle' },
        { id: 'binned_features', displayName: 'Locus', color: locusTrackColor, shape: 'triangle' },
    ];

    const config = {
        annotationHeight: 4,
        chrWidth: 20,
        chrHeight: 1000,
        chrMargin: 20,
        rotatable: false,
        annotationTracks: annotationTracks,
        assembly: projectId,
        showBandLabels: true,
        orientation: "vertical",
    }

    // load data from WDK service if necessary
    useWdkEffect(wdkService => {
        getCustomReport(wdkService, resultType,
            {
                format: "genomeViewReporter",
                formatConfig: { "bin_features": true }
            }
        ).then(data => setData(data));
    }, [resultType])

    if (data) {
        legend = [{
            name: 'Legend',
            rows: [
                { name: data.record_type, color: featureTrackColor, shape: 'triangle' },
                { name: 'Locus containing multiple ' + data.record_type + 's', color: locusTrackColor, shape: 'triangle' },
            ]
        }];
    }

    return data ? <IdeogramPlot container="ideogram" annotations={data.ideogram_annotation} config={config} legend={legend} />
        : <LoadingOverlay>Loading results...</LoadingOverlay>


}

const mapStateToProps = (state: any) => {
    return {
        projectId: state.globalData.siteConfig.projectId
    };
};


export default connect(mapStateToProps)(GenomeView);