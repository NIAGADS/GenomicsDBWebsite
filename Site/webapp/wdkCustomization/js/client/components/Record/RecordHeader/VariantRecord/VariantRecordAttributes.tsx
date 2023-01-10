import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { LabeledAttributeItem as RecordAttributeItem } from "@components/Record/Attributes";
import { MostSevereConsequenceSection } from "./VariantHeaderSections";

import { StyledTooltip as Tooltip, WhiteTooltip, UnpaddedListItem as ListItem, WarningAlert } from "@components/MaterialUI";
import { useTypographyStyles } from "@components/MaterialUI/styles";

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
                <Typography className={classes.small}>
                    <strong>
                        <em>{attributes.variant_class_abbrev}</em>
                    </strong>{" "}
                    {attributes.variant_class}
                </Typography>
            </ListItem>

            <ListItem>
                <Box pb={1}>
                    <RecordAttributeItem
                        small={true}
                        label="Alleles"
                        attribute={attributes.display_allele.toString()}
                    />
                </Box>
            </ListItem>

            <ListItem>
                <ADSPStatusDisplay isAdspVariant={attributes.is_adsp_variant} callFlags={attributes.adsp_qc_flags} />
            </ListItem>

            <ListItem>
                <ADSPQCDisplay record={record} />
            </ListItem>
            {attributes.most_severe_consequence && (
                <ListItem>
                    <MostSevereConsequenceSection record={record} />
                </ListItem>
            )}
        </List>
    );
};

const ADSPStatusDisplay: React.FC<{ isAdspVariant: any; callFlags: any }> = ({ isAdspVariant, callFlags }) => {
    // temp solution --> since currently only 1 ADSP release; later need to adapt to give a badge for each
    const calls = callFlags ? JSON.parse(callFlags.toString()) : null;
    const passed = calls ? Boolean(calls[Object.keys(calls)[0]]) : false;
    return Boolean(isAdspVariant ? isAdspVariant.toString() : isAdspVariant) ? (
        <WhiteTooltip
            arrow
            title={
                <>
                    <Typography variant="caption">
                        This variant was present in ADSP samples and <strong className="red">PASSED</strong> the ADSP quality control checks.
                    </Typography>
                    <WarningAlert
                        title="This is not an indicator of AD-risk association."
                        message="Please review summary statistics results to evaluate disease risk-associations."
                    />
                </>
            }
        >
            <Chip color="secondary" icon={<InfoIcon />} label="ADSP Variant" />
        </WhiteTooltip>
    ) : passed ? (
        <WhiteTooltip
            arrow
            title={
                <>
                    <Typography variant="caption">
                        This variant was present in ADSP samples and but did <strong className="red">NOT</strong> pass the ADSP quality control checks.
                    </Typography>
                    <WarningAlert
                        title="This is not an indicator of a lack of AD-risk association."
                        message="Please review summary statistics results to evaluate disease risk-associations."
                    />
                </>
            }
        >
            <Chip color="secondary" icon={<InfoIcon />} label="variant flagged by the ADSP" />
        </WhiteTooltip>
    ) : null;
};

const FilterStatusChip: React.FC<any> = ({ label, status, didPass }) => {
    const classes = useTypographyStyles();
    return (
        <>
            {didPass ? (
                <Typography className={classes.small}>
                    {label}
                    {": "}
                    <Tooltip title={status.toString()} aria-label={status.toString()}>
                        <Typography
                            component="span"
                            className={`${classes.small} ${classes.pass} ${classes.withTooltip}`}
                        >
                            PASS
                        </Typography>
                    </Tooltip>
                </Typography>
            ) : (
                <Typography className={classes.small}>
                    {label}
                    {": "}
                    <Tooltip title={status.toString()} aria-label={status.toString()}>
                        <Typography
                            component="span"
                            className={`${classes.small} ${classes.fail} ${classes.withTooltip}`}
                        >
                            FAIL
                        </Typography>
                    </Tooltip>
                </Typography>
            )}
        </>
    );
};

export const ADSPQCDisplay: React.FC<{ record: RecordInstance }> = ({ record }) => {
    const { attributes } = record;
    const hasFilterStatus = attributes.adsp_wgs_qc_filter_status || attributes.adsp_wes_qc_filter_status;
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
