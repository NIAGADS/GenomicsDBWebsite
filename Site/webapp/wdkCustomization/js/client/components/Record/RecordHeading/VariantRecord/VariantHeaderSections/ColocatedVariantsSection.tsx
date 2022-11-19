import React from "react";

import InfoIcon from "@material-ui/icons/Info";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { LinkList as List, HtmlTooltip as Tooltip } from "@components/MaterialUI";

export const ColocatedVariantsSection: React.FC<{ variants: string; position: string; chromosome: string }> = ({
    variants,
    position,
    chromosome,
}) => (
    <Box>
        <Tooltip
            arrow
            title={
                <React.Fragment>
                    <Typography color="inherit" variant="caption">
                        Follow the links below to view annotations for co-located/overlapping variants, such as indels,
                        structural variants, and colocated SNVs not in dbSNP.
                    </Typography>
                </React.Fragment>
            }
        >
            <Chip
                color="secondary"
                icon={<InfoIcon />}
                label={`This position (${chromosome}:${position}) coincides with:`}
            />
        </Tooltip>
        <List list={JSON.parse(variants)} />
    </Box>
);
