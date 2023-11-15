import React from "react";
import { forIn } from "lodash";
import {
    RelativePositionSpan,
    VariantConsequenceImpactSpan,
    MetaseqIdAttribute,
} from "@components/Record/Attributes";

import {
    resolveNAs,
    resolveColumnAccessor as defaultResolveColumnAccessor,
    BooleanCheckAccessor,
    RowSelectButtonAccessor
} from "@viz/Table/ColumnAccessors";
import { parseFieldValue as defaultParseFieldValue } from "@viz/Table";

import { RecordTableColumnAccessorType as ColumnAccessorType } from "@components/Record/RecordTable";
import { getLastPath } from "genomics-client/util/util";

export const extractFieldValues = (data: { [key: string]: any }[], field: string, isJSON: boolean): string[] => {
    return data.map(a => isJSON ? JSON.parse(a[field]) : a[field]);
}

export const extractIndexedFieldValue = (data: { [key: string]: any }[], field: string, isJSON: boolean, index: number): string => {
    return data.map(a => isJSON ? JSON.parse(a[field]) : a[field])[index];
}

export const extractPrimaryKeysFromRecordLink = (data: { [key: string]: any }[], field: string): string[] => {
    return data.map(a => extractPrimaryKeyFromRecordLink(a[field]));
}

export const extractIndexedPrimaryKeyFromRecordLink = (data: { [key: string]: any }[], field: string, index: number): string => {
    return data.map(a => extractPrimaryKeyFromRecordLink(a[field]))[index];
}

export const extractPrimaryKeyFromRecordLink = (value: string): string => {
    return getLastPath(JSON.parse(value).url);
}

export const resolveData = (data: { [key: string]: any }[]): { [key: string]: any }[] => {
    return data.map((datum) => {
        return forIn(datum, (v: string, k: string, o: { [x: string]: any }) => {
            o[k] = v === '' ? null : v; // k.endsWith("_flag") && !v ? null : _parseJson(v);
        });
    });
};



export const resolveColumnAccessor = (key: string, accessorType: ColumnAccessorType = "Default", userProps?:any) => {
    const MemoRelativePositionSpan = React.memo(RelativePositionSpan);
    const MemoVariantConsequenceImpactSpan = React.memo(VariantConsequenceImpactSpan);
    const MemoMetaseqIdAttribute = React.memo(MetaseqIdAttribute);
    const MemoBooleanCheckAccessor = React.memo(BooleanCheckAccessor);
    const MemoRowSelectButtonAccessor = React.memo(RowSelectButtonAccessor);

    switch (accessorType) {
        case "RelativePosition":
            return (row: any) => resolveNAs(row[key], <MemoRelativePositionSpan value={row[key]} />);
        case "VariantImpact":
            return (row: any) => resolveNAs(row[key], <MemoVariantConsequenceImpactSpan value={row[key]} />);
        case "MetaseqID":
            return (row: any) => resolveNAs(row[key], <MemoMetaseqIdAttribute value={row[key]} />);
        case "BooleanGreenCheck":
            return (row: any) => <MemoBooleanCheckAccessor value={row[key]} htmlColor="green" />;
        case "BooleanRedCheck":
            return (row: any) => <MemoBooleanCheckAccessor value={row[key]} htmlColor="red" />;
        case "RowSelectButton":
            return (row: any) => <MemoRowSelectButtonAccessor value={row[key]} userProps={userProps}/>;
        default:
            return defaultResolveColumnAccessor(key, accessorType);
    }
};

export const parseFieldValue = (value: any, nullStr: string = ""): any => {
    const accessorType = value.type
        ? value.type.name.includes("Boolean")
            ? "BooleanCheckAccessor"
            : value.type.name
        : "String";

    switch (accessorType) {
        case "LinkAttribute":
            throw new Error(`ERROR: Unable to parse field value - unhandled ColumnAccessor type: ${value.type.name}`);
        default:
            return defaultParseFieldValue(value, nullStr);
    }
};
