import React from "react";

import { withStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { RecordAttributeSection } from "wdk-client/Components";

export const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: "16px",
        border: "1px solid #dadde9",
    },
}))(Tooltip);

// for tooltips generated w/in functions that need a key
export const withTooltip = (element: React.ReactElement<any>, content: string) => {
    if (content) {
        return (
            <Tooltip key={Math.random().toString(36).slice(2)} title={safeHtml(content)}>
                {element}
            </Tooltip>
        );
    }
    return element;
};

export const withHtmlTooltip = (element: React.ReactElement<any>, content: string) => {
    if (content) {
        return (
            <HtmlTooltip
                key={Math.random().toString(36).slice(2)}
                arrow
                title={
                    <>
                        <Typography variant="caption">{safeHtml(content)}</Typography>
                    </>
                }
            >
                {element}
            </HtmlTooltip>
        );
    }
    return element;
};
