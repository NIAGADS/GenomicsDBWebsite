import React from "react";

import { withStyles } from "@material-ui/core";
import Box, { BoxProps } from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const SparkPercentageBarAccessor: React.FC<ColumnAccessor> = ({ value }) => {
    
    return value ? (
        <Grid container wrap="nowrap">
            <Grid item>{value.value}&nbsp;</Grid>
            <Box clone maxWidth="100px" maxHeight="1.4em">
                <Grid item container wrap="nowrap">
                    <SparkBar type="filled" width={value.percentage} />
                    <SparkBar type="remaining" width={100 - value.percentage} />
                </Grid>
            </Box>
        </Grid>
    ) : null;
};

interface SparkBarProps extends BoxProps {
    type: "filled" | "remaining";
    width: number;
}

const SparkBar = withStyles((theme) => ({
    root: {
        height: "100%",
        backgroundColor: (props: SparkBarProps) =>
            props.type === "filled" ? theme.palette.secondary.main : theme.palette.primary.light,
    },
}))(({ width, type, ...rest }: SparkBarProps) => <Box {...rest} flexBasis={`${width}%`} />);
