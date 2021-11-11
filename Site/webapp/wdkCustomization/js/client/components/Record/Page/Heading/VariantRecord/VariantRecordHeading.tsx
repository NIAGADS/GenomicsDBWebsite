import React from "react";
import { connect } from "react-redux";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { Box, Grid, List, Typography } from "@material-ui/core";
import { Check, ReportProblemOutlined } from "@material-ui/icons";

import { MostSevereConsequencesSection } from "./Components/index";
import { HeaderRecordActions, RecordAttributeItem, SummaryPlotHeader } from "../Shared";

import { getAttributeChartProperties } from "../Shared/HeaderRecordActions/HeaderRecordActions";
import { HighchartsTableTrellis } from "../../../../Visualizations/Highcharts/HighchartsTrellisPlot";

import { resolveJsonInput, isJson } from "../../../../../util/jsonParse";
import { RecordHeading, RecordAttributes } from "../RecordHeadingTypes";

import { Subheading, SubheadingSmall, SmallBadge, BaseTextSmall, CustomPanel } from "../../../../MaterialUI";

import { VariantRecordAttributesList as AttributeList } from "./VariantRecordAttributes";

import { _externalUrls } from "../../../../../data/_externalUrls";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: "10px",
            paddingLeft: "50px",
        },
    })
);

const VariantRecordSummary: React.FC<RecordHeading> = (props) => {
    const classes = useStyles();
    const { record, headerActions, recordClass } = props,
        { attributes } = record;

    return (
        <CustomPanel hasBaseArrow={false} className={classes.panel} alignItems="flex-start">
            <Grid item container direction="column" sm={3}>
                <Grid item>
                    <Typography variant="h5">
                        <strong>
                            {isJson(attributes.display_metaseq_id)
                                ? resolveJsonInput(attributes.display_metaseq_id.toString())
                                : attributes.display_metaseq_id}
                        </strong>
                    </Typography>
                </Grid>
                <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                <Grid item>
                    <AttributeList record={record} />
                </Grid>
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
                        data={JSON.parse(record.attributes.gws_datasets_summary_plot.toString())}
                        properties={JSON.parse(getAttributeChartProperties(recordClass, "gws_datasets_summary_plot"))}
                    />
                )}
            </Grid>
        </CustomPanel>

        /* <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
                
                

                <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
                  
                </Box>
                {(attributes.alternative_variants || attributes.colocated_variants) && (
                    <Box paddingBottom={1} borderBottom="1px solid">
                        {attributes.alternative_variants && (
                            <AlternativeVariants altVars={attributes.alternative_variants.toString()} />
                        )}
                        {attributes.colocated_variants && (
                            <ColocatedVariants
                                position={attributes.position.toString()}
                                chromosome={attributes.chromosome.toString()}
                                colVars={attributes.colocated_variants.toString()}
                            />
                        )}
                    </Box>
                        )} 
            </Grid>
           
                </Grid> */
    );
};

/* const LinkList: React.FC<{ list: string[] }> = ({ list }) => (
    <List disablePadding={true}>
        {list.map((item, i) => (
            <UnpaddedListItem key={i}>{resolveJsonInput(item)}</UnpaddedListItem>
        ))}
    </List>
);*/

export default VariantRecordSummary;
