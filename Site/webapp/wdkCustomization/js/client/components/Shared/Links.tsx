import React from "react";
import { LinkProps as RouterLinkProps, Link as RouterLink } from "react-router-dom";
import { makeStyles, Link, withStyles, Theme } from "@material-ui/core";

/* note that links should always inherit their fontsize -- if they stand alone, wrap in a <Typography> element */

const secondaryLinkStyles = (theme: Theme) => ({
    root: {
        color: theme.palette.secondary.main,
        "&:hover": {
            color: theme.palette.secondary.light,
        },
    },
});

const primaryLinkStyles = (theme?: Theme) => ({
    root: {
        color: theme.palette.primary.light,
        "&:hover": {
            color: theme.palette.primary.dark,
        },
    },
});

const BoldExternalLinkStyles = (theme: Theme) => ({
    root: {
        ...primaryLinkStyles(theme).root,
        fontWeight: theme.typography.fontWeightBold,
    },
});

const useSecondaryLinkStyles = makeStyles(secondaryLinkStyles);

const usePrimaryLinkStyles = makeStyles(primaryLinkStyles),
    useBoldPrimaryLinkStyles = makeStyles(BoldExternalLinkStyles);

export const PrimaryExternalLink = withStyles(primaryLinkStyles)(Link);

export const SecondaryExternalLink = withStyles(secondaryLinkStyles)(Link);

export const LightSecondaryExternalLink = withStyles((theme) => ({
    root: {
        ...secondaryLinkStyles(theme).root,
        fontWeight: 200,
    },
}))(Link);

export const BoldExternalLink = withStyles(BoldExternalLinkStyles)(Link);

export const SecondaryLink: React.FC<RouterLinkProps> = (props) => {
    const classes = useSecondaryLinkStyles();
    return <RouterLink {...props} className={classes.root} />;
};

export const PrimaryLink: React.FC<RouterLinkProps> = (props) => {
    const classes = usePrimaryLinkStyles();
    return <RouterLink {...props} className={classes.root} />;
};

export const BoldPrimaryLink: React.FC<RouterLinkProps> = (props) => {
    const classes = useBoldPrimaryLinkStyles();
    return <RouterLink {...props} className={classes.root} />;
};
