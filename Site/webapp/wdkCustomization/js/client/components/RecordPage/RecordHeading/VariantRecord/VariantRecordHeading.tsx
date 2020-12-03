import React from "react";
import { connect } from "react-redux";
import { Tooltip, HelpIcon } from "wdk-client/Components";
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
        { attributes } = record;

    return (
        <React.Fragment>
            {/* ensure that header doesn't bleed into neighboring component but only grows to fit content */}
            <div className="col col-3">
                <div className="record-summary-container variant-record-summary-container">
                    <div>
                        <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                    </div>
                    <h2>
                        <strong>
                            {isJson(attributes.display_metaseq_id)
                                ? resolveJsonInput(attributes.display_metaseq_id)
                                : attributes.display_metaseq_id}
                        </strong>
                    </h2>
                    <h5 className="mb-2">{attributes.ref_snp_id && attributes.ref_snp_id}</h5>
                    <div className="record-subtitle-container">
                        <p>
                            Has this variant been flagged by the ADSP?&nbsp;
                            {attributes.is_adsp_variant ? <strong><span className="fa fa-check red">&nbsp;Yes</span></strong> : <strong>No</strong>}
                        </p>
                        <ADSPQCDisplay attributes={record.attributes} />
                        {attributes.most_severe_consequence && (
                            <MostSevereConsequencesSection attributes={attributes} />
                        )}
                        <p>
                            <span className="label">
                                <strong>Allele:&nbsp;</strong>
                            </span>
                            {attributes.display_allele}
                        </p>
                        <p>
                            {attributes.variant_class}
                        </p>
                        {attributes.location && (
                            <p>
                                <span className="label">
                                    <strong>Location:&nbsp;</strong>
                                </span>
                                {attributes.location}
                            </p>
                        )}
                    </div>
                    <div className="record-detail-container">
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


                {record.attributes.gws_datasets_summary_plot && (
                    <div className="header-summary-plot-title">
                        Summary of AD/ADRD associations for this variant: &nbsp;&nbsp;&nbsp;
                        <a href="#category:phenomics">
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
        (attributes.adsp_wgs_qc_filter_status || attributes.adsp_wes_qc_filter_status) && (
            <div className="adsp-variant-info-container">
                {attributes.adsp_wes_qc_filter_status &&
                    (attributes.is_adsp_wes
                        ? <div className="mb-2">{" "}<span className="small badge red">WES</span>{" "}{attributes.adsp_wes_qc_filter_status}</div>
                        : <div className="mb-2">{" "}<span className="small badge black">WES</span>{" "}{attributes.adsp_wes_qc_filter_status}</div>
                    )
                }
                {attributes.adsp_wgs_qc_filter_status &&
                    (attributes.is_adsp_wgs
                        ? <div className="mb-2">{" "}<span className="small badge red">WGS</span>{" "}{attributes.adsp_wgs_qc_filter_status}</div>
                        : <div className="mb-2">{" "}<span className="small badge black">WGS</span>{" "}{attributes.adsp_wgs_qc_filter_status}</div>
                    )
                }
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
                    "use the links below to view annotations for co-located/overlapping variants (e.g., indels, structural variants, co-located SNVs not annotated by dbSNP)"
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
