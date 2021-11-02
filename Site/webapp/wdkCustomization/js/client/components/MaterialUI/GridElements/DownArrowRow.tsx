import React from "react";
import { Grid, Box } from "@material-ui/core";
import DownArrow from "@material-ui/icons/ArrowDropDown";
import { theme } from "..";

interface DownArrowRowProps {
    paddingTop?: number;
    color?: string;
}

export const DownArrowRow: React.FC<DownArrowRowProps> = ({ paddingTop = 4, color = "secondary" }) => {
    return (
        <Grid direction="row" container item xs={12} justifyContent="center">
            <Box paddingTop={paddingTop}>
                <DownArrow style={{ fontSize: 65 }} color={color === "secondary" ? "secondary" : "primary"} />
            </Box>
        </Grid>
    );
};
