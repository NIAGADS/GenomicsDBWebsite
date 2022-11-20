// adapted from: https://github.com/TanStack/table/blob/3e760e3eab4dfc1c7168e418741566e42ba7dd25/packages/table-core/src/sortingFns.ts
// basically, wrappers to parseValues from objects in the table
// and catch n/a's to treat them like null values

import { Row } from "react-table";
import { parseFieldValue } from "@viz/Table";

const reSplitAlphaNumeric = /([0-9]+)/gm;

interface SortingFunction {
    (rowA: Row, rowB: Row, columnId: string, desc?: boolean): number;
}

const getValue: any = (row: Row, columnId: string, retString: boolean = true) => {
    const value = parseFieldValue(row.values[columnId], true);
    return retString ? toString(value) : value;
};

const getBooleanValue: any = (row: Row, columnId: string) => {
    return row.values[columnId] ? true : false;
};

export const barChartSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    return compareAlphanumeric(getValue(rowA, columnId), getValue(rowB, columnId), desc);
};

export const booleanFlagSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    const a = getBooleanValue(rowA, columnId),
        b = getBooleanValue(rowB, columnId);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

export const linkSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    return compareBasic(getValue(rowA, columnId).toLowerCase(), getValue(rowB, columnId).toLowerCase(), desc);
};

export const scientificNotationSort: SortingFunction = (rowA, rowB, columnId) => {
    let a = getValue(rowA, columnId, false),
        b = getValue(rowB, columnId, false);
    (a = a === null || a === undefined ? -Infinity : a), (b = b === null || b === undefined ? -Infinity : b);
    a = /\d\.\d+e-\d+/.test(a) ? +a : a;
    b = /\d\.\d+e-\d+/.test(b) ? +b : b;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

export const alphanumericSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    return compareAlphanumeric(getValue(rowA, columnId).toLowerCase(), getValue(rowB, columnId).toLowerCase(), desc);
};

export const alphanumericCaseSensitiveSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    return compareAlphanumeric(getValue(rowA, columnId), getValue(rowB, columnId), desc);
};

// The text filter is more basic (less numeric support)
// but is much faster
export const textSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    return compareBasic(getValue(rowA, columnId).toLowerCase(), getValue(rowB, columnId).toLowerCase(), desc);
};

// The text filter is more basic (less numeric support)
// but is much faster
export const textCaseSensitiveSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    return compareBasic(getValue(rowA, columnId), getValue(rowB, columnId), desc);
};

export const basicSort: SortingFunction = (rowA, rowB, columnId, desc) => {
    return compareBasic(getValue(rowA, columnId, false), getValue(rowB, columnId, false), desc);
};

// Utils

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

function resolveNAs(aStr: string, bStr: string) {
    switch (true) {
        case aStr == "n/a" && bStr == "n/a":
            return 0;
        case aStr != "n/a" && bStr == "n/a":
            return -1;
        case aStr == "n/a" && bStr != "n/a":
            return 1;
        default: // neither na
            return null;
    }
}

function compareBasic(a: any, b: any, desc: boolean) {
    const naComparison = resolveNAs(a, b);
    if (naComparison != null) {
        return desc ? -1 * naComparison : naComparison;
    }
    return a === b ? 0 : a > b ? 1 : -1;
}

// Mixed sorting is slow, but very inclusive of many edge cases.
// It handles numbers, mixed alphanumeric combinations, and even
// null, undefined, and Infinity
function compareAlphanumeric(aStr: string, bStr: string, desc: boolean) {
    // Split on number groups, but keep the delimiter
    // Then remove falsey split values

    const naComparison = resolveNAs(aStr, bStr);
    if (naComparison != null) {
        return desc ? -1 * naComparison : naComparison;
    }

    const a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
    const b = bStr.split(reSplitAlphaNumeric).filter(Boolean);

    // While
    while (a.length && b.length) {
        const aa = a.shift()!;
        const bb = b.shift()!;

        const an = parseInt(aa, 10);
        const bn = parseInt(bb, 10);

        const combo = [an, bn].sort();

        // Both are string
        if (isNaN(combo[0]!)) {
            if (aa > bb) {
                return 1;
            }
            if (bb > aa) {
                return -1;
            }
            continue;
        }

        // One is a string, one is a number
        if (isNaN(combo[1]!)) {
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
}

const TableSortingFunctions = {
    alphanumericSort,
    alphanumericCaseSensitiveSort,
    basicSort,
    textCaseSensitiveSort,
    textSort,
    barChartSort,
    booleanFlagSort,
    linkSort,
    scientificNotationSort,
};

export default TableSortingFunctions;
