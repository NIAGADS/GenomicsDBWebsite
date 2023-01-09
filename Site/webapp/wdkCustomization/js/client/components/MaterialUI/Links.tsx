import React from "react";

import { LinkProps } from "@material-ui/core";
import Link from "@material-ui/core/Link";

// just a wrapper to set target="_blank"
export const CustomLink = (props: LinkProps) => {
    const {href, color, children} = props;
    return (
        <Link href={href} color={color ? color: "initial"} target="_blank" rel="noopener">
            {children}
        </Link>
    );
};
