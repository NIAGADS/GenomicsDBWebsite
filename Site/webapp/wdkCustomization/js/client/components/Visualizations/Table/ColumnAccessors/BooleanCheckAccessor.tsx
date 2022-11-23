import React from "react";
import Box from "@material-ui/core/Box";

import CheckIcon from "@material-ui/icons/Check";
import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const BooleanCheckAccessor: React.SFC<ColumnAccessor> = ({ value, className, htmlColor, muiColor }) => {
    return value && ["true", "yes"].includes(value.toString().toLowerCase()) ? (
        <Box component="span">
            <CheckIcon
                className={className ? className : ""}
                color={muiColor ? muiColor : ""}
                htmlColor={htmlColor ? htmlColor : ""}
                fontSize="inherit"
            ></CheckIcon>
        </Box>
    ) : null;
};
