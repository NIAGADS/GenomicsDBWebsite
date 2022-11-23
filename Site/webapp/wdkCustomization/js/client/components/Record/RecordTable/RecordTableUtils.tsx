import React from "react";
import { isString, forIn } from "lodash";
import {  RelativePositionSpan, VariantConsequenceImpactSpan } from "@components/Record/Attributes";

import { resolveNAs, resolveColumnAccessor as defaultResolveColumnAccessor } from "@viz/Table/ColumnAccessors";

import { RecordTableColumnAccessorType as ColumnAccessorType } from "@components/Record/RecordTable";

const _parseJson = (value: any) => {
    //not reallly a json test, more like a check to see if the backend is sending us something we assume we can treat as json
    if (!value) return "n/a";
    if (!isString(value)) return value;
    if (value.startsWith("[") || value.startsWith("[{") || value.startsWith("{")) {
        try {
            return JSON.parse(value);
        } catch ($e) {
            return value;
        }
    }
    return value;
};

export const resolveData = (data: { [key: string]: any }[]): { [key: string]: any }[] => {
    return data.map((datum) => {
        return forIn(datum, (v: string, k: string, o: { [x: string]: any }) => {
            o[k] = k.endsWith("_flag") && !v ? null : _parseJson(v);
        });
    });
};


export const resolveColumnAccessor = (key: string, accessorType: ColumnAccessorType = "Default") => {
    switch (accessorType) {
        case "RelativePosition":
            return (row: any) => resolveNAs(row[key], <RelativePositionSpan value={row[key]} />);
        case "VariantImpact":
            return (row: any) => resolveNAs(row[key], <VariantConsequenceImpactSpan value={row[key]} />);
        default:
            return (row:any) => defaultResolveColumnAccessor(key, accessorType)
    }
};
