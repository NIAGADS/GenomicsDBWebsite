import React from "react";
import Box from "@material-ui/core/Box";


export const VariantConsequenceImpactSpan: React.SFC<{impact: string}> = (props) => {
    const { impact } = props;
    return (
        <Box className={`impact-indicator ${impact.toLowerCase()}`} component="span">
            {impact}
        </Box>
    );
};
