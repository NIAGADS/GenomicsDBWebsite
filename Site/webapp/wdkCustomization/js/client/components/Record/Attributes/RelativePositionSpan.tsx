import React from "react";
import Box from "@material-ui/core/Box";

export const RelativePositionSpan: React.SFC<{value: string}> = (props) => {
    const { value } = props;

    const className = value.includes('in') || value.includes('overlap') ? 'colocated' : value.toLowerCase();

    return (
        <Box className={`position-indicator ${className}`} component="span">
            {value}
        </Box>
    );
};
