import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import StepService from "wdk-client/Service/Mixins/StepsService";
import { ServiceBase } from "wdk-client/Service/ServiceBase";
import { get } from "lodash";
import { NumberSelector } from "wdk-client/Components";

interface GenomeView {
  serviceUrl: string;
  stepId: NumberSelector;
}

const GenomeView: React.FC<any> = ({ serviceUrl, stepId }) => {
  const [data, setData] = useState<{ [key: string]: any }>();
  useEffect(() => {
    const base = ServiceBase(serviceUrl);

    StepService(base)
      .getStepCustomReport(
        stepId,
        { format: "ideogramJSONReporter", formatConfig: {} },
        "current"
      )
      .then(data => setData(data));
  }, []);

  return <pre>{JSON.stringify(data)}</pre>;
};

const mapStateToProps = (state: any) => {
  return {
    serviceUrl: state.globalData.siteConfig.endpoint,
    stepId: get(state, "strategyWorkspace.activeStrategy.stepId")
  };
};

export default connect(mapStateToProps)(GenomeView);
