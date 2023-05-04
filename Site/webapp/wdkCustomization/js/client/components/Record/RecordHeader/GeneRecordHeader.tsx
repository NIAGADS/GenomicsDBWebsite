import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { HighchartsColumnTrellis } from "@components/Visualizations";
import { useTypographyStyles, StyledTooltip as Tooltip, CustomLink as Link } from "@components/MaterialUI";
import { RecordHeader, SummaryPlotHeader, AboutThisPageDialog } from "@components/Record/RecordHeader";
import { RecordHeading } from "@components/Record/Types";
import { GeneAttributeList as AttributeList } from "@components/Record/Attributes";

import { _externalUrls } from "genomics-client/data/_externalUrls";

const GeneRecordHeader: React.FC<RecordHeading> = ({ record, recordClass, categoryTree, headerActions }) => {
    const { displayName, attributes } = record;
    const tClasses = useTypographyStyles();
    const linkOutRef = React.createRef();

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
                    <Link ref={linkOutRef} href={`${_externalUrls.ENSEMBL_GENE_URL}${attributes.source_id}`}>
                        <i className={`${tClasses.small} fa fa-external-link`}></i>
                    </Link>
                </Tooltip>
            </Typography>
        </Box>
    );

    const renderSummary = <AttributeList record={record} />;

    const renderPlotHelp = (
        <Box>
            <Typography variant="caption">
                Counts of (distinct) variants contained within &plusmn;100kb of this gene that have been identified in a
                NIAGADS GWAS summary statistics dataset for Alzheimer's disease or an AD-related
                dementia/neuropathology.
            </Typography>
        </Box>
    );

    const renderImage = attributes.gws_variants_summary_plot ? (
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
    ) : null;

    return (
        <RecordHeader
            categoryTree={categoryTree}
            recordClass={recordClass}
            title={renderTitle}
            summary={renderSummary}
            image={renderImage}
        />
    );
};

export default GeneRecordHeader;
