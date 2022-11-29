import React from "react";
import { isString, forIn } from "lodash";
import {
    RelativePositionSpan,
    VariantConsequenceImpactSpan,
    LinkAttribute,
    MetaseqIdAttribute,
} from "@components/Record/Attributes";

import {
    resolveNAs,
    resolveColumnAccessor as defaultResolveColumnAccessor,
    BooleanCheckAccessor,
} from "@viz/Table/ColumnAccessors";
import { parseFieldValue as defaultParseFieldValue, resolveNullFieldValue } from "@viz/Table";

import { RecordTableColumnAccessorType as ColumnAccessorType } from "@components/Record/RecordTable";

export const resolveData = (data: { [key: string]: any }[]): { [key: string]: any }[] => {
    return data.map((datum) => {
        return forIn(datum, (v: string, k: string, o: { [x: string]: any }) => {
            o[k] = v; // k.endsWith("_flag") && !v ? null : _parseJson(v);
        });
    });
};

export const resolveColumnAccessor = (key: string, accessorType: ColumnAccessorType = "Default") => {
    switch (accessorType) {
        case "RelativePosition":
            return (row: any) => resolveNAs(row[key], <RelativePositionSpan value={row[key]} />);
        case "VariantImpact":
            return (row: any) => resolveNAs(row[key], <VariantConsequenceImpactSpan value={row[key]} />);
        case "Link":
            return (row: any) => resolveNAs(row[key], <LinkAttribute value={row[key]} />);
        case "MetaseqID":
            return (row: any) => resolveNAs(row[key], <MetaseqIdAttribute value={row[key]} />);
        case "BooleanGreenCheck":
            return (row: any) => <BooleanCheckAccessor value={row[key]} htmlColor="green" />;
        case "BooleanRedCheck":
            return (row: any) => <BooleanCheckAccessor value={row[key]} htmlColor="red" />;
        default:
            return defaultResolveColumnAccessor(key, accessorType);
    }
};

export const parseFieldValue = (value: any, returnNA: boolean = false): any => {
    const accessorType = value.type
        ? value.type.name.includes("Boolean")
            ? "BooleanCheckAccessor"
            : value.type.name
        : "String";

    switch (accessorType) {
        case "LinkAttribute":
            throw new Error(`ERROR: Unable to parse field value - unhandled ColumnAccessor type: ${value.type.name}`);
        default:
            return defaultParseFieldValue(value, returnNA);
    }
};
