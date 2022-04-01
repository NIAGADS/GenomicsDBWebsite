import { Box, BoxProps, Grid, withStyles } from "@material-ui/core";
import React from "react";

interface CssBarChart {
    percentage: number;
    value: any;
}

const CssBarChart: React.FC<CssBarChart> = ({ value, percentage }) => {
    return (
        <Grid container wrap="nowrap">
            <Grid item>{value}&nbsp;</Grid>
            <Box clone maxWidth="100px" maxHeight="1.4em">
                <Grid item container wrap="nowrap">
                    <SparkBar type="filled" width={percentage} />
                    <SparkBar type="remaining" width={100 - percentage} />
                </Grid>
            </Box>
        </Grid>
    );
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

export default CssBarChart;
