import React from "react";
import { LinkProps, Link } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core";

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

const usePrimaryLinkStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.primary.light,
            "&:hover": {
                color: theme.palette.primary.dark,
            },
        },
    })
);

export const SecondaryLink: React.FC<LinkProps> = (props) => {
    const classes = useSecondaryLinkStyles();
    return <Link {...props} className={classes.root} />;
};

export const PrimaryLink: React.FC<LinkProps> = (props) => {
    const classes = usePrimaryLinkStyles();
    return <Link {...props} className={classes.root} />;
};
