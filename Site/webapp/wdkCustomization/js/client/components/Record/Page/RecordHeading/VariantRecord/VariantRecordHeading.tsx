import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { HeaderRecordActions, SummaryPlotHeader } from "../Shared";
import { getAttributeChartProperties } from "../Shared/HeaderRecordActions";
import { useHeadingStyles } from "../Shared";
import { RecordHeading } from "../RecordHeadingTypes";
import { VariantRecordAttributesList as AttributeList } from "./VariantRecordAttributes";

import { HighchartsTableTrellis } from "@viz/Highcharts/HighchartsTrellisPlot";

import { CustomPanel, DarkSecondaryExternalLink, withTooltip } from "@components/MaterialUI";
import { useTypographyStyles } from "@components/MaterialUI/styles";

import { resolveJsonInput, isJson } from "genomics-client/util/jsonParse";
import { _externalUrls } from "genomics-client/data/_externalUrls";

const VariantRecordSummary: React.FC<RecordHeading> = (props) => {
    const classes = useHeadingStyles();
    const tClasses = useTypographyStyles();
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
                    {attributes.ref_snp_id && (
                        <Typography>
                            {attributes.ref_snp_id}{" "}
                            {withTooltip(
                                <DarkSecondaryExternalLink href={`${_externalUrls.DBSNP_URL}${attributes.ref_snp_id}`}>
                                    <i className={`${tClasses.small} fa fa-external-link`}></i>
                                </DarkSecondaryExternalLink>,
                                "Explore dbSNP record for this variant"
                            )}
                        </Typography>
                    )}
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
