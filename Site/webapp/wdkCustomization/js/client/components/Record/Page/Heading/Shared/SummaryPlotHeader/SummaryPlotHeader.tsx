import { Box, Typography } from "@material-ui/core";
import React from "react";
import { PrimaryExternalLink } from "../../../../../MaterialUI";

interface SummaryPlotHeader {
    labelText: string;
    linkTarget: string;
}

const SummaryPlotHeader: React.FC<SummaryPlotHeader> = ({ labelText, linkTarget }) => (
    <Box marginTop="45px">
        <Typography variant="h5">{labelText}</Typography>
        <PrimaryExternalLink href={linkTarget}>
            Browse the association evidence <i className="fa fa-level-down"></i>
        </PrimaryExternalLink>
    </Box>
);

export default SummaryPlotHeader;
