import React from "react";

import { withStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import { safeHtml } from "wdk-client/Utils/ComponentUtils";

export const CustomTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: "16px",
        border: "1px solid #dadde9",
    },
}))(Tooltip);

export const KeyedTooltip = (target: React.ReactElement<any>, tooltip: string) => {
    return tooltip ? (
        <CustomTooltip
            key={Math.random().toString(36).slice(2)}
            arrow
            title={<Typography variant="caption">{safeHtml(tooltip)}</Typography>}
        >
            {target}
        </CustomTooltip>
    ) : (
        { target }
    );
};
