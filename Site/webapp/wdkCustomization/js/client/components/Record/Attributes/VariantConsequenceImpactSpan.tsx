import React from "react";
import Box from "@material-ui/core/Box";

/* NOTE: for this Span components, if child is simply text, it needs to be stored in a variable named value to be 
correctly extracted for text processing (filter, sorting, dowload) */

import { AttributeFormatter } from "@components/Record/Attributes";

export const VariantConsequenceImpactSpan: React.SFC<AttributeFormatter> = (props) => {
    const { value } = props;
    return (
        <Box className={`impact-indicator ${value.toLowerCase()}`} component="span">
            {value}
        </Box>
    );
};
