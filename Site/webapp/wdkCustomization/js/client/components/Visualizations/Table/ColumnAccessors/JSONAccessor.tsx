import React from "react";
import { isObject } from "lodash";

import {
    DefaultTextAccessor,
    ColumnAccessor,
    AnnotatedTextAccessor,
    LinkAccessor,
    LinkListAccessor,
} from "@viz/Table/ColumnAccessors";

export const jsonAccessorType = (obj: any) => {
    if (Array.isArray(obj)) {
        if ("url" in obj[0]) {
            return "link_list";
        } else {
            throw new Error(
                `ERROR: Invalid JSON passed to JSONAccessor (a ColumnAccessor) - unknown array type: ${JSON.stringify(
                    obj
                )}`
            );
        }
    }

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
    // legacy (type == text)
    else if ("text" in obj) {
        return "legacy_plain_text";
    }

    throw new Error(
        `ERROR: Invalid JSON passed to JSONAccessor (a ColumnAccessor) - unknown JSONAccessor type: ${JSON.stringify(
            obj
        )}`
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
        case "link_list":
            return <LinkListAccessor value={obj} />;
        default: // not handled, so just display value // probably just a legacy text
            return <DefaultTextAccessor value={value.value} />;
    }
};
