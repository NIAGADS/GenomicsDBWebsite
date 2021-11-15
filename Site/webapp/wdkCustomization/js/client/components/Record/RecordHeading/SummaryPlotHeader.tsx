import { Box, Typography } from "@material-ui/core";
import React from "react";
import { PrimaryExternalLink } from "@components/MaterialUI";

interface SummaryPlotHeader {
    text: string;
    anchor: string;
}

export const SummaryPlotHeader: React.FC<SummaryPlotHeader> = ({ text, anchor }) => (
    <Box>
        <Typography variant="h6">{text}</Typography>
        <PrimaryExternalLink href={anchor}>
            Browse the association evidence <i className="fa fa-level-down"></i>
        </PrimaryExternalLink>
    </Box>
);

