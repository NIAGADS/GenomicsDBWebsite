import React, { useState } from "react";
import { makeClassNameHelper } from "wdk-client/Utils/ComponentUtils";
import WdkService from "wdk-client/Service/WdkService";
import { requestUpdateStepSearchConfig } from "wdk-client/Actions/StrategyActions";
import { ResultType } from "wdk-client/Utils/WdkResult";
import { isPropsType } from "wdk-client/Views/Question/Params/Utils";
import { SearchConfig } from 'wdk-client/Utils/WdkModel';

import "./FilterPanel.scss";

const cx = makeClassNameHelper("FilterPanel");
// session storage prop name to hold filter pane expansion preference
const FILTER_PANE_EXPANSION_KEY = "defaultFilterPaneExpansion";

export const HISTOGRAM_REPORTER_NAME = 'byValue';
export const HISTOGRAM_FILTER_NAME = 'byValue';

// initial values for component state
const DEFAULT_PANE_EXPANSION = true;

const TITLE = "Filter Result";

// configuration type of the organism (byValue) filter
export type NO_FILTER_APPLIED_TYPE = null;
export const NO_FILTER_APPLIED:any = null;
export type FilterConfig = NO_FILTER_APPLIED_TYPE | {
    values: Array<string>;
}

export interface FilterSummary {
    totalValues: number;
    nullValues: number;
    uniqueValues?: number;
    values?: Array<{
        value: string;
        count: number;
    }>;
}

interface ExpansionBarProps {
    onClick: () => void;
    message: string;
    arrow: string;
}

function ExpansionBar(props: ExpansionBarProps) {
    return (
        <div className={cx("--ExpansionBar")} onClick={props.onClick}>
            {props.arrow}
            <span className={cx("--ExpansionBarText")}>{props.message}</span>
            {props.arrow}
        </div>
    );
}

export interface FilterDispatchProps {
    requestUpdateStepSearchConfig: typeof requestUpdateStepSearchConfig;
}

export interface FilterContainerProps {
    children: React.ReactChild | React.ReactChild[];
}

export interface FilterProps {
    resultType: ResultType;
}

export type FilterPanelProps =  FilterContainerProps;

function FilterContainer(props: FilterContainerProps) {
    return <div className={cx()}>{props.children}</div>;
}

export default function FilterPanel(props: FilterPanelProps) {
    // whether organism filter pane is expanded vs pushed against left wall of results pane
    let initialIsExpandedStr = sessionStorage.getItem(FILTER_PANE_EXPANSION_KEY);
    let initialIsExpanded = initialIsExpandedStr ? initialIsExpandedStr === "true" : DEFAULT_PANE_EXPANSION;
    const [isExpanded, setExpanded] = useState<boolean>(initialIsExpanded);

    function setExpandedAndPref(isExpanded: boolean) {
        sessionStorage.setItem(FILTER_PANE_EXPANSION_KEY, isExpanded.toString());
        setExpanded(isExpanded);
    }

    // show collapsed view if not expanded
    if (!isExpanded) {
        return (
            <div style={{ position: "relative" }}>
                <ExpansionBar onClick={() => setExpandedAndPref(true)} message={"Show " + TITLE} arrow="&dArr;" />
            </div>
        );
    }

    return (
        <FilterContainer>
            <div>{props.children}</div>
            <ExpansionBar onClick={() => setExpandedAndPref(false)} message={"Hide " + TITLE} arrow="&uArr;" />
        </FilterContainer>
    );
}

export async function fetchFilterSummary(
    wdkService: WdkService,
    stepId: number,
    columnName: string,
    reporterName: string
) {
    const filterSummary = await wdkService.getStepColumnReport(stepId, columnName, reporterName, {});
    return filterSummary as FilterSummary;
}

export function findFilterConfig(searchConfig: SearchConfig, columnName: string): FilterConfig {
    return (
      searchConfig.columnFilters &&
      searchConfig.columnFilters[columnName] &&
      searchConfig.columnFilters[columnName][HISTOGRAM_FILTER_NAME] ?
      searchConfig.columnFilters[columnName][HISTOGRAM_FILTER_NAME] : NO_FILTER_APPLIED
    );
  }
  