import React from "react";
import { connect } from "react-redux";
import { Tooltip } from "wdk-client/Components";
import { MostSevereConsequencesSection } from "./Components/index";
import { HeaderRecordActions, RecordAttributeItem, SummaryPlotHeader } from "./../Shared";
import { getAttributeChartProperties } from "./../Shared/HeaderRecordActions/HeaderRecordActions";
import { resolveJsonInput, isJson } from "../../../../util/jsonParse";
import { VariantRecordSummary, VariantRecordAttributes } from "./../../types";
import { HighchartsTableTrellis } from "../../../Visualizations/Highcharts/HighchartsTrellisPlot";
import { Box, Grid, List } from "@material-ui/core";
import { Check, ReportProblemOutlined } from "@material-ui/icons";
import { Subheading, SubheadingSmall, SmallBadge, BaseTextSmall } from "../../../Shared/Typography";
import { UnpaddedListItem } from "../../../Shared";

interface StoreProps {
    externalUrls: { [key: string]: any };
    webAppUrl: string;
}

const enhance = connect((state: any) => ({
    externalUrls: state.globalData.siteConfig.externalUrls,
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}));

const VariantRecordSummary: React.FC<VariantRecordSummary & StoreProps> = (props) => {
    const { record, headerActions, recordClass } = props,
        { attributes } = record;

    return (
        <Grid container style={{ marginLeft: "10px" }}>
            <Grid item container direction="column" sm={3}>
                <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                <Subheading style={{ paddingBottom: "0px" }}>
                    <strong>
                        {isJson(attributes.display_metaseq_id)
                            ? resolveJsonInput(attributes.display_metaseq_id)
                            : attributes.display_metaseq_id}
                    </strong>
                </Subheading>

                {attributes.ref_snp_id && <SubheadingSmall>{attributes.ref_snp_id}</SubheadingSmall>}
                <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
                    <BaseTextSmall>
                        Has this variant been flagged by the ADSP?&nbsp;&nbsp;&nbsp;
                        {attributes.is_adsp_variant ? (
                            <strong>
                                <Check style={{ color: "red" }} />
                                &nbsp;Yes
                            </strong>
                        ) : (
                            <strong>No</strong>
                        )}
                    </BaseTextSmall>
                    <ADSPQCDisplay attributes={record.attributes} />
                </Box>
                {attributes.most_severe_consequence && <MostSevereConsequencesSection attributes={attributes} />}

                <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
                    <RecordAttributeItem label="Allele:" attribute={attributes.display_allele} />
                    <BaseTextSmall>{attributes.variant_class}</BaseTextSmall>
                    {attributes.location && <RecordAttributeItem label="Location:" attribute={attributes.location} />}
                </Box>
                {(attributes.alternative_variants || attributes.colocated_variants) && (
                    <Box paddingBottom={1} borderBottom="1px solid">
                        {attributes.alternative_variants && (
                            <AlternativeVariants altVars={attributes.alternative_variants} />
                        )}
                        {attributes.colocated_variants && (
                            <ColocatedVariants
                                position={attributes.position}
                                chromosome={attributes.chromosome}
                                colVars={attributes.colocated_variants}
                            />
                        )}
                    </Box>
                )}
            </Grid>
            <Grid item sm={9} container>
                {record.attributes.gws_datasets_summary_plot && (
                    <SummaryPlotHeader
                        labelText="Summary of AD/ADRD associations for this variant:"
                        linkTarget="#category:phenomics"
                    />
                )}

                {record.attributes.gws_datasets_summary_plot && (
                    <HighchartsTableTrellis
                        data={JSON.parse(record.attributes.gws_datasets_summary_plot)}
                        properties={JSON.parse(getAttributeChartProperties(recordClass, "gws_datasets_summary_plot"))}
                    />
                )}
            </Grid>
        </Grid>
    );
};

const ADSPQCDisplay: React.FC<{ attributes: VariantRecordAttributes }> = ({ attributes }) =>
    (attributes.adsp_wgs_qc_filter_status || attributes.adsp_wes_qc_filter_status) && (
        <Box>
            {attributes.adsp_wes_qc_filter_status &&
                (attributes.is_adsp_wes ? (
                    <Box marginBottom={1} display="flex" alignItems="center">
                        <SmallBadge backgroundColor="red">WES</SmallBadge> {attributes.adsp_wes_qc_filter_status}
                    </Box>
                ) : (
                    <Box marginBottom={1} display="flex" alignItems="center">
                        <SmallBadge backgroundColor="black">WES</SmallBadge> {attributes.adsp_wes_qc_filter_status}
                    </Box>
                ))}
            {attributes.adsp_wgs_qc_filter_status &&
                (attributes.is_adsp_wgs ? (
                    <Box marginBottom={1} display="flex" alignItems="center">
                        <SmallBadge backgroundColor="red">WGS</SmallBadge> {attributes.adsp_wgs_qc_filter_status}
                    </Box>
                ) : (
                    <Box marginBottom={1} display="flex" alignItems="center">
                        <SmallBadge backgroundColor="black">WGS</SmallBadge> {attributes.adsp_wgs_qc_filter_status}
                    </Box>
                ))}
        </Box>
    );

const AlternativeVariants: React.FC<{ altVars: string }> = ({ altVars }) => (
    <div>
        <ReportProblemOutlined fontSize="small" /> This variant is&nbsp;
        <Tooltip content={"Use the links below to view annotations for additional alt alleles"}>
            <span className="wdk-tooltip">multi-allelic:</span>
        </Tooltip>
        <LinkList list={JSON.parse(altVars)} />
    </div>
);

const ColocatedVariants: React.FC<{ colVars: string; position: string; chromosome: string }> = ({
    colVars,
    position,
    chromosome,
}) => (
    <div>
        <ReportProblemOutlined fontSize="small" />
        This position ({`${chromosome}: ${position}`}) coincides with&nbsp;
        <Tooltip
            content={
                "use the links below to view annotations for co-located/overlapping variants (e.g., indels, structural variants, co-located SNVs not annotated by dbSNP)"
            }
        >
            <span className="wdk-tooltip">additional variants:</span>
        </Tooltip>
        <LinkList list={JSON.parse(colVars)} />
    </div>
);

const LinkList: React.FC<{ list: string[] }> = ({ list }) => (
    <List disablePadding={true}>
        {list.map((item, i) => (
            <UnpaddedListItem key={i}>{resolveJsonInput(item)}</UnpaddedListItem>
        ))}
    </List>
);

export default enhance(VariantRecordSummary);
