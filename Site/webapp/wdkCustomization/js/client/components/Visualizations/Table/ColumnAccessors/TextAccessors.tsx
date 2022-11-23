import React from "react";
import isJSON from "lodash";

import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

import { ColumnAccessor, JSONAccessor } from "@viz/Table/ColumnAccessors";

const parseValue: any = (value: string) => {
    if (isJSON(value)) {
        return JSON.parse(value);
    } else {
        return value;
    }
};

export const ColoredTextAccessor: React.SFC<ColumnAccessor> = ({ value, className, muiColor }) => {
    return (
        <Box className={className ? className : ""} component="span" color={muiColor ? muiColor : ""}>
            {value}
        </Box>
    );
};

export const DefaultTextAccessor: React.SFC<ColumnAccessor> = ({ value }) => {
    return isJSON(value) ? <Box component="span">{value}</Box> : <JSONAccessor value={value} />;
};

// text with tooltip value = { value: string, tooltip: string}
export const AnnotatedTextAccessor: React.SFC<ColumnAccessor> = ({value}) => {
    return (
        <Tooltip title={value.tooltip} arial-label={value.tooltip}>
            {value.value}
        </Tooltip>
    );
};
