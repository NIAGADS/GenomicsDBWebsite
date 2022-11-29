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

export const parseFieldValue = (value: any, returnNA: boolean = false, isBooleanFlag: boolean = false): any => {
    if (isBooleanFlag || value.type.name.includes("Boolean")) {
        return value ? "Yes" : "No";
    }

    if (!value || isString(value)) {
        return resolveNAs(value, returnNA);
    }

    switch (value.type.name) {
        case "LinkAttribute":
            return 1;
        case "RelativePosition":
            return 1;
        default:
            return defaultParseFieldValue(value, returnNA, isBooleanFlag);
    }
};
