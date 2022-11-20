import React from "react";
import Box from "@material-ui/core/Box";

import { AttributeFormatter } from "@components/Record/Attributes";

export const RelativePositionSpan: React.SFC<AttributeFormatter> = (props) => {
    const { value } = props;

    const className = value.includes('in') || value.includes('overlap') ? 'colocated' : value.toLowerCase();

    return (
        <Box className={`position-indicator ${className}`} component="span">
            {value}
        </Box>
    );
};
