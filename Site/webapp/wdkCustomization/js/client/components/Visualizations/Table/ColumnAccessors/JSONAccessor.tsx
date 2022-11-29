import React from "react";
import { isObject } from "lodash";

import Box from "@material-ui/core/Box";

import { ColumnAccessor, AnnotatedTextAccessor, LinkAccessor } from "@viz/Table/ColumnAccessors";
import { ColoredTextAccessor } from "./TextAccessors";

export const jsonAccessorType = (obj: any) => {

    if (!("value" in obj)) {
        throw new Error(
            `ERROR: Invalid JSON passed to JSONAccessor (a ColumnAccessor) - missing 'value': ${JSON.stringify(obj)}`
        );
    }

    // check url first b/c links can have tooltips
    if ("url" in obj) {
        return "link";
    }

    if ("tooltip" in obj) {
        return "tooltip";
    }

    throw new Error(
        `ERROR: Invalid JSON passed to JSONAccessor (a ColumnAccessor) - unknown JSONAccessor type: ${JSON.stringify(obj)}`
    );
};

// expect 2 types 1: text w/tooltip, 2) link
// assumes "tooltip" = { value: str; tooltip: str}
export const JSONAccessor: React.SFC<ColumnAccessor> = ({ value }) => {
    const obj = isObject(value) ? value : JSON.parse(value);
    const objType = jsonAccessorType(obj);
    switch (objType) {
        case "tooltip":
            return <AnnotatedTextAccessor value={obj} />;
        case "link":
            return <LinkAccessor value={obj} />;
        default: // not handled, so make it visible so
            return <ColoredTextAccessor value={value} htmlColor="red" />;
    }
};
