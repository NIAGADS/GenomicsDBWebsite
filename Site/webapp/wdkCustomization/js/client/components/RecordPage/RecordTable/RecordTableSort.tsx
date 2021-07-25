import { useMemo } from "react";
import { Row } from "react-table";
import { isString, get, toNumber, isObject } from "lodash";

export const extractDisplayText = (value: any): any => {
    return isString(value) || !value
        ? value
        : get(value, "props.dangerouslySetInnerHTML.__html")
        ? value.props.dangerouslySetInnerHTML.__html
        : value.type && value.type.name === "CssBarChart"
        ? toNumber(value.props.original)
        : isObject(value) && (value as { displayText: string }).displayText
        ? (value as { displayText: string }).displayText
        : value.value
        ? value.value
        : value.props && value.props.children
        ? extractDisplayText(value.props.children)
        : "";
};

export const flagColumnSort = useMemo(
    () => (rowA: Row, rowB: Row, id: string, desc: Boolean) => {
        const a = rowA.values[id] ? true : false,
            b = rowB.values[id] ? true : false;

        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    },
    []
);

export const linkColumnSort = useMemo(
    () => (rowA: Row, rowB: Row, id: string, desc: Boolean) => {
        const a = extractDisplayText(rowA.values[id]),
            b = extractDisplayText(rowB.values[id]);

        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    },
    []
);

export const sciNotationColumnSort = useMemo(
    () => (rowA: Row, rowB: Row, id: string, desc: Boolean) => {
        let a = extractDisplayText(rowA.values[id]),
            b = extractDisplayText(rowB.values[id]);
        (a = a === null || a === undefined ? -Infinity : a), (b = b === null || b === undefined ? -Infinity : b);
        a = /\d\.\d+e-\d+/.test(a) ? +a : a;
        b = /\d\.\d+e-\d+/.test(b) ? +b : b;
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    },
    []
);

// Mixed sorting is slow, but very inclusive of many edge cases.
// It handles numbers, mixed alphanumeric combinations, and even
// null, undefined, and Infinity
// modified from react-table alphanumeric function
const reSplitAlphaNumeric = /([0-9]+)/gm;
function toString(a: any) {
    if (typeof a === "number") {
        if (isNaN(a) || a === Infinity || a === -Infinity) {
            return "";
        }
        return String(a);
    }
    if (typeof a === "string") {
        return a;
    }
    return "";
}

export const defaultColumnSort = useMemo(
    () => (rowA: Row, rowB: Row, id: string, desc: Boolean) => {
        let a = extractDisplayText(rowA.values[id]),
            b = extractDisplayText(rowB.values[id]);
        // Force to strings (or "" for unsupported types)
        a = toString(a);
        b = toString(b);

        // Split on number groups, but keep the delimiter
        // Then remove falsey split values
        a = a.split(reSplitAlphaNumeric).filter(Boolean);
        b = b.split(reSplitAlphaNumeric).filter(Boolean);

        // While
        while (a.length && b.length) {
            let aa = a.shift();
            let bb = b.shift();

            const an = parseInt(aa, 10);
            const bn = parseInt(bb, 10);

            const combo = [an, bn].sort();

            // Both are string
            if (isNaN(combo[0])) {
                if (aa > bb) {
                    return 1;
                }
                if (bb > aa) {
                    return -1;
                }
                continue;
            }

            // One is a string, one is a number
            if (isNaN(combo[1])) {
                return isNaN(an) ? -1 : 1;
            }

            // Both are numbers
            if (an > bn) {
                return 1;
            }
            if (bn > an) {
                return -1;
            }
        }

        return a.length - b.length;
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    },
    []
);


