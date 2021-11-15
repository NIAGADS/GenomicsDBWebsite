import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { RecordHeading } from "../Types";
import { useHeadingStyles } from "../RecordHeading";
import { CustomPanel } from "@components/MaterialUI";
import { _externalUrls } from "genomics-client/data/_externalUrls";


// import "./DatasetRecordHeading.scss";


const DatasetRecordSummary: React.FC<RecordHeading> = (props) => {
    const classes = useHeadingStyles();
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
                    <Typography>{record.attributes.description}</Typography>
                </Grid>
            </Grid>
        </CustomPanel>
    );
};

export default DatasetRecordSummary;
