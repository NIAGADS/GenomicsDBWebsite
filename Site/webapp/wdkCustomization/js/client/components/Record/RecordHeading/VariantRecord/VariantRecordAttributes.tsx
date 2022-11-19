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

import { withTooltip, HtmlTooltip, UnpaddedListItem as ListItem } from "@components/MaterialUI";
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
                <ADSPStatusDisplay is_adsp_variant={attributes.is_adsp_variant} />
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

const ADSPStatusDisplay: React.FC<any> = ({ is_adsp_variant }) => {
    return is_adsp_variant ? (
        <HtmlTooltip
            arrow
            title={
                <>
                    <Typography variant="caption">
                        This variant was present in ADSP samples and PASSED the ADSP quality control checks.
                    </Typography>
                    <br/>
                    <Typography variant="caption" className="red">
                        <WarningIcon fontSize="small"/> This is not an indicator of AD-risk association. Please view summary statistics
                        results or ADSP Case/Control single-variant results to make that determination.
                    </Typography>
                </>
            }
        >
            <Chip color="secondary" icon={<InfoIcon />} label="ADSP Variant" />
        </HtmlTooltip>
    ) : (
        <HtmlTooltip
            arrow
            title={
                <>
                    <Typography variant="caption">
                        This variant was present in ADSP samples and but did NOT pass the ADSP quality control checks.
                    </Typography>
                    <Typography variant="caption" className="red">
                        <WarningIcon/> This is not an indicator of AD-risk association. Please view summary statistics
                        results or ADSP Case/Control single-variant results to make that determination.
                    </Typography>
                </>
            }
        >
            <Chip color="secondary" icon={<InfoIcon />} label="variant flagged by the ADSP" />
        </HtmlTooltip>
    );
};

const FilterStatusChip: React.FC<any> = ({ label, status, didPass }) => {
    const classes = useTypographyStyles();
    return (
        <>
            {didPass ? (
                <Typography className={classes.small}>
                    {label}
                    {": "}
                    {withTooltip(
                        <Typography
                            component="span"
                            className={`${classes.small} ${classes.pass} ${classes.withTooltip}`}
                        >
                            PASS
                        </Typography>,
                        status.toString()
                    )}
                </Typography>
            ) : (
                <Typography className={classes.small}>
                    {label}
                    {": "}
                    {withTooltip(
                        <Typography
                            component="span"
                            className={`${classes.small} ${classes.fail} ${classes.withTooltip}`}
                        >
                            FAIL
                        </Typography>,
                        status.toString()
                    )}
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
