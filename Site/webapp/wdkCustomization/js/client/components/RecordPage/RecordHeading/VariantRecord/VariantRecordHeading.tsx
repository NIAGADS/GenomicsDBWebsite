import React from "react";
import { connect } from "react-redux";
import { Tooltip } from "wdk-client/Components";
import { MostSevereConsequencesSection } from "./Components/index";
import { HeaderRecordActions, RecordOutLink } from "./../Shared";
import { getAttributeChartProperties } from "./../Shared/HeaderRecordActions/HeaderRecordActions";
import { resolveJsonInput, isJson } from "../../../../util/jsonParse";
import { isTrue } from "../../../../util/util";
import * as gr from "./../../types";
import { HighchartsTableTrellis } from "../../../Visualizations/Highcharts/HighchartsTrellisPlot";

interface StoreProps {
    externalUrls: { [key: string]: any };
    webAppUrl: string;
}

const enhance = connect<StoreProps, any, gr.VariantRecordSummary>((state: any) => ({
    externalUrls: state.globalData.siteConfig.externalUrls,
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}));

const VariantRecordSummary: React.SFC<gr.VariantRecordSummary & StoreProps> = (props) => {
    const { record, headerActions, recordClass, externalUrls } = props,
        { attributes } = record,
        sequence = (
            <React.Fragment>
                <span>{attributes.downstream_sequence}</span>
                {resolveJsonInput(attributes.sequence_allele)}
                <span>{attributes.upstream_sequence}</span>
            </React.Fragment>
        );
    return (
        <React.Fragment>
            {/* ensure that header doesn't bleed into neighboring component but only grows to fit content */}
            <div className="col flex-grow-0">
                <div className="record-summary-container variant-record-summary-container">
                    <div>
                        <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                    </div>
                    <h2 className="mb-2">
                        <strong>
                            {isJson(attributes.display_metaseq_id)
                                ? resolveJsonInput(attributes.display_metaseq_id)
                                : attributes.display_metaseq_id}
                            {attributes.ref_snp_id && " (" + attributes.ref_snp_id + ")"}
                        </strong>
                    </h2>
                    <div className="record-subtitle-container">
                        <p>
                            <strong>{sequence}</strong>
                        </p>
                        <p>
                            <strong>{attributes.variant_class}</strong>
                        </p>
                        {attributes.most_severe_consequence && (
                            <MostSevereConsequencesSection attributes={attributes} />
                        )}
                        {attributes.location && (
                            <p>
                                <span className="label">
                                    <strong>Location:&nbsp;</strong>
                                </span>
                                {attributes.location}
                            </p>
                        )}
                        <p>
                            <span className="label">
                                <strong>Allele:&nbsp;</strong>
                            </span>
                            {attributes.display_allele}
                        </p>
                    </div>
                    <div className="record-detail-container">
                        <div className="reversed-info-container">
                            {isTrue(attributes.is_reversed) && (
                                <p>
                                    This variant is on the
                                    <Tooltip content="The variant is reported by dbSNP as being on the reverse strand. All sequences displayed in the GenomicsDB and mappings to variant annotations are on the forward strand.">
                                        <span className="wdk-tooltip">&nbsp;reverse strand</span>
                                    </Tooltip>
                                    .
                                </p>
                            )}
                        </div>
                        {attributes.alternative_variants && (
                            <div className="related-variants-container">
                                <AlternativeVariants altVars={attributes.alternative_variants} />
                            </div>
                        )}
                        {attributes.colocated_variants && (
                            <div className="colocated-variants-container">
                                <ColocatedVariants
                                    position={attributes.position}
                                    chromosome={attributes.chromosome}
                                    colVars={attributes.colocated_variants}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="header-summary-plot-title">
                    Has this variant been flagged by the <a href={`${externalUrls.ADSP_URL}`}>ADSP</a>?
                </div>
                {record.attributes.is_adsp_variant ? (
                    <ADSPQCDisplay attributes={record.attributes} />
                ) : (
                    <span className="none-adsp-variant">No</span>
                )}

                {record.attributes.gws_datasets_summary_plot && (
                    <div className="header-summary-plot-title">
                        With which AD-related dementias, neuropathologies, or biomarkers has this variant been
                        associated? &nbsp;&nbsp;&nbsp;
                        <a href="#ad_variants_from_gwas">
                            Browse the association evidence <i className="fa fa-level-down"></i>
                        </a>
                    </div>
                )}

                {record.attributes.gws_datasets_summary_plot && (
                    <HighchartsTableTrellis
                        data={JSON.parse(record.attributes.gws_datasets_summary_plot)}
                        properties={JSON.parse(getAttributeChartProperties(recordClass, "gws_datasets_summary_plot"))}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

const ADSPQCDisplay: React.SFC<{ attributes: gr.VariantRecordAttributes }> = (props) => {
    const { attributes } = props;
    return (
        (attributes.adsp_wgs_qc_filter_status_display || attributes.adsp_wes_qc_filter_status_display) && (
            <div className="adsp-variant-info-container">
                {attributes.is_adsp_variant && <strong>{resolveJsonInput(attributes.is_adsp_variant)}&nbsp;</strong>}
                {attributes.is_adsp_wes && (
                    <div className="mb-2">
                        {resolveJsonInput(attributes.is_adsp_wes)}{" "}
                        <strong>{resolveJsonInput(attributes.adsp_wes_qc_filter_status_display)}</strong>
                    </div>
                )}
                {attributes.is_adsp_wgs && (
                    <div>
                        {resolveJsonInput(attributes.is_adsp_wgs)}{" "}
                        <strong>{resolveJsonInput(attributes.adsp_wgs_qc_filter_status_display)}</strong>
                    </div>
                )}
            </div>
        )
    );
};

const AlternativeVariants: React.SFC<{ altVars: string }> = (props) => {
    const vars = JSON.parse(props.altVars);
    return (
        <div>
            <i className="fa fa-exclamation-triangle"></i> This variant is&nbsp;
            <Tooltip content={"Use the links below to view annotations for additional alt alleles"}>
                <span className="wdk-tooltip">multi-allelic:</span>
            </Tooltip>
            <ul className="m-l-20 link-list">
                {vars.map((variant: any, i: number) => (
                    <li key={i}>{resolveJsonInput(variant)}</li>
                ))}
            </ul>
        </div>
    );
};

const ColocatedVariants: React.SFC<{ colVars: string; position: string; chromosome: string }> = (props) => {
    const colVars = JSON.parse(props.colVars),
        positionString = `${props.chromosome}: ${props.position}`;

    return (
        <div>
            <i className="fa fa-exclamation-triangle"></i>This position ({positionString}) coincides with&nbsp;
            <Tooltip
                content={
                    "use the links below to view annotations for additional dbSNP refSNP IDs assigned to this variant or alterantive variant types (e.g., indel vs SNV) that overlap the variant position"
                }
            >
                <span className="wdk-tooltip">additional variants:</span>
            </Tooltip>
            <ul className="m-l-20 link-list">
                {colVars.map((variant: any, i: number) => (
                    <li key={i}>{resolveJsonInput(variant)}</li>
                ))}
            </ul>
        </div>
    );
};

const horizontalLinks: RecordOutLink[] = [
    {
        baseUrl: "EXAC_VARIANT_URL",
        title: "ExAC",
        modelKey: "link_out_variant_id",
    },
    {
        baseUrl: "DBSNP_URL",
        title: "dbSNP",
        modelKey: "ref_snp_id",
    },
    {
        baseUrl: "ENSEMBL_VARIANT_URL",
        title: "Ensembl",
        modelKey: "ref_snp_id",
    },
    {
        baseUrl: "GTEX_VARIANT_URL",
        title: "GTEx",
        modelKey: "ref_snp_id",
    },
];

export default enhance(VariantRecordSummary);
