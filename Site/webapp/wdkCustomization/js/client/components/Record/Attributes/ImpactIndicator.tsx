import React from "react";
import Box from "@material-ui/core/Box";

interface ImpactIndicator {
    impact: string;
}

export const ImpactIndicator: React.SFC<ImpactIndicator> = (props) => {
    const { impact } = props;
    return (
        <Box className={`impact-indicator ${impact.toLowerCase()}`} component="span">
            {impact}
        </Box>
    );
};
