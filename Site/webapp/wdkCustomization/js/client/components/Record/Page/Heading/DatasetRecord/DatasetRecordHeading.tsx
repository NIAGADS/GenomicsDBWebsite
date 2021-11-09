import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";

import { RecordHeading } from "../RecordHeadingTypes";
import { BaseText, BaseTextSmall, CustomPanel, DarkSecondaryExternalLink, withTooltip } from "../../../../MaterialUI";
import { _externalUrls } from "../../../../../data/_externalUrls";
import "./DatasetRecordHeading.scss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: "10px",
            paddingLeft: "50px",
        },
        infoBlock: {
            borderColor: theme.palette.info.main,
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "12px",
        },
        infoText: {
            color: theme.palette.info.dark,
            fontSize: "0.9rem",
        },
    })
);

const DatasetRecordSummary: React.FC<RecordHeading> = (props) => {
    const classes = useStyles();
    const { record, headerActions, recordClass } = props,
        { attributes } = record;

    return (
        <CustomPanel hasBaseArrow={false} className={classes.panel} alignItems="flex-start">
            <Grid item container direction="column" justifyContent="flex-start">
                <Grid item>
                    <Typography variant="h5">
                        <strong>{record.attributes.name}</strong>
                    </Typography>
                </Grid>
                <Grid item>
                    <BaseText>{record.attributes.description}</BaseText>
                </Grid>
            </Grid>
        </CustomPanel>
    );
};

export default DatasetRecordSummary;
