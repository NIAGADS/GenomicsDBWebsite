import React from "react";
import { Grid, GridProps, Box } from "@material-ui/core";
import DownArrow from "@material-ui/icons/ArrowDropDown";

interface DownArrowRowProps {
    padding?: number;
    color?: string;
}

export const NarrowerWidthRow = (props: GridProps) => (
    <Grid {...props} spacing={3} container direction="row" item alignItems="center" justify="center" xs={12} md={11}>
        {props.children}
    </Grid>
);

export const DownArrowRow: React.FC<DownArrowRowProps> = ({ padding = 4, color = "secondary" }) => {
    return (
        <Grid direction="row" container item xs={12} justify="center">
            <Box padding={4} />
            <DownArrow style={{ fontSize: 65 }} color="secondary" />
        </Grid>
    );
};
