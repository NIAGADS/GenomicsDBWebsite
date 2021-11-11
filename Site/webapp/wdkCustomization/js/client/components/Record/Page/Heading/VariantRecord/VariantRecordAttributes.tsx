import React from "react";
import { List, Typography, Box } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { resolveJsonInput } from "../../../../../util/jsonParse";
import {
    BaseText,
    BaseTextSmall,
    UnpaddedListItem,
    DarkSecondaryExternalLink,
    withTooltip
} from "../../../../MaterialUI";
import { ImpactIndicator, RecordAttributeItem } from "../Shared";
import { _externalUrls } from "../../../../../data/_externalUrls";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pass: {
            borderColor: "red",
            color: "red",
        },
        passText: {
            color: "red",
        },
        failText: {
            color: theme.palette.primary.main,
        },
        fail: {
            borderColor: theme.palette.primary.main,
            backgroundColor: "white",
        },  
        small: {
            fontSize: "0.8rem",
        },
        textWithTooltip: {
            borderBottom: "1px dashed",
            borderBottomColor: theme.palette.secondary.dark,
        },
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
    const classes = useStyles();
    return (
        <List>
            {attributes.ref_snp_id && (
                <UnpaddedListItem>
                    <BaseText>
                        {attributes.ref_snp_id}{" "}
                        {withTooltip(
                            <DarkSecondaryExternalLink href={`${_externalUrls.DBSNP_URL}${attributes.ref_snp_id}`}>
                                <i className={`${classes.small} fa fa-external-link`}></i>
                            </DarkSecondaryExternalLink>,
                            "Explore dbSNP record for this variant"
                        )}
                    </BaseText>
                </UnpaddedListItem>
            )}
            <UnpaddedListItem>
                <RecordAttributeItem label="Allele:" attribute={attributes.display_allele.toString()} />
            </UnpaddedListItem>

            <UnpaddedListItem>
                <BaseTextSmall>{attributes.variant_class}</BaseTextSmall>
            </UnpaddedListItem>
            {attributes.location && (
                <UnpaddedListItem>
                    <RecordAttributeItem label="Location:" attribute={attributes.location.toString()} />
                </UnpaddedListItem>
            )}

            <UnpaddedListItem>
                <BaseText>
                    Has this variant been flagged by the ADSP?{"   "}
                    {attributes.is_adsp_variant ? (
                        <strong>
                            <CheckIcon className={classes.passText} />
                            &nbsp;Yes
                        </strong>
                    ) : (
                        <strong>No</strong>
                    )}
                </BaseText>
            </UnpaddedListItem>
            <UnpaddedListItem>
                <ADSPQCDisplay record={record} />
            </UnpaddedListItem>
            {attributes.most_severe_consequence && <MostSevereConsequencesSection record={record} />}
        </List>
    );
};

const MostSevereConsequencesSection: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const attributes = record.attributes;
    return (
        <Box paddingTop={1} paddingBottom={1} borderBottom="1px solid">
            <List disablePadding={true}>
                <UnpaddedListItem>
                    <BaseTextSmall variant="caption">
                        <strong>Consequence:</strong>&nbsp;
                        {attributes.most_severe_consequence}&nbsp;
                        {attributes.msc_is_coding && resolveJsonInput(attributes.msc_is_coding.toString())}
                    </BaseTextSmall>
                </UnpaddedListItem>
                {attributes.msc_impact && (
                    <UnpaddedListItem>
                        <BaseTextSmall variant="caption">
                            <strong>Impact:</strong>&nbsp;
                            <ImpactIndicator impact={attributes.msc_impact.toString()} />
                        </BaseTextSmall>
                    </UnpaddedListItem>
                )}
            </List>
            <Box marginLeft={1}>
                <List disablePadding={true}>
                    {attributes.msc_amino_acid_change && (
                        <UnpaddedListItem>
                            <BaseTextSmall variant="caption">
                                Amino Acid Change:&nbsp;
                                {attributes.msc_amino_acid_change}
                            </BaseTextSmall>
                        </UnpaddedListItem>
                    )}
                    {attributes.msc_codon_change && (
                        <UnpaddedListItem>
                            <BaseTextSmall variant="caption">
                                Codon Change:&nbsp;
                                {attributes.msc_codon_change}
                            </BaseTextSmall>
                        </UnpaddedListItem>
                    )}

                    {attributes.msc_impacted_gene_link && (
                        <UnpaddedListItem>
                            <BaseTextSmall variant="caption">
                                Impacted Gene:&nbsp;
                                {resolveJsonInput(attributes.msc_impacted_gene_link.toString())}
                            </BaseTextSmall>
                        </UnpaddedListItem>
                    )}
                    {attributes.msc_impacted_transcript && (
                        <UnpaddedListItem>
                            <BaseTextSmall variant="caption">
                                Impacted Transcript:&nbsp;
                                {resolveJsonInput(attributes.msc_impacted_transcript.toString())}
                            </BaseTextSmall>
                        </UnpaddedListItem>
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
    const classes = useStyles();
    return (
        <>
            {didPass ? (
                <Typography>
                    {label}
                    {": "}
                    {withTooltip(
                        <Typography component="span" className={`${classes.passText} ${classes.textWithTooltip}`}>
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
                        <Typography component="span" className={`${classes.failText} ${classes.textWithTooltip}`}>
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
