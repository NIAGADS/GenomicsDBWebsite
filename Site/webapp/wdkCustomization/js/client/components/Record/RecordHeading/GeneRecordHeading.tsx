import React from "react";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { HighchartsTableTrellis } from "@components/Visualizations";
import { CustomPanel } from "@components/MaterialUI";

import { SummaryPlotHeader } from "@components/Record/RecordHeading/SummaryPlotHeader";
import { useHeadingStyles } from "@components/Record/RecordHeading/styles";

import { RecordHeading } from "@components/Record/Types";
import { GeneAttributeList as AttributeList } from "@components/Record/Attributes";

const Heading: React.FC<RecordHeading> = ({ record, recordClass, headerActions }) => {
    const classes = useHeadingStyles();
    return (
        <CustomPanel hasBaseArrow={false} className={classes.panel} alignItems="flex-start">
            <Grid item container direction="column" sm={3}>
                <Grid item>
                    <Typography variant="h5">
                        <strong>
                            {record.displayName} - {record.attributes.source_id}
                        </strong>
                    </Typography>
                    <Typography>
                        <em>{record.attributes.gene_name}</em>
                    </Typography>
                </Grid>
                <Grid item>
                    <AttributeList record={record} />
                </Grid>
            </Grid>

            {record.attributes.gws_variants_summary_plot && (
                <Grid item container xs={9}>
                    <Box>
                        <SummaryPlotHeader
                            text={`Summary of AD/ADRD associations for variants proximal to ${record.attributes.gene_symbol}`}
                            anchor="#ad_variants_from_gwas"
                        />
                        <HighchartsTableTrellis
                            data={JSON.parse(record.attributes.gws_variants_summary_plot.toString())}
                            properties={{ type: "gene_gws_summary" }}
                        />
                    </Box>
                </Grid>
            )}
        </CustomPanel>
    );
};

export default Heading;