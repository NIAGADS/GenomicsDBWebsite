import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useTypographyStyles, CustomTooltip as Tooltip } from "@components/MaterialUI";

interface LabeledAttributeItem {
    label: string;
    attribute: string | React.ReactElement;
    small?: boolean;
    tooltip?: string;
}

export const LabeledAttributeItem: React.FC<LabeledAttributeItem> = ({ label, attribute, small, tooltip }) => {
    const classes = useTypographyStyles();
    const className = small ? classes.small : "";

    return (
        <Typography className={className}>
            <strong>
                {label}
                {": "}
            </strong>
            {tooltip ? (
                <Tooltip title={tooltip}>
                   <>{attribute}</>
                </Tooltip>
            ) : (
                { attribute }
            )}
        </Typography>
    );
};
