import React from "react";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { HighchartsTableTrellis } from "@components/Visualizations";

import { useTypographyStyles, StyledTooltip as Tooltip, CustomLink as Link } from "@components/MaterialUI";
import { RecordHeader, SummaryPlotHeader } from "genomics-client/components/Record/RecordHeader";
import { RecordHeading } from "@components/Record/Types";
import { GeneAttributeList as AttributeList } from "@components/Record/Attributes";

import { _externalUrls } from "genomics-client/data/_externalUrls";
import { HighchartsColumnTrellis } from "genomics-client/components/Visualizations/Highcharts/HighchartsTrellisPlot";

const GeneRecordHeader: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => {
    const { displayName, attributes } = record;
    const tClasses = useTypographyStyles();
    const renderTitle = (
        <Box pb={1}>
            <Typography variant="h5">
                <strong>
                    {displayName} - <em>{attributes.gene_name}</em>
                </strong>
            </Typography>
            <Typography variant="caption">
                {attributes.source_id}{" "}
                <Tooltip title="Explore Ensembl record for this gene" aria-label="Explore Ensembl record for this gene">
                    <Link href={`${_externalUrls.ENSEMBL_GENE_URL}${attributes.source_id}`}>
                        <i className={`${tClasses.small} fa fa-external-link`}></i>
                    </Link>
                </Tooltip>
            </Typography>
        </Box>
    );

    const renderPlotHelp = (
        <Box>
            <Typography variant="caption">
                Counts of (distinct) variants contained within &plusmn;100kb of this gene that have been identified in a
                NIAGADS GWAS summary statistics dataset for Alzheimer's disease or an AD-related dementia/neuropathology.
            </Typography>
        </Box>
    );

    const renderSummary = <AttributeList record={record} />;

    const renderImage = (
        <Box>
            <SummaryPlotHeader
                text={`Overview of significant AD/ADRD associations for variants proximal to ${attributes.gene_symbol}`}
                anchor="#ad_variants_from_gwas"
                help={renderPlotHelp}
            />
            <HighchartsColumnTrellis
                data={JSON.parse(attributes.gws_variants_summary_plot.toString())}
                properties={{ type: "gene_gws_summary" }}
            />
        </Box>
    );

    return (
        <RecordHeader
            title={renderTitle}
            summary={renderSummary}
            image={attributes.gws_variants_summary_plot ? renderImage : null}
        />
    );
};

export default GeneRecordHeader;

/*

            {record.attributes.gws_variants_summary_plot && (
                <Grid item container xs={9}>
          
                </Grid>
            )} */
