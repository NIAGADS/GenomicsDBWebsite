import React, { useState } from "react";
import { isObject, isString } from "lodash";

import Box from "@material-ui/core/Box";
import { StyledTooltip as Tooltip} from "@components/MaterialUI";

import { ColumnAccessor, JSONAccessor } from "@viz/Table/ColumnAccessors";
import { parseFieldValue } from "@viz/Table";

export const isJSON = (value: any) => {
    try {
        value = JSON.parse(value);
    } catch (e) {
        // catch numbers, nulls, booleans
        return isObject(value) && value != null;
        // return false;
    }

    // catch numbers, nulls, booleans
    return isObject(value) && value != null;
    
};

export const DefaultTextAccessor: React.SFC<ColumnAccessor> = ({ value, maxLength = 100 }) => {
    if (isJSON(value)) {
        return <JSONAccessor value={value} />;
    }
    if (value.toString().length > maxLength) {
        return <ClobTextAccessor value={value} maxLength={maxLength} />;
    }
    // catch numerics
    return parseFieldValue(value);
};

// large text, show more or tooltip
// if not JSON & no tooltip, show more
export const ClobTextAccessor: React.SFC<ColumnAccessor> = ({ value, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return isJSON(value) && "tooltip" in value ? (
        <AnnotatedTextAccessor value={{ value: value.slice(0, maxLength - 3) + "...", tooltip: value.tooltip }} />
    ) : isExpanded ? (
        <Box>
            {value} <a onClick={toggleIsExpanded}>Show less</a>
        </Box>
    ) : (
        <Box>
            {`${value.slice(0, maxLength - 3)}...`} <a onClick={toggleIsExpanded}>Show more</a>
        </Box>
    );
};

export const ColoredTextAccessor: React.SFC<ColumnAccessor> = ({ value, className, muiColor }) => {
    return (
        <Box className={className ? className : ""} component="span" color={muiColor ? muiColor : ""}>
            {value}
        </Box>
    );
};

// text with tooltip value = { value: string, tooltip: string}
// so technically, takes JSON

export const AnnotatedTextAccessor: React.SFC<ColumnAccessor> = ({ value }) => {
    return (    
        <Tooltip title={value.tooltip} arial-label={value.tooltip}>
           <Box component="span" className="annotated-text">{value.value}</Box>
        </Tooltip>
    );
};
