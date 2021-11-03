import React from "react";
import { RecordAttributeSection, CollapsibleSection, HelpIcon } from "wdk-client/Components";
import RecordTableSection from "./RecordTableSection";
import { getId, getTargetType, getDisplayName } from "wdk-client/Utils/CategoryUtils";
import { IdeogramPlot, HighchartsPlot } from "../../../Visualizations";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { RecordInstance, RecordClass } from "wdk-client/Utils/WdkModel";
import { isEmpty } from "lodash";
import { Box } from "@material-ui/core";
import { BaseText } from "../../../MaterialUI";
import { PartialRecordRequest } from 'wdk-client/Views/Records/RecordUtils';

interface RecordMainCategorySection {
    category: any;
    depth: number;
    enumeration: any;
    isCollapsed: boolean;
    onSectionToggle: { (sectionName: string, isVisible: boolean): any };
    record: RecordInstance
    recordClass: RecordClass;
    requestPartialRecord?: (request: PartialRecordRequest) => void;
}

const NiagadsRecordMainCategorySection: React.FC<RecordMainCategorySection> = ({
    category,
    children,
    depth,
    enumeration,
    isCollapsed,
    onSectionToggle,
    record,
    recordClass,
    requestPartialRecord,
}) => {
    const toggleCollapse = () => {
        // only toggle non-top-level category and wdkReference nodes
        if ("wdkReference" in category || depth > 0) {
            onSectionToggle(getId(category), isCollapsed);
        }
    };

    //todo: use target type and create new section type component to break this all up
    switch (getTargetType(category)) {
        case "attribute":
            return (
                <RecordAttributeSection
                    attribute={category.wdkReference}
                    ontologyProperties={category.properties}
                    record={record}
                    recordClass={recordClass}
                    isCollapsed={isCollapsed}
                    requestPartialRecord={requestPartialRecord}
                    onCollapsedChange={toggleCollapse}
                />
            );

        case "table":
            return category.wdkReference.name.includes("highchart") &&
                !isEmpty((record.tables as any)[category.wdkReference.name]) ? (
                <CollapsibleSection
                    id={category.wdkReference.name}
                    className={"wdk-RecordTableContainer"}
                    headerComponent="h3"
                    headerContent={
                        <Box display="flex" justifyContent="space-between" alignItems="baseline">
                            <BaseText>{category.wdkReference.displayName}</BaseText>
                            {category.wdkReference.description && (
                                <HelpIcon>{safeHtml(category.wdkReference.description)}</HelpIcon>
                            )}
                        </Box>
                    }
                    isCollapsed={isCollapsed}
                    onCollapsedChange={toggleCollapse}
                >
                    <HighchartsPlot
                        data={JSON.parse((record.tables as any)[category.wdkReference.name][0].chart)}
                        properties={JSON.parse(category.wdkReference.chartProperties)}
                    />
                </CollapsibleSection>
            ) : category.wdkReference.name.includes("ideogram") &&
              !isEmpty((record.tables as any)[category.wdkReference.name]) ? (
                <CollapsibleSection
                    id={category.wdkReference.name}
                    className={"wdk-RecordTableContainer"}
                    headerComponent="h3"
                    headerContent={
                        <Box display="flex" justifyContent="space-between" alignItems="baseline">
                            <p>{category.wdkReference.displayName}</p>
                            {category.wdkReference.description && (
                                <HelpIcon>{safeHtml(category.wdkReference.description)}</HelpIcon>
                            )}
                        </Box>
                    }
                    isCollapsed={isCollapsed}
                    onCollapsedChange={toggleCollapse}
                >
                    {(record.tables as any)[category.wdkReference.name] && (
                        <IdeogramPlot
                            container="ideogram-container"
                            /* tracks={JSON.parse((record.tables as any)[category.wdkReference.name][0].annotation_tracks)} */
                            annotations={JSON.parse((record.tables as any)[category.wdkReference.name][0].data)}
                        />
                    )}
                </CollapsibleSection>
            ) : (
                <RecordTableSection
                    isCollapsed={isCollapsed}
                    onCollapsedChange={toggleCollapse}
                    ontologyProperties={category.properties}
                    record={record}
                    recordClass={recordClass}
                    requestPartialRecord={requestPartialRecord}
                    table={category.wdkReference}
                />
            );

        default: {
            let id = getId(category);
            let categoryName = getDisplayName(category);
            let Header = 'h' + Math.min(depth + 2, 6);
            let headerContent = (
              <span>
                <span className="wdk-RecordSectionEnumeration">{enumeration}</span> {categoryName}
                <a className="wdk-RecordSectionLink" onClick={e => e.stopPropagation()} href={'#' + id}>&sect;</a>
              </span>
            );
            return (
              <CollapsibleSection
                id={id}
                className={depth === 0 ? 'wdk-RecordSection' : 'wdk-RecordSubsection'}
                headerComponent="h3"
                headerContent={headerContent}
                isCollapsed={isCollapsed}
                onCollapsedChange={toggleCollapse}
              >
                {children}
              </CollapsibleSection>
            );
        
        }
    }
};


export default NiagadsRecordMainCategorySection;
