import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import { SummaryPlotHeader } from "@components/Record/RecordHeading/SummaryPlotHeader";
import { useHeadingStyles } from "@components/Record/RecordHeading/styles";
import { RecordHeading } from "@components/Record/Types";

import { VariantRecordAttributesList as AttributeList } from "./VariantRecordAttributes";
import { AlternativeVariantsSection, ColocatedVariantsSection } from "./VariantHeaderSections";

import { HighchartsTableTrellis } from "@viz/Highcharts/HighchartsTrellisPlot";

import { MetaseqIdAttribute } from "@components/Record/Attributes";
import { CustomPanel, useTypographyStyles, StyledTooltip as Tooltip } from "@components/MaterialUI";

import { _externalUrls } from "genomics-client/data/_externalUrls";

const VariantRecordSummary: React.FC<RecordHeading> = (props) => {
    const classes = useHeadingStyles();
    const tClasses = useTypographyStyles();
    const { record, headerActions, recordClass } = props,
        { attributes } = record;

    const hasRelatedVariants = record.attributes.alternative_variants || record.attributes.colocated_variants;

    return (
        <CustomPanel
            hasBaseArrow={false}
            className={classes.panel}
            alignItems="flex-start"
            justifyContent="space-between"
        >
            <Grid item container direction="column" sm={3}>
                <Grid item>
                    <Typography variant="h5">
                        <MetaseqIdAttribute value={attributes.metaseq_id.toString()} />
                    </Typography>
                    {attributes.ref_snp_id && (
                        <Typography>
                            {attributes.ref_snp_id}{" "}
                            <Tooltip
                                title="Explore dbSNP record for this variant"
                                aria-label="Explore dbSNP record for this variant"
                            >
                                <Link href={`${_externalUrls.DBSNP_URL}${attributes.ref_snp_id}`}>
                                    <i className={`${tClasses.small} fa fa-external-link`}></i>
                                </Link>
                            </Tooltip>
                        </Typography>
                    )}
                </Grid>
                <Grid item>
                    <AttributeList record={record} />
                </Grid>
            </Grid>

            {record.attributes.gws_datasets_summary_plot && (
                <Grid item container xs={9} sm={6}>
                    <Box>
                        <SummaryPlotHeader
                            text="Summary of AD/ADRD associations for this variant:"
                            anchor="#category:phenomics"
                        />
                        <HighchartsTableTrellis
                            data={JSON.parse(record.attributes.gws_datasets_summary_plot.toString())}
                            properties={{ type: "variant_gws_summary" }}
                        />
                    </Box>
                </Grid>
            )}
            {hasRelatedVariants && (
                <Grid item>
                    {record.attributes.alternative_variants && (
                        <AlternativeVariantsSection variants={record.attributes.alternative_variants.toString()} />
                    )}
                    {record.attributes.colocated_variants && (
                        <ColocatedVariantsSection
                            variants={record.attributes.colocated_variants.toString()}
                            position={record.attributes.position.toString()}
                            chromosome={record.attributes.chromosome.toString()}
                        />
                    )}
                </Grid>
            )}
        </CustomPanel>
    );
};

export default VariantRecordSummary;
