import React from "react";

import { LinkProps } from "@material-ui/core";
import Link from "@material-ui/core/Link";

// just a wrapper to set target="_blank"
// using .forwardRef so that tooltips / mouse over events can be associated w/the links
export const CustomLink = React.forwardRef((props: LinkProps, ref) => {
    const { href, color, children } = props;
    return (
        <Link innerRef={ref} href={href} color={color ? color : "initial"} target="_blank" rel="noopener">
            {children}
        </Link>
    );
});
