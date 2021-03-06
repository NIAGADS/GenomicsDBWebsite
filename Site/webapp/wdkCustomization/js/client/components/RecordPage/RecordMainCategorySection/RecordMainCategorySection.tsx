import React from "react";
import { RecordAttributeSection, CollapsibleSection, HelpIcon } from "wdk-client/Components";
import RecordTableSection from "../RecordTableSection/RecordTableSection";
import { getId, getTargetType, getDisplayName } from "wdk-client/Utils/CategoryUtils";
import * as GR from "../types";
import { IdeogramPlot, HighchartsPlot } from "../../Visualizations";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { isEmpty } from "lodash";
import { GeneGeneticVariationSummary } from "./SectionSummaries";

interface RecordMainCategorySection {
    category: any;
    depth: number;
    enumeration: any;
    isCollapsed: boolean;
    onSectionToggle: { (sectionName: string, isVisible: boolean): any };
    record: GR.GeneRecord | GR.VariantRecord | GR.GWASDatasetRecord | GR.NIAGADSDatasetRecord;
    recordClass: any;
    requestPartialRecord?: any;
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
                    requestParialRecord={requestPartialRecord}
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
                        <div className="d-flex justify-between align-items-baseline">
                            <p className="mb-0">{category.wdkReference.displayName}</p>
                            {category.wdkReference.description && (
                                <HelpIcon>{safeHtml(category.wdkReference.description)}</HelpIcon>
                            )}
                        </div>
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
                        <div className="d-flex justify-between align-items-baseline">
                            <p>{category.wdkReference.displayName}</p>
                            {category.wdkReference.description && (
                                <HelpIcon>{safeHtml(category.wdkReference.description)}</HelpIcon>
                            )}
                        </div>
                    }
                    isCollapsed={isCollapsed}
                    onCollapsedChange={toggleCollapse}
                >
                    {(record.tables as any)[category.wdkReference.name] && (
                        <IdeogramPlot
                            container="ideogram-container"
                            tracks={JSON.parse((record.tables as any)[category.wdkReference.name][0].annotation_tracks)}
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
            const id = getId(category),
                categoryName = getDisplayName(category),
                Header = "h" + Math.min(depth + 3, 6),
                SubHeader = React.createElement(
                    "h" + Math.min(depth + 4, 6),
                    {},
                    "Here is some new text in the heading area"
                ),
                headerContent = (
                    <span>
                        <span className="wdk-RecordSectionEnumeration">{enumeration}</span> {categoryName}
                        {/*SubHeader*/}
                        <a className="wdk-RecordSectionLink" onClick={(e) => e.stopPropagation()} href={"#" + id}>
                            &sect;
                        </a>
                    </span>
                );
            return (
                <CollapsibleSection
                    id={id}
                    className={depth === 0 ? "wdk-RecordSection" : "wdk-RecordSubsection"}
                    //this seems to be an issue with section component typing
                    //@ts-ignore
                    headerComponent={Header}
                    headerContent={headerContent}
                    isCollapsed={isCollapsed}
                    onCollapsedChange={toggleCollapse}
                >
                    <SectionSummaryText record={record} categoryId={id} />
                    {children}
                </CollapsibleSection>
            );
        }
    }
};

interface SectionSummaryText {
    record: GR.GeneRecord | GR.VariantRecord | GR.GWASDatasetRecord | GR.NIAGADSDatasetRecord;
    categoryId: string;
}

const SectionSummaryText: React.FC<SectionSummaryText> = ({ categoryId, record }) => {
    let Element: React.ReactElement<any> = null;
    switch (categoryId) {
        case "category:genetic-variation":
            switch (record.recordClassName) {
                case "GeneRecordClasses.GeneRecordClass":
                    const geneRec = record as GR.GeneRecord;
                    Element = <GeneGeneticVariationSummary record={geneRec} />;
                    break;
            }
            break;
    }
    return <div className="section-summary-text">{Element}</div>;
};

export default NiagadsRecordMainCategorySection;
