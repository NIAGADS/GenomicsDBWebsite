import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import StepService from "wdk-client/Service/Mixins/StepsService";
import { ServiceBase } from "wdk-client/Service/ServiceBase";
import { get } from "lodash";
import { NumberSelector } from "wdk-client/Components";
import { IdeogramPlot } from '../RecordPage/RecordMainCategorySection/Visualizations';
import { LoadingOverlay } from 'wdk-client/Components';

interface GenomeView {
  serviceUrl: string;
  stepId: NumberSelector;
  projectId: string;
}

const GenomeView: React.FC<any> = ({ serviceUrl, stepId, projectId }) => {
  const [data, setData] = useState<{ [key: string]: any }>();

  const featureTrackColor = '#EE442F';
  const locusTrackColor = '#63ACBE'
  let legend: any = [];

  const annotationTracks = [
    { id: 'single_feature', displayName: 'Feature', color: featureTrackColor, shape: 'triangle' },
    { id: 'binned_features', displayName: 'Locus', color: locusTrackColor, shape: 'triangle' },
  ];

  const annotHeight = 3;
  const chrWidth = 15;
  const chrHeight= 750;

  useEffect(() => {
    const base = ServiceBase(serviceUrl);

    StepService(base)
      .getStepCustomReport(
        stepId,
        { format: "genomeViewReporter", formatConfig: { "bin_features": true } },
        "current"
      )
      .then(data => setData(data));

  }, []);

  if (data) {
    legend = [{
      name: 'Legend',
      rows: [
        { name: data.record_type, color: featureTrackColor, shape: 'triangle' },
        { name: 'Locus containing multiple ' + data.record_type + 's', color: locusTrackColor, shape: 'triangle' },
      ]
    }];
  }

  return data ? <IdeogramPlot rotatable={false} annotations={data.ideogram_annotation} container="ideogram" 
                              tracks={annotationTracks} legend={legend} genomeBuild={projectId} showBandLabels={true} orientation="horizontal" 
                              chrWidth={chrWidth} chrHeight={chrHeight} annotationHeight={annotHeight}/>
    :   <LoadingOverlay>'Loading...'</LoadingOverlay>

};

const mapStateToProps = (state: any) => {
  return {
    serviceUrl: state.globalData.siteConfig.endpoint,
    projectId: state.globalData.siteConfig.projectId,
    recordType: get(state, "strategyWorkspace.activeStrategy"),
    stepId: get(state, "strategyWorkspace.activeStrategy.stepId")
  };
};

export default connect(mapStateToProps)(GenomeView);
