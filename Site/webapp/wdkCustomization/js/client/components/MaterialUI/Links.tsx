import React from "react";

import { LinkProps } from "@material-ui/core";
import Link from "@material-ui/core/Link";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        secondary: {
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
    })
);

// just a wrapper to set target="_blank"
// using .forwardRef so that tooltips / mouse over events can be associated w/the links
interface CustomLinkProps {
    style?: "secondary" | "default";
}
export const CustomLink = React.forwardRef((props: LinkProps & CustomLinkProps, ref) => {
    const { href, color, children, className, style } = props;
    const classes = useStyles();

    const linkStyle = style ? (style === "secondary" ? classes.secondary : null) : null;
    const linkClassName = className ? (style ? className + " " + linkStyle : className) : style ? linkStyle : null;

    return (
        <Link
            innerRef={ref}
            href={href}
            color={color ? color : "initial"}
            className={linkClassName}
            target="_blank"
            rel="noopener"
        >
            {children}
        </Link>
    );
});
