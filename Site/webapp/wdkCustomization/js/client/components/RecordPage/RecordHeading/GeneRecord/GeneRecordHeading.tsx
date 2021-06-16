import React from "react";
import { HeaderRecordActions, RecordAttributeItem, SummaryPlotHeader } from "./../Shared";
import { getAttributeChartProperties } from "./../Shared/HeaderRecordActions/HeaderRecordActions";
import { RecordHeading } from "../RecordHeadingTypes";
import { HighchartsTableTrellis } from "../../../Visualizations";
import { resolveJsonInput } from "../../../../util/jsonParse";
import { Grid, List, Typography } from "@material-ui/core";
import { BaseText, BaseTextSmall, Subheading, UnpaddedListItem } from "../../../Shared";


const GeneRecordSummary: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => {
    return (
        <Grid container style={{ marginLeft: "10px" }}>
            <Grid item container direction="column" sm={3}>
                <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                <Subheading style={{ paddingBottom: "0px" }}>
                    <strong>
                        {recordClass.displayName}: {record.displayName}
                    </strong>
                </Subheading>
                <Typography variant="h5">
                    {record.displayName} - {record.attributes.source_id}
                </Typography>
                <List>
                    <UnpaddedListItem>
                        <BaseText>
                            <strong>{record.attributes.gene_name}</strong>
                        </BaseText>
                    </UnpaddedListItem>

                    {record.attributes.synonyms && (
                        <UnpaddedListItem>
                            <RecordAttributeItem label="Also known as:" attribute={record.attributes.synonyms.toString()} />
                        </UnpaddedListItem>
                    )}

                    <UnpaddedListItem>
                        <RecordAttributeItem label="Gene Type:" attribute={record.attributes.gene_type.toString()} />
                    </UnpaddedListItem>

                    <UnpaddedListItem>
                        <RecordAttributeItem
                            label="Location:"
                            attribute={`${record.attributes.span}${
                                record.attributes.cytogenetic_location
                                    ? "/ ".concat(record.attributes.cytogenetic_location.toString())
                                    : ""
                            } `}
                        />
                    </UnpaddedListItem>
                    {record.attributes.has_genetic_evidence_for_ad_risk && (
                        <UnpaddedListItem>
                            <BaseTextSmall>
                                Genetic Evidence for AD?&nbsp;
                                {resolveJsonInput(record.attributes.has_genetic_evidence_for_ad_risk_display.toString())}
                            </BaseTextSmall>
                        </UnpaddedListItem>
                    )}
                </List>
            </Grid>
            <Grid item container xs={9}>
                {record.attributes.gws_variants_summary_plot && (
                    <SummaryPlotHeader
                        labelText={`Summary of AD/ADRD associations for this variants proximal to ${record.attributes.gene_symbol}`}
                        linkTarget="#ad_variants_from_gwas"
                    />
                )}
                {record.attributes.gws_variants_summary_plot && (
                    <HighchartsTableTrellis
                        data={JSON.parse(record.attributes.gws_variants_summary_plot.toString())}
                        properties={JSON.parse(getAttributeChartProperties(recordClass, "gws_variants_summary_plot"))}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default GeneRecordSummary;
