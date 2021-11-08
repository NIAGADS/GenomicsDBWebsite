import React from "react";
import { Grid, List, Typography, Box, Chip, Avatar } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { resolveJsonInput } from "../../../../../util/jsonParse";
import {
    BaseText,
    BaseTextSmall,
    UnpaddedListItem,
    DarkSecondaryExternalLink,
    withTooltip,
    WhiteExternalLink,
} from "../../../../MaterialUI";
import { RecordAttributeItem } from "../Shared";
import { _externalUrls } from "../../../../../data/_externalUrls";
import { CheckCircleOutline } from "@material-ui/icons";
import AttributeSelector from "wdk-client/Views/Answer/AnswerAttributeSelector";

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
        avatarPass: {
            background: "red",
            color: '"white" !important',
        },
        fail: {
            borderColor: theme.palette.primary.main,
            backgroundColor: "white",
        },
        avatarFail: {
            background: theme.palette.primary.main,
            color: '"white" !important',
        },
        small: {
            fontSize: "0.8rem",
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
        </List>
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
            {didPass
                ? withTooltip(
                      <Chip
                          variant="outlined"
                          className={classes.pass}
                          size="small"
                          avatar={<Avatar className={classes.avatarPass}>P</Avatar>}
                          label={label}
                      />,
                      status.toString()
                  )
                : withTooltip(
                      <Chip
                          variant="outlined"
                          className={classes.fail}
                          size="small"
                          avatar={<Avatar className={classes.avatarFail}>F</Avatar>}
                          label={label}
                      />,
                      status.toString()
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
