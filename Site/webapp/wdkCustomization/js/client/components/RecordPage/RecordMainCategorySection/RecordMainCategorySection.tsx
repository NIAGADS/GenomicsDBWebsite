import React from 'react';
import { RecordAttributeSection, CollapsibleSection, Tooltip } from 'wdk-client/Components';
import RecordTableSection from '../RecordTableSection/RecordTableSection';
import { getId, getTargetType, getDisplayName } from 'wdk-client/CategoryUtils';
import * as GR from '../types';
import { resolveJsonInput } from '../../../util/jsonParse';
import { IdeogramPlot, HighchartPlot, HighchartPlotList } from './Visualizations';
import { safeHtml } from 'wdk-client/ComponentUtils';
import { isEmpty } from 'lodash';
import { VariantTranscriptConsequencesSummary, GeneGeneticVariationSummary, VariantLzPlot } from './SectionSummaries';
import LzPlot, { LzGeneProps } from './Visualizations/LocusZoom/LZPlot';
import { CATEGORY_EXPANSION } from 'wdk-client/Actions/RecordActions';

interface RecordMainCategorySection {
    category: any;
    onSectionToggle: { (sectionName: string, isVisible: boolean): any };
    isCollapsed: boolean;
    depth: number;
    record: GR.GeneRecord;
    recordClass: any;
    enumeration: any;
}

export default class NiagadsRecordMainCategorySection extends React.PureComponent<RecordMainCategorySection> {
    constructor(props: RecordMainCategorySection) {
        super(props);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    toggleCollapse() {
        let { category, onSectionToggle, isCollapsed, depth } = this.props;
        // only toggle non-top-level category and wdkReference nodes
        if ('wdkReference' in category || depth > 0) {
            onSectionToggle(getId(category), isCollapsed);
        }
    }

    render() {
        let { record, recordClass, category, depth, isCollapsed, enumeration, children } = this.props;

        //todo: use target type and create new section type component to break this all up
        switch (getTargetType(category)) {
            case 'attribute':
                <RecordAttributeSection
                    attribute={category.wdkReference}
                    ontologyProperties={category.properties}
                    record={record}
                    recordClass={recordClass}
                    isCollapsed={isCollapsed}
                    onCollapsedChange={this.toggleCollapse}
                />;

            case 'table':
                return category.wdkReference.name.includes('highchart') &&
                    !isEmpty((record.tables as any)[category.wdkReference.name]) ? (
                    <CollapsibleSection
                        id={category.wdkReference.name}
                        className={'wdk-RecordTableContainer'}
                        headerComponent="h3"
                        headerContent={
                            <div className="d-flex justify-between align-items-center">
                                <p>{category.wdkReference.displayName}</p>
                                {category.wdkReference.description && (
                                    <Tooltip
                                        content={safeHtml(category.wdkReference.description)}
                                        showDelay={0}
                                        position={{
                                            my: 'top right',
                                            at: 'bottom left',
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
                        {category.wdkReference.name.includes('highchart_list')
                            ? (record.tables as any)[category.wdkReference.name] && (
                                  <HighchartPlotList
                                      attribute={category.wdkReference.name}
                                      charts={(record.tables as any)[category.wdkReference.name][0].charts}
                                  />
                              )
                            : (record.tables as any)[category.wdkReference.name] && (
                                  <HighchartPlot
                                      multiPlot={false}
                                      chart={JSON.parse((record.tables as any)[category.wdkReference.name][0].chart)}
                                  />
                              )}
                    </CollapsibleSection>
                ) : category.wdkReference.name == 'locuszoom_gwas_datasets' ? (
                    <CollapsibleSection
                        id={category.wdkReference.name}
                        className={'wdk-RecordTableContainer'}
                        headerComponent="h3"
                        headerContent={category.wdkReference.displayName}
                        isCollapsed={isCollapsed}
                        onCollapsedChange={this.toggleCollapse}
                    >
                        {(record.tables as any)[category.wdkReference.name] && (
                            <VariantLzPlot
                                selectClass={'lz-plot'}
                                chromosome={record.attributes.chromosome}
                                populationChoices={[
                                    { EUR: 'EUR: European' },
                                    { AFR: 'AFR: African/African American' },
                                    { AMR: 'AMR: Ad Mixed American' },
                                    { EAS: 'EAS: East Asian' },
                                    { SAS: 'SAS: South Asian' },
                                ]}
                                variant={`${record.attributes.metaseq_id}_${record.attributes.ref_snp_id}`}
                                location={+record.attributes.position}
                                datasetChoices={JSON.parse(
                                    (record.tables as any)[category.wdkReference.name][0].dataset_list
                                )}
                            />
                        )}
                    </CollapsibleSection>
                ) : category.wdkReference.name.includes('ideogram') &&
                  !isEmpty((record.tables as any)[category.wdkReference.name]) ? (
                    <CollapsibleSection
                        id={category.wdkReference.name}
                        className={'wdk-RecordTableContainer'}
                        headerComponent="h3"
                        headerContent={
                            <div className="d-flex justify-between align-items-center">
                                <p>{category.wdkReference.displayName}</p>
                                {category.wdkReference.description && (
                                    <Tooltip
                                        content={safeHtml(category.wdkReference.description)}
                                        showDelay={0}
                                        position={{
                                            my: 'top right',
                                            at: 'bottom left',
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
                                container={`${category.wdkReference.name}_plot`}
                                tracks={JSON.parse(
                                    (record.tables as any)[category.wdkReference.name][0].annotation_tracks
                                )}
                                data={JSON.parse((record.tables as any)[category.wdkReference.name][0].data)}
                            />
                        )}
                    </CollapsibleSection>
                ) : (
                    <RecordTableSection
                        table={category.wdkReference}
                        ontologyProperties={category.properties}
                        record={record}
                        recordClass={recordClass}
                        isCollapsed={isCollapsed}
                        onCollapsedChange={this.toggleCollapse}
                    />
                );

            default: {
                const id = getId(category),
                    categoryName = getDisplayName(category),
                    Header = 'h' + Math.min(depth + 3, 6),
                    SubHeader = React.createElement(
                        'h' + Math.min(depth + 4, 6),
                        {},
                        'Here is some new text in the heading area'
                    ),
                    headerContent = (
                        <span>
                            <span className="wdk-RecordSectionEnumeration">{enumeration}</span> {categoryName}
                            {/*SubHeader*/}
                            <a className="wdk-RecordSectionLink" onClick={e => e.stopPropagation()} href={'#' + id}>
                                &sect;
                            </a>
                        </span>
                    );
                return (
                    <CollapsibleSection
                        id={id}
                        className={depth === 0 ? 'wdk-RecordSection' : 'wdk-RecordSubsection'}
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
    record: GR.GeneRecord | GR.VariantRecord;
    categoryId: string;
}

const SectionSummaryText: React.SFC<SectionSummaryText> = props => {
    const { record } = props;
    let Element: React.ReactElement<any> = null;
    switch (props.categoryId) {
        case 'category:genetic-variation':
            switch (props.record.recordClassName) {
                case 'GeneRecordClasses.GeneRecordClass':
                    const geneRec = record as GR.GeneRecord;
                    Element = <GeneGeneticVariationSummary record={geneRec} />;
                    break;
            }
            break;
        //todo: which is current?
        case 'function-analysis':
        case 'category:function-analysis':
            switch (props.record.recordClassName) {
                case 'VariantRecordClasses.VariantRecordClass':
                    Element = <VariantTranscriptConsequencesSummary record={record as GR.VariantRecord} />;
                    break;
            }
            break;
    }
    return <div className="section-summary-text">{Element}</div>;
};
