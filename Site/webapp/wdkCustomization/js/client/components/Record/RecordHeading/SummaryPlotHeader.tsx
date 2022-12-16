import { Box, Typography } from "@material-ui/core";
import React from "react";
import { CustomLink as Link} from "@components/MaterialUI"

interface SummaryPlotHeader {
    text: string;
    anchor: string;
}

export const SummaryPlotHeader: React.FC<SummaryPlotHeader> = ({ text, anchor }) => (
    <Box>
        <Typography variant="h6">{text}</Typography>
        <Link color="initial" href={anchor}>
            Browse the association evidence <i className="fa fa-level-down"></i>
        </Link>
    </Box>
);

