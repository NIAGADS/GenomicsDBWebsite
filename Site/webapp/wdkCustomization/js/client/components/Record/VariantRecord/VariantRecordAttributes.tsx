import React from "react";

import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import { RecordInstance } from "wdk-client/Utils/WdkModel";

import { RecordAttributeItem, useHeadingStyles } from "../RecordHeading";
import { MostSevereConsequenceSection } from "./VariantHeaderSections";

import { withTooltip, UnpaddedListItem as ListItem } from "@components/MaterialUI";
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
                <Typography className={classes.small}>
                    <em>Has this variant been flagged by the ADSP?&nbsp;&nbsp;</em>
                    {attributes.is_adsp_variant ? (
                        <strong>
                            Yes <CheckIcon className={classes.pass} />
                        </strong>
                    ) : (
                        <strong>No</strong>
                    )}
                </Typography>
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
