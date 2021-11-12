import { Box, Typography } from "@material-ui/core";
import React from "react";
import { PrimaryExternalLink } from "@components/MaterialUI";

interface SummaryPlotHeader {
    labelText: string;
    linkTarget: string;
}

const SummaryPlotHeader: React.FC<SummaryPlotHeader> = ({ labelText, linkTarget }) => (
    <Box>
        <Typography variant="h6">{labelText}</Typography>
        <PrimaryExternalLink href={linkTarget}>
            Browse the association evidence <i className="fa fa-level-down"></i>
        </PrimaryExternalLink>
    </Box>
);

export default SummaryPlotHeader;
