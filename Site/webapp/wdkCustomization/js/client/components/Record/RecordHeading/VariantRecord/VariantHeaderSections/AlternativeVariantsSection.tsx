import React from "react";

import InfoIcon from "@material-ui/icons/Info";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { LinkList as List, HtmlTooltip as Tooltip } from "@components/MaterialUI";

export const AlternativeVariantsSection: React.FC<{ variants: string }> = ({ variants }) => (
    <Box>
        <Tooltip
            arrow
            title={
                <React.Fragment>
                    <Typography color="inherit" variant="caption">
                        Follow the links below to view annotations for the alternative alleles
                    </Typography>
                </React.Fragment>
            }
        >
            <Chip color="secondary" icon={<InfoIcon />} label="multi-allelic variant" />
        </Tooltip>
        <List list={JSON.parse(variants)} />
    </Box>
);
