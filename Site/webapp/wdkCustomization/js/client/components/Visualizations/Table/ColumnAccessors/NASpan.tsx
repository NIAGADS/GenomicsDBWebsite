import React from "react";
import Box from "@material-ui/core/Box";
import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const NASpan: React.FC<ColumnAccessor> = ({value="n/a", className="grey"}) => {
    return (
        <Box className={className} component="span">
            {value}
        </Box>
    );
};

