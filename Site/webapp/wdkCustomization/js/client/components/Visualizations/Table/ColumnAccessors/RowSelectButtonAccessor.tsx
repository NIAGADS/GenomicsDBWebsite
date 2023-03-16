import React from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";

import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const RowSelectButtonAccessor: React.SFC<ColumnAccessor> = ({ value, userProps }) => {
    return (
        <Box component="span">
            <Button
                color="primary"
                variant="contained"
                size="small"
                title={`${userProps.tooltip} + ' ' + ${value}`}
                aria-label={`${userProps.tooltip} + ' ' + ${value}`}
                onClick={() => userProps.action(value)}
                endIcon={<PresentToAllIcon />}
            />
        </Box>
    );
};
