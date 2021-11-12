import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

interface RecordAttributeItem {
    label: string;
    attribute: string | React.ReactElement;
    small?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        small: { fontSize: "12px" },
    })
);
const RecordAttributeItem: React.FC<RecordAttributeItem> = ({ label, attribute, small }) => {
    const classes = useStyles();
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

export default RecordAttributeItem;
