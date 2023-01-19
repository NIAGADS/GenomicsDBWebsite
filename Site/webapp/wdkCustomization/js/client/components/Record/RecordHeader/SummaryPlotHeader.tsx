import React from "react";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { HelpIcon } from "wdk-client/Components";

interface SummaryPlotHeader {
    text: string;
    anchor: string;
    help:React.ReactElement;
}

export const SummaryPlotHeader: React.FC<SummaryPlotHeader> = ({ text, anchor, help }) => (
    <Box pt={2}>
        <Typography variant="h6">
            {text}
            <HelpIcon>
               {help}
            </HelpIcon>
        </Typography>
        <Link color="initial" href={anchor}>
            Browse the association evidence <i className="fa fa-level-down"></i>
        </Link>
    </Box>
);
