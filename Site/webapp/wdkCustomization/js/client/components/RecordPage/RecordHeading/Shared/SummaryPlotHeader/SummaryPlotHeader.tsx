import { Box } from "@material-ui/core";
import React from "react";
import { BaseText, PrimaryExternalLink } from "../../../../MaterialUI";

interface SummaryPlotHeader {
    labelText: string;
    linkTarget: string;
}

const SummaryPlotHeader: React.FC<SummaryPlotHeader> = ({ labelText, linkTarget }) => (
    <Box marginTop="45px">
        <BaseText variant="body2">
            {labelText} &nbsp;&nbsp;&nbsp;
            <PrimaryExternalLink href={linkTarget}>
                Browse the association evidence <i className="fa fa-level-down"></i>
            </PrimaryExternalLink>
        </BaseText>
    </Box>
);

export default SummaryPlotHeader;
