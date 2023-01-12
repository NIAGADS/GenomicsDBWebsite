import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { CustomPanel } from "@components/MaterialUI";
import { useHeadingStyles } from "genomics-client/components/Record/RecordHeader";

interface RecordHeader {
    title: React.ReactElement;
    summary: React.ReactElement;
    image?: React.ReactElement;
    actions?: React.ReactElement;
}

export const RecordHeader: React.FC<RecordHeader> = ({ title, summary, image }) => {
    const classes = useHeadingStyles();

    return (
        <CustomPanel hasBaseArrow={false} className={classes.panel} alignItems="flex-start">
            <Grid item container sm={12}>
                {title}
            </Grid>
            <Grid item container sm={12}>
                {summary}
            </Grid>
            {image && (
                <Grid item container sm={12}>
                    {image}
                </Grid>
            )}
        </CustomPanel>
    );
};
