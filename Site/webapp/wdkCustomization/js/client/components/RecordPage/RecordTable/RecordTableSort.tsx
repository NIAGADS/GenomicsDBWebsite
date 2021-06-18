import { useMemo } from 'react';
import { Row } from 'react-table';
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

export const linkColumnSort = useMemo(() => (rowA: Row, rowB: Row, columnId: string, desc: Boolean) => {
    const a = extractDisplayText(rowA.values[columnId]),
        b = extractDisplayText(rowB.values[columnId]);

        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
}, []);

// NOTE: this does not work quite right on regular text fields
export const recordTableSort = useMemo(() => (rowA: Row, rowB: Row, columnId: string, desc: Boolean) => {
    let c = extractDisplayText(rowA.values[columnId]),
        d = extractDisplayText(rowB.values[columnId]);
    (c = c === null || c === undefined ? -Infinity : c), (d = d === null || d === undefined ? -Infinity : d);
    //sci string to num
    c = /\d\.\d+e-\d+/.test(c) ? +c : c;
    d = /\d\.\d+e-\d+/.test(d) ? +d : d;
    //pos strings
    c = isString(c) ? c.replace(/:/g, "").toLowerCase() : c;
    d = isString(d) ? d.replace(/:/g, "").toLowerCase() : d;
    if (c > d) {
        return 1;
    }
    if (c < d) {
        return -1;
    }
    return 0;
}, []);
