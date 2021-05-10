import { get } from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { makeDynamicWrapper } from "../../../../component-wrappers/componentWrapperUtils";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { useWdkServiceWithRefresh } from "wdk-client/Hooks/WdkServiceHook";
import { Step } from "wdk-client/Utils/WdkUser";

import FilterPanel, {
    FilterPanelProps,
    FilterProps,
    FilterDispatchProps,
    FilterSummary,
    fetchFilterSummary,
    HISTOGRAM_FILTER_NAME,
    HISTOGRAM_REPORTER_NAME,
    FilterConfig,
    findFilterConfig,
    NO_FILTER_APPLIED,
    NO_FILTER_APPLIED_TYPE,
    FilterContainerProps
} from "../FilterPanel/FilterPanel";

/* import {
  isTranscripFilterEnabled,
  requestTranscriptFilterUpdate
} from '../../util/transcriptFilters'; */

const CHROMOSOME_COLUMN_NAME = "chromosome";
const CONSEQUENCE_COLUMN_NAME = "most_severe_consequence";
const IMPACT_COLUMN_NAME = "impact";
const ADSP_FLAG_COLUMN_NAME = "is_adsp_variant";
const CADD_COLUMN_NAME = "cadd_score";
const IS_CODING_COLUMN_NAME = "is_coding";
const P_VALUE_COLUMN_NAME = "pvalue_display";

const TestContent: React.FC<{}> = () => {
    return <h1>TEST</h1>;
};

interface VariantStepFilterProps {
    step: Step;
}

export function VariantFilter({ resultType, ...otherProps }: FilterProps & FilterDispatchProps) {
    const step = resultType?.type === "step" ? resultType.step : undefined;

    // only show Organism Filter for transcript step results
    if (step == null) {
        return null;
    }

    return <VariantStepFilter step={step} {...otherProps} />;
}



const VariantStepFilter: React.FC<VariantStepFilterProps & FilterDispatchProps> = (props) => {
    const { step, requestUpdateStepSearchConfig } = props;

    // if temporary value assigned, use until user clears or hits apply;
    // else check step for a filter value and if present, use; else use empty string (no filter)
    let appliedFilterConfig: FilterConfig = findFilterConfig(step.searchConfig, CHROMOSOME_COLUMN_NAME);

    // previous step prop passed; decides whether we should reload the data below
    const [currentStep, setCurrentStep] = useState<Step | null>(null);
    let [searchConfigChangeRequested, setSearchConfigChangeRequested] = useState<boolean>(false);

    // counts; retrieved when component is loaded and when step is revised
    const filterSummary = useWdkServiceWithRefresh(
        (wdkService) => fetchFilterSummary(wdkService, step.id, CHROMOSOME_COLUMN_NAME, HISTOGRAM_REPORTER_NAME),
        [step]
    );

    // current value of filter (will be cleared if applied to the step)
    let [temporaryFilterConfig, setTemporaryFilterConfig] = useState<FilterConfig>(appliedFilterConfig);

    // clear dependent data if step has changed
    // FIXME: This logic should be moved into an effect
    if (step !== currentStep) {
        setCurrentStep(step);
        temporaryFilterConfig = appliedFilterConfig;
        setTemporaryFilterConfig(appliedFilterConfig);
        searchConfigChangeRequested = false;
        setSearchConfigChangeRequested(false);
    }

    return <VariantFilterPanel f={filterSummary}>
    
    </VariantFilterPanel>
};



export const VariantFilterPanel: React.FC<{f: FilterSummary}> = (props) => {
    return (
        <FilterPanel>
            <div>{props.f && props.f}</div>
        </FilterPanel>
    );
};
