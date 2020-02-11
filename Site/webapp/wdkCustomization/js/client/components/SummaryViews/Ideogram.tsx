import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import StepService from "wdk-client/Service/Mixins/StepsService";
import { ServiceBase } from "wdk-client/Service/ServiceBase";
import { get } from "lodash";
import { NumberSelector } from "wdk-client/Components";

interface Ideogram {
  serviceUrl: string;
  stepId: NumberSelector;
  projectId: string;
}


const Ideogram: React.FC<any> = ({ serviceUrl, stepId }) => {
  const [data, setData] = useState<{ [key: string]: any }>();

  const legend = [{
    name: 'Features',
    rows: [
      {name: 'Single', color: '#EE442F', shape: 'triangle'},
      {name: 'Multiple', color: '#63ACBE', shape: 'triangle'},
    ]
  }];

  const annotationTracks = [
    {id: 'single_feature', displayName: 'Single', color: '#EE442F', shape: 'triangle'},
     {id: 'binned_features', displayName: 'Multiple', color: '#EE442F', shape: 'triangle'},
  ];

  const annotHeight = 5;

  const chrWidth = 25;

  useEffect(() => {
    const base = ServiceBase(serviceUrl);

    StepService(base)
      .getStepCustomReport(
        stepId,
        { format: "genomeViewReporter", formatConfig: {"bin_features": true} },
        "current"
      )
      .then(data => setData(data));
  }, []);

  return <pre>{JSON.stringify(data)}</pre>;

};

const mapStateToProps = (state: any) => {
  return {
    serviceUrl: state.globalData.siteConfig.endpoint,
    projectId: state.globalData.siteConfig.projectId,
    stepId: get(state, "strategyWorkspace.activeStrategy.stepId")
  };
};

export default connect(mapStateToProps)(Ideogram);
