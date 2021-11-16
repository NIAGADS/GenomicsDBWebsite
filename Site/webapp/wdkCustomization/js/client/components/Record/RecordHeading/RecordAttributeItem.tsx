import React from "react";
import Typography from "@material-ui/core/Typography";
import { useTypographyStyles } from "@components/MaterialUI";

interface RecordAttributeItem {
    label: string;
    attribute: string | React.ReactElement;
    small?: boolean;
}

export const RecordAttributeItem: React.FC<RecordAttributeItem> = ({ label, attribute, small }) => {
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

