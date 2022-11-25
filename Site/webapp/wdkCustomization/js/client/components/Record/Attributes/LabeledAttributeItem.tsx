import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useTypographyStyles, CustomTooltip as Tooltip } from "@components/MaterialUI";
import { NASpan } from "genomics-client/components/Visualizations/Table/ColumnAccessors";

interface LabeledAttributeItem {
    label: string;
    attribute?: string;
    children?: React.ReactElement;
    small?: boolean;
    tooltip?: string;
}

export const LabeledAttributeItem: React.FC<LabeledAttributeItem> = ({
    label,
    attribute,
    children,
    small,
    tooltip,
}) => {
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
                    {attribute ? <Box component="span">attribute</Box> : children ? children : <NASpan />}
                </Tooltip>
            ) : attribute ? (
                attribute
            ) : children ? (
                children
            ) : (
                <NASpan />
            )}
        </Typography>
    );
};
