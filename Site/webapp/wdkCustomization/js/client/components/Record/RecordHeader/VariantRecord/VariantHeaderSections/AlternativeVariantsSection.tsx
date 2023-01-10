import React from "react";

import InfoIcon from "@material-ui/icons/Info";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { LinkAttributeList } from "@components/Record/Attributes";

import { StyledTooltip as Tooltip } from "@components/MaterialUI";

export const AlternativeVariantsSection: React.FC<{ variants: string }> = ({ variants }) => (
    <Box>
        <Tooltip
            arrow
            title={
                <Typography color="inherit" variant="caption">
                    Follow the links below to view annotations for the alternative alleles
                </Typography>
            }
        >
            <Chip color="secondary" icon={<InfoIcon />} label="multi-allelic variant" />
        </Tooltip>
        <LinkAttributeList value={variants} />
    </Box>
);
