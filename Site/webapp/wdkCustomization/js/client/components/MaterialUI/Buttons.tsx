import React from "react";
import { Button, ButtonProps, IconButton, Theme, withStyles, ThemeProvider } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { muiTheme } from "@components/MaterialUI";

//base override of wdk input[type=button]
const buttonResetStyles = (theme: Theme) =>
    createStyles({
        root: {
            backgroundImage: "none",
            color: theme.palette.primary.contrastText,
            textTransform: "none",
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
    });

const BaseStyles = (theme: Theme) =>
    createStyles({
        ...buttonResetStyles(theme),
        label: {
            whiteSpace: "nowrap",
        },
    });

export const BaseIconButton = withStyles((theme) =>
    createStyles({
        root: {
            ...buttonResetStyles(theme).root,
            color: theme.palette.text.primary,
            "&:hover": {
                backgroundColor: theme.palette.grey[200],
            },
        },
    })
)(IconButton);

export const LabelButton = withStyles((theme) =>
    createStyles({
        root: {
            "&:hover": {
                backgroundColor: "white",
            },
            justifyContent: "left"
        },
    })
)(Button);

const BaseButton = withStyles(BaseStyles)(Button);

const useButtonStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.primary.light,
        },
    })
);

export const PrimaryActionButton: React.FC<ButtonProps> = ({ onClick, children, disabled, ...rest }) => {
    const classes = useButtonStyles();
    return (
        <BaseButton {...rest} classes={classes} disabled={disabled} onClick={onClick}>
            {children}
        </BaseButton>
    );
};

export const MaterialUIThemedButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <ThemeProvider theme={muiTheme}>
            <Button {...props}>{children}</Button>
        </ThemeProvider>
    );
};
