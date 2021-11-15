import React from "react";

import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { ImpactIndicator, RecordAttributeItem } from "../RecordHeading";

import { withTooltip, UnpaddedListItem as ListItem } from "@components/MaterialUI";
import { useTypographyStyles } from "@components/MaterialUI/styles";

import { resolveJsonInput } from "genomics-client/util/jsonParse";
import { _externalUrls } from "genomics-client/data/_externalUrls";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        chipRoot: {
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            "& > *": {
                margin: theme.spacing(0.5),
            },
        },
    })
);

export const VariantRecordAttributesList: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const { attributes } = record;
    const classes = useTypographyStyles();
    return (
        <List>
            <ListItem>
                <RecordAttributeItem label="Allele" attribute={attributes.display_allele.toString()} />
            </ListItem>

            <ListItem>
                <Typography className={classes.small}>{attributes.variant_class}</Typography>
            </ListItem>
            {attributes.location && (
                <ListItem>
                    <RecordAttributeItem label="Location:" attribute={attributes.location.toString()} />
                </ListItem>
            )}

            <ListItem>
                <Typography>
                    Has this variant been flagged by the ADSP?{"   "}
                    {attributes.is_adsp_variant ? (
                        <strong>
                            <CheckIcon className={classes.pass} />
                            &nbsp;Yes
                        </strong>
                    ) : (
                        <strong>No</strong>
                    )}
                </Typography>
            </ListItem>
            <ListItem>
                <ADSPQCDisplay record={record} />
            </ListItem>
            {attributes.most_severe_consequence && <MostSevereConsequencesSection record={record} />}
        </List>
    );
};

const MostSevereConsequencesSection: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const attributes = record.attributes;
    // const typographyStyles = useTypographyStyles();
    return (
        <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
            <List disablePadding={true}>
                <ListItem>
                    <Typography variant="caption">
                        <strong>Consequence:</strong>&nbsp;
                        {attributes.most_severe_consequence}&nbsp;
                        {attributes.msc_is_coding && resolveJsonInput(attributes.msc_is_coding.toString())}
                    </Typography>
                </ListItem>
                {attributes.msc_impact && (
                    <ListItem>
                        <Typography variant="caption">
                            <strong>Impact:</strong>&nbsp;
                            <ImpactIndicator impact={attributes.msc_impact.toString()} />
                        </Typography>
                    </ListItem>
                )}
            </List>
            <Box marginLeft={1}>
                <List disablePadding={true}>
                    {attributes.msc_amino_acid_change && (
                        <ListItem>
                            <Typography variant="caption">
                                Amino Acid Change:&nbsp;
                                {attributes.msc_amino_acid_change}
                            </Typography>
                        </ListItem>
                    )}
                    {attributes.msc_codon_change && (
                        <ListItem>
                            <Typography variant="caption">
                                Codon Change:&nbsp;
                                {attributes.msc_codon_change}
                            </Typography>
                        </ListItem>
                    )}

                    {attributes.msc_impacted_gene_link && (
                        <ListItem>
                            <Typography variant="caption">
                                Impacted Gene:&nbsp;
                                {resolveJsonInput(attributes.msc_impacted_gene_link.toString())}
                            </Typography>
                        </ListItem>
                    )}
                    {attributes.msc_impacted_transcript && (
                        <ListItem>
                            <Typography variant="caption">
                                Impacted Transcript:&nbsp;
                                {resolveJsonInput(attributes.msc_impacted_transcript.toString())}
                            </Typography>
                        </ListItem>
                    )}
                </List>
            </Box>
        </Box>
    );
};

export const ADSPQCDisplay: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const { attributes } = record;
    const hasFilterStatus = attributes.adsp_wgs_qc_filter_status && attributes.adsp_wes_qc_filter_status;
    const classes = useStyles();

    return hasFilterStatus ? (
        <div className={classes.chipRoot}>
            {attributes.adsp_wes_qc_filter_status && (
                <FilterStatusChip
                    label="WES"
                    status={attributes.adsp_wes_qc_filter_status}
                    didPass={attributes.is_adsp_wes}
                ></FilterStatusChip>
            )}
            {attributes.adsp_wgs_qc_filter_status && (
                <FilterStatusChip
                    label="WGS"
                    status={attributes.adsp_wgs_qc_filter_status}
                    didPass={attributes.is_adsp_wgs}
                ></FilterStatusChip>
            )}
        </div>
    ) : null;
};

const FilterStatusChip: React.FC<any> = ({ label, status, didPass }) => {
    const classes = useTypographyStyles();
    return (
        <>
            {didPass ? (
                <Typography>
                    {label}
                    {": "}
                    {withTooltip(
                        <Typography component="span" className={`${classes.pass} ${classes.withTooltip}`}>
                            PASS
                        </Typography>,
                        status.toString()
                    )}
                </Typography>
            ) : (
                <Typography>
                    {label}
                    {": "}
                    {withTooltip(
                        <Typography component="span" className={`${classes.fail} ${classes.withTooltip}`}>
                            FAIL
                        </Typography>,
                        status.toString()
                    )}
                </Typography>
            )}
        </>
    );
};

/*  export const AlternativeVariants: React.FC<{ altVars: string }> = ({ altVars }) => (
        <div>
            <ReportProblemOutlined fontSize="small" /> This variant is&nbsp;
            <Tooltip content={"Use the links below to view annotations for additional alt alleles"}>
                <span className="wdk-tooltip">multi-allelic:</span>
            </Tooltip>
            <LinkList list={JSON.parse(altVars)} />
        </div>
    );
    
    export const ColocatedVariants: React.FC<{ colVars: string; position: string; chromosome: string }> = ({
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
    ); */
