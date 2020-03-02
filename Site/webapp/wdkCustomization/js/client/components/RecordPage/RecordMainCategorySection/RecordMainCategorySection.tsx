import React from "react";
import {
  RecordAttributeSection,
  CollapsibleSection,
  Tooltip
} from "wdk-client/Components";
import RecordTableSection from "../RecordTableSection/RecordTableSection";
import {
  getId,
  getTargetType,
  getDisplayName
} from "wdk-client/Utils/CategoryUtils";
import * as GR from "../types";
import {
  IdeogramPlot,
  HighchartsPlot,
} from "../../Visualizations";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { isEmpty } from "lodash";
import {
  VariantTranscriptConsequencesSummary,
  GeneGeneticVariationSummary,
  VariantLzPlot
} from "./SectionSummaries";

interface RecordMainCategorySection {
  category: any;
  depth: number;
  enumeration: any;
  isCollapsed: boolean;
  onSectionToggle: { (sectionName: string, isVisible: boolean): any };
  record:
  | GR.GeneRecord
  | GR.VariantRecord
  | GR.GWASDatasetRecord
  | GR.NIAGADSDatasetRecord;
  recordClass: any;
  requestPartialRecord: any;
}

export default class NiagadsRecordMainCategorySection extends React.PureComponent<
  RecordMainCategorySection
  > {
  constructor(props: RecordMainCategorySection) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse() {
    let { category, onSectionToggle, isCollapsed, depth } = this.props;
    // only toggle non-top-level category and wdkReference nodes
    if ("wdkReference" in category || depth > 0) {
      onSectionToggle(getId(category), isCollapsed);
    }
  }

  render() {
    let {
      children,
      depth,
      enumeration,
      isCollapsed,
      record,
      recordClass,
      requestPartialRecord,
      category
    } = this.props;

    //todo: use target type and create new section type component to break this all up
    switch (getTargetType(category)) {
      case "attribute":
        <RecordAttributeSection
          attribute={category.wdkReference}
          ontologyProperties={category.properties}
          record={record}
          recordClass={recordClass}
          isCollapsed={isCollapsed}
          requestParialRecord={requestPartialRecord}
          onCollapsedChange={this.toggleCollapse}
        />;

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
                    <Tooltip
                      content={safeHtml(category.wdkReference.description)}
                      showDelay={0}
                      position={{
                        my: "top right",
                        at: "bottom left"
                      }}
                    >
                      <span className="fa fa-question-circle-o table-help" />
                    </Tooltip>
                  )}
                </div>
              }
              isCollapsed={isCollapsed}
              onCollapsedChange={this.toggleCollapse}>
            
              <HighchartsPlot data={JSON.parse((record.tables as any)[category.wdkReference.name][0].chart)} 
                properties={JSON.parse(category.wdkReference.chartProperties)} />

            </CollapsibleSection>
          ) : category.wdkReference.name == "locuszoom_gwas_datasets" &&
            GR.isVariantRecord(record) ? (
              <CollapsibleSection
                id={category.wdkReference.name}
                className={"wdk-RecordTableContainer"}
                headerComponent="h3"
                headerContent={category.wdkReference.displayName}
                isCollapsed={isCollapsed}
                onCollapsedChange={this.toggleCollapse}
              >
                {(record.tables as any)[category.wdkReference.name] && (
                  <VariantLzPlot
                    selectClass={"lz-plot"}
                    chromosome={record.attributes.chromosome}
                    populationChoices={[
                      { EUR: "EUR: European" },
                      { AFR: "AFR: African/African American" },
                      { AMR: "AMR: Ad Mixed American" },
                      { EAS: "EAS: East Asian" },
                      { SAS: "SAS: South Asian" }
                    ]}
                    variant={`${record.attributes.metaseq_id}_${record.attributes.ref_snp_id}`}
                    location={+record.attributes.position}
                    datasetChoices={JSON.parse(
                      (record.tables as any)[category.wdkReference.name][0]
                        .dataset_list
                    )}
                  />
                )}
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
                        <Tooltip
                          content={safeHtml(category.wdkReference.description)}
                          showDelay={0}
                          position={{
                            my: "top right",
                            at: "bottom left"
                          }}
                        >
                          <span className="fa fa-question-circle-o table-help" />
                        </Tooltip>
                      )}
                    </div>
                  }
                  isCollapsed={isCollapsed}
                  onCollapsedChange={this.toggleCollapse}
                >
                  {(record.tables as any)[category.wdkReference.name] && (
                    <IdeogramPlot
                      container="ideogram-container"
                      tracks={JSON.parse(
                        (record.tables as any)[category.wdkReference.name][0]
                          .annotation_tracks
                      )}
                      annotations={JSON.parse(
                        (record.tables as any)[category.wdkReference.name][0].data
                      )}
                    />
                  )}
                </CollapsibleSection>
              ) : (
                <RecordTableSection
                  isCollapsed={isCollapsed}
                  onCollapsedChange={this.toggleCollapse}
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
              <span className="wdk-RecordSectionEnumeration">
                {enumeration}
              </span>{" "}
              {categoryName}
              {/*SubHeader*/}
              <a
                className="wdk-RecordSectionLink"
                onClick={e => e.stopPropagation()}
                href={"#" + id}
              >
                &sect;
              </a>
            </span>
          );
        return (
          <CollapsibleSection
            id={id}
            className={
              depth === 0 ? "wdk-RecordSection" : "wdk-RecordSubsection"
            }
            //this seems to be an issue with section component typing
            //@ts-ignore
            headerComponent={Header}
            headerContent={headerContent}
            isCollapsed={isCollapsed}
            onCollapsedChange={this.toggleCollapse}
          >
            <SectionSummaryText record={record} categoryId={id} />
            {children}
          </CollapsibleSection>
        );
      }
    }
  }
}

interface SectionSummaryText {
  record:
  | GR.GeneRecord
  | GR.VariantRecord
  | GR.GWASDatasetRecord
  | GR.NIAGADSDatasetRecord;
  categoryId: string;
}

const SectionSummaryText: React.SFC<SectionSummaryText> = props => {
  const { record } = props;
  let Element: React.ReactElement<any> = null;
  switch (props.categoryId) {
    case "category:genetic-variation":
      switch (props.record.recordClassName) {
        case "GeneRecordClasses.GeneRecordClass":
          const geneRec = record as GR.GeneRecord;
          Element = <GeneGeneticVariationSummary record={geneRec} />;
          break;
      }
      break;
    //todo: which is current?
    case "function-analysis":
    case "category:function-analysis":
      switch (props.record.recordClassName) {
        case "VariantRecordClasses.VariantRecordClass":
          Element = (
            <VariantTranscriptConsequencesSummary
              record={record as GR.VariantRecord}
            />
          );
          break;
      }
      break;
  }
  return <div className="section-summary-text">{Element}</div>;
};
