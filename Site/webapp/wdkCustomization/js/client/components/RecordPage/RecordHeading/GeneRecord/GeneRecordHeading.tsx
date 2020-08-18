import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "./../Shared";
import { getAttributeChartProperties } from "./../Shared/HeaderRecordActions/HeaderRecordActions";
import * as gr from "./../../types";
import { HighchartsTableTrellis, IgvBrowser } from "../../../Visualizations";
import { Link } from "wdk-client/Components";

interface StoreProps {
    externalUrls: { [key: string]: any };
    webAppUrl: string;
}

const enhance = connect<StoreProps, any, RecordHeading>((state: any) => ({
    externalUrls: state.globalData.siteConfig.externalUrls,
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}));

interface RecordHeading {
    record: gr.GeneRecord;
    recordClass: { [key: string]: any };
    headerActions: gr.HeaderActions[];
}

type GeneRecordSummary = StoreProps & gr.GeneRecord;

const GeneRecordSummary: React.SFC<RecordHeading & StoreProps> = ({ record, recordClass, headerActions }) => {
    return (
        <>
            <div className="col-sm-3">
                <div className="record-summary-container gene-record-summary-container">
                    <div>
                        <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                        <h1 className="record-heading">
                            {recordClass.displayName}: {record.displayName}
                        </h1>
                    </div>
                    <h2>
                        {record.displayName} - {record.attributes.source_id}
                    </h2>
                    <ul>
                        <li>
                            <h4 className="subtitle">{record.attributes.gene_name}</h4>
                        </li>

                        {record.attributes.synonyms && (
                            <li>
                                <span className="label">Also known as: {record.attributes.synonyms}</span>
                            </li>
                        )}

                        <li>
                            <span className="label">Gene Type</span>: {record.attributes.gene_type}
                        </li>

                        <li>
                            <span className="label">Location</span>: {record.attributes.span}{" "}
                            {record.attributes.cytogenetic_location
                                ? "/ ".concat(record.attributes.cytogenetic_location)
                                : ""}
                        </li>
                        {record.attributes.ad_evidence_flag && (
                            <li>
                                <span className="label">Genetic Evidence for AD?</span>&nbsp;YES
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="col-sm-9">
                {record.attributes.gws_variants_summary_plot && (
                    <div className="header-summary-plot-title">
                        With which AD-related dementias, neuropathologies, and/or biomarkers are variants proximal to or
                        co-located with {record.attributes.gene_symbol} associated? &nbsp;&nbsp;&nbsp;
                        <a href="#ad_variants_from_gwas">
                            Browse the association evidence <i className="fa fa-level-down"></i>
                        </a>
                    </div>
                )}
                {record.attributes.gws_variants_summary_plot && (
                    <HighchartsTableTrellis
                        data={JSON.parse(record.attributes.gws_variants_summary_plot)}
                        properties={JSON.parse(getAttributeChartProperties(recordClass, "gws_variants_summary_plot"))}
                    />
                )}
            </div>
            <div className="col-sm-12">
                <Link
                    to={`/visualizations/browser?locus=${record.attributes.chromosome}:${
                        +record.attributes.location_start + 10000
                    }-${+record.attributes.location_end + 10000}`}
                >
                    Full Browser View
                </Link>
                <IgvBrowser
                    defaultSpan={`${record.attributes.chromosome}:${+record.attributes.location_start - 50000}-${
                        +record.attributes.location_end + 50000
                    }`}
                />
            </div>
        </>
    );
};

export default enhance(GeneRecordSummary);
