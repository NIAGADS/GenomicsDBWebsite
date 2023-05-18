import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { HighchartsColumnTrellis } from "@components/Visualizations";
import { useTypographyStyles, StyledTooltip as Tooltip, CustomLink as Link } from "@components/MaterialUI";
import { RecordHeader, SummaryPlotHeader, useHeadingStyles } from "@components/Record/RecordHeader";
import { RecordHeading } from "@components/Record/Types";

import { VariantRecordAttributesList as AttributeList } from "./VariantRecordAttributes";
import { AlternativeVariantsSection, ColocatedVariantsSection } from "./VariantHeaderSections";
import { MetaseqIdAttribute } from "@components/Record/Attributes";

import { _externalUrls } from "genomics-client/data/_externalUrls";

const VariantRecordHeader: React.FC<RecordHeading> = (props) => {
    const tClasses = useTypographyStyles();
    const { record, headerActions, recordClass } = props,
        { attributes } = record;

    const hasRelatedVariants = attributes.alternative_variants || attributes.colocated_variants;

    const renderTitle = (
        <Box pb={1}>
            <Typography variant="h5">
                <MetaseqIdAttribute value={attributes.metaseq_id.toString()} />
            </Typography>
            {attributes.ref_snp_id && (
                <Typography variant="caption">
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
        </Box>
    );

    const renderSummary = hasRelatedVariants ? (
        <Grid container justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Grid item xs={6}>
                <AttributeList record={record} />
            </Grid>
            {attributes.alternative_variants && (
                <Grid item xs={3}>
                    <AlternativeVariantsSection variants={attributes.alternative_variants.toString()} />
                </Grid>
            )}
            {attributes.colocated_variants && (
                <Grid item xs={3}>
                    <ColocatedVariantsSection
                        variants={attributes.colocated_variants.toString()}
                        span={attributes.span.toString()}
                    />
                </Grid>
            )}
        </Grid>
    ) : (
        <AttributeList record={record} />
    );

    const renderPlotHelp = (
        <Box>
            <Typography variant="caption">
                Counts of the number of NIAGADS GWAS summary statistics datasets in which this variant has been found to
                have a significant risk-assocation.
            </Typography>
        </Box>
    );

    const renderImage = attributes.gws_datasets_summary_plot ? (
        <Box>
            <SummaryPlotHeader
                text={`Overview of significant AD/ADRD associations for this variant:`}
                anchor="#ad_associations_from_gwas"
                help={renderPlotHelp}
            />
            <HighchartsColumnTrellis
                data={JSON.parse(attributes.gws_datasets_summary_plot.toString())}
                properties={{ type: "variant_gws_summary" }}
            />
        </Box>
    ) : null;

    return <RecordHeader categoryTree={props.categoryTree} recordClass={recordClass} title={renderTitle} summary={renderSummary} image={renderImage} />;
};

export default VariantRecordHeader;
