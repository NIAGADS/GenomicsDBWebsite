import { Box, BoxProps, Grid, withStyles } from "@material-ui/core";
import React from "react";

interface CssBarChart {
    pctFull: number;
    original: any;
}

const CssBarChart: React.FC<CssBarChart> = ({ original, pctFull }) => {
    return (
        <Grid container wrap="nowrap">
            <Grid item>{original}&nbsp;</Grid>
            <Box clone maxWidth="150px" maxHeight="1.4em">
                <Grid item container wrap="nowrap">
                    <IndicatorPart type="filled" width={pctFull} />
                    <IndicatorPart type="remaining" width={100 - pctFull} />
                </Grid>
            </Box>
        </Grid>
    );
};

interface IndicatorPartProps extends BoxProps {
    type: "filled" | "remaining";
    width: number;
}

const IndicatorPart = withStyles((theme) => ({
    root: {
        height: "100%",
        backgroundColor: (props: IndicatorPartProps) =>
            props.type === "filled" ? theme.palette.secondary.main : theme.palette.primary.main,
    },
}))(({ width, type, ...rest }: IndicatorPartProps) => <Box {...rest} flexBasis={`${width}%`} />);

export default CssBarChart;
