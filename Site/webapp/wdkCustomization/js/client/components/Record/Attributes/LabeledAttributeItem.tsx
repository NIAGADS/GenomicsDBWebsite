import React from "react";
import Typography from "@material-ui/core/Typography";
import { useTypographyStyles } from "@components/MaterialUI";

interface LabeledAttributeItem {
    label: string;
    attribute: string | React.ReactElement;
    small?: boolean;
}

export const LabeledAttributeItem: React.FC<LabeledAttributeItem> = ({ label, attribute, small }) => {
    const classes = useTypographyStyles();
    const className = small ? classes.small : "";

    return (
        <Typography className={className}>
            <strong>
                {label}
                {": "}
            </strong>
            {attribute}
        </Typography>
    );
};

