import React from "react";

import InfoIcon from "@material-ui/icons/Info";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { StyledTooltip as Tooltip } from "@components/MaterialUI";
import { LinkAttributeList } from "@components/Record/Attributes";
import { useHeadingStyles } from "@components/Record/RecordHeader";

export const ColocatedVariantsSection: React.FC<{ variants: string; span:string; }> = ({
    variants,
    span
}) => {
    const classes = useHeadingStyles();
    return (
    <Box>
        <Tooltip
            arrow
            title={
                <Typography color="inherit" variant="caption">
                    {`Follow the links below to view annotations for variants co-located or overlapping the span ${span}.  These may include indels,
                    structural variants, as well as additional SNVs.`}
                </Typography>
            }
        >
            <Chip className={classes.chipHeading}
                color="secondary"
                icon={<InfoIcon />}
                label={`This variant overlaps with:`}
            />
        </Tooltip>
        <LinkAttributeList value={variants} />
    </Box>
);
        }
