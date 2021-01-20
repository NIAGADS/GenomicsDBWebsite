import React from "react";
import { LinkProps as RouterLinkProps, Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Link, withStyles, Theme } from "@material-ui/core";

const useSecondaryLinkStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
    })
);

const primaryLinkStyles = (theme?: Theme) => ({
    root: {
        color: theme.palette.primary.light,
        "&:hover": {
            color: theme.palette.primary.dark,
        },
    },
});

const BoldBody2ExternalLinkStyles = (theme: Theme) => ({
    root: {
        ...primaryLinkStyles(theme).root,
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.fontWeightBold,
    },
});

const usePrimaryLinkStyles = makeStyles(primaryLinkStyles),
    useBoldBody2PrimaryLinkStyles = makeStyles(BoldBody2ExternalLinkStyles);

export const PrimaryExternalLink = withStyles(primaryLinkStyles)(Link);

export const BoldBody2ExternalLink = withStyles(BoldBody2ExternalLinkStyles)(Link);

export const SecondaryLink: React.FC<RouterLinkProps> = (props) => {
    const classes = useSecondaryLinkStyles();
    return <RouterLink {...props} className={classes.root} />;
};

export const PrimaryLink: React.FC<RouterLinkProps> = (props) => {
    const classes = usePrimaryLinkStyles();
    return <RouterLink {...props} className={classes.root} />;
};

export const BoldBody2PrimaryLink: React.FC<RouterLinkProps> = (props) => {
    const classes = useBoldBody2PrimaryLinkStyles();
    return <RouterLink {...props} className={classes.root} />;
};
