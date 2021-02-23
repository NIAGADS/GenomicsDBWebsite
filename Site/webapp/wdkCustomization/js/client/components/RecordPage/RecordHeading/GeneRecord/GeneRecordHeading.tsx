import React from "react";
import { connect } from "react-redux";
import { HeaderRecordActions } from "./../Shared";
import { getAttributeChartProperties } from "./../Shared/HeaderRecordActions/HeaderRecordActions";
import * as gr from "./../../types";
import { HighchartsTableTrellis } from "../../../Visualizations";
import { resolveJsonInput } from "../../../../util/jsonParse";
import { Grid } from "@material-ui/core";

interface StoreProps {
    externalUrls: { [key: string]: any };
}

const enhance = connect<StoreProps, any, RecordHeading>((state: any) => ({
    externalUrls: state.globalData.siteConfig.externalUrls,
}));

interface RecordHeading {
    record: gr.GeneRecord;
    recordClass: { [key: string]: any };
    headerActions: gr.HeaderActions[];
}

type GeneRecordSummary = StoreProps & gr.GeneRecord;

const GeneRecordSummary: React.FC<RecordHeading & StoreProps> = ({ record, recordClass, headerActions }) => {
    return (
        <Grid container spacing={3} style={{ marginLeft: "10px" }}>
            <Grid item container direction="column" sm={3}>
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
                        {record.attributes.has_genetic_evidence_for_ad_risk && (
                            <li>
                                <span className="label">Genetic Evidence for AD?</span>&nbsp;{" "}
                                {resolveJsonInput(record.attributes.has_genetic_evidence_for_ad_risk_display)}
                            </li>
                        )}
                    </ul>
                </div>
            </Grid>
            <Grid item container xs={9}>
                {record.attributes.gws_variants_summary_plot && (
                    <div className="header-summary-plot-title">
                        Summary of AD/ADRD associations for this variants proximal to {record.attributes.gene_symbol}:
                        &nbsp;&nbsp;&nbsp;
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
            </Grid>
        </Grid>
    );
};

export default enhance(GeneRecordSummary);
