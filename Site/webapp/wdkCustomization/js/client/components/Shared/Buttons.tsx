import React from "react";
import { Button, ButtonProps, withStyles } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import Theme from "./../../theme";

//base override of wdk input[type=button]
const BaseStyles = (theme: typeof Theme) =>
    createStyles({
        root: {
            backgroundImage: "none",
            color: theme.palette.primary.contrastText,
            "&:hover": {
                backgroundColor: theme.palette.primary.dark,
            },
            "&:focus, &:visited, &:active, &:hover": {
                backgroundImage: "none",
            },
            "&:focus": {
                backgroundColor: theme.palette.primary.light,
                outline: "none",
            },
        },
        label: {
            whiteSpace: "nowrap",
        },
    });

const BaseButton = withStyles(BaseStyles)(Button);

const useButtonStyles = makeStyles((theme: typeof Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.primary.light,
        },
    })
);

export const PrimaryActionButton: React.FC<ButtonProps> = ({ onClick, children, disabled }) => {
    const classes = useButtonStyles();
    return (
        <BaseButton classes={classes} disabled={disabled} onClick={onClick} variant="contained">
            {children}
        </BaseButton>
    );
};
