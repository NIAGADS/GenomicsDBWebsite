import React from "react";
import { Link as RouterLink } from "react-router-dom";

import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";

import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const resolveLink = (url: string, value: string) => {
    const isRouterLink = /^http/.test(url);
    return isRouterLink ? (
        <RouterLink key={url} to={url}>
            {value}
        </RouterLink>
    ) : (
        <Link key={url} href={url} color="initial">
            {value}
        </Link>
    );
};


// text with tooltip value = { value: string, url: string, tooltip: string}
export const LinkAccessor: React.SFC<ColumnAccessor> = ({ value }) => {
    return "tooltip" in value && value.tooltip != "" ? (
        <Tooltip key={Math.random().toString(36).slice(2)} title={value.tooltip} arial-label={value.tooltip} arrow>
            {resolveLink(value.url, value.value)}
        </Tooltip>
    ) : (
        resolveLink(value.url, value.value)
    );
};
