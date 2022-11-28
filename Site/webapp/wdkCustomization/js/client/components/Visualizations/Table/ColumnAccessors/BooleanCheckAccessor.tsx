import React from "react";
import Box from "@material-ui/core/Box";

import CheckIcon from "@material-ui/icons/Check";
import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const BooleanCheckAccessor: React.SFC<ColumnAccessor> = ({ value, className, htmlColor, muiColor }) => {
    if (value && ["true", "yes"].includes(value.toString().toLowerCase())) {
        return (
            <Box component="span">
                <CheckIcon
                    className={className ? className : undefined}
                    color={muiColor ? muiColor : undefined}
                    htmlColor={htmlColor ? htmlColor : undefined}
                    fontSize="inherit"
                ></CheckIcon>
            </Box>
        );
    }
    return null;
};
