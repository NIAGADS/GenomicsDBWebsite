import React from "react";
import { Grid, Typography } from "@material-ui/core";

import { useHeadingStyles } from "../Shared";
import { HeaderRecordActions, SummaryPlotHeader } from "../Shared";
import { getAttributeChartProperties } from "../Shared/HeaderRecordActions";

import { RecordHeading } from "../RecordHeadingTypes";
import { HighchartsTableTrellis } from "@viz";

import { CustomPanel } from "@components/MaterialUI";

import AttributeList from "./Attributes";


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
                </Grid>
                <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                <Grid item>
                    <AttributeList record={record} />
                </Grid>
            </Grid>

            <Grid item container xs={9}>
                {record.attributes.gws_variants_summary_plot && (
                    <SummaryPlotHeader
                        labelText={`Summary of AD/ADRD associations for variants proximal to ${record.attributes.gene_symbol}`}
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
        </CustomPanel>
    );
};

export default Heading;
