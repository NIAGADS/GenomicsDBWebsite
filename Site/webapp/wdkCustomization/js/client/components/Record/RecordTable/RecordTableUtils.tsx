import React from "react";
import { isString, isObject, forIn } from "lodash";
import { resolveObjectInput } from "genomics-client/util/jsonParse";
import { ColumnAccessorType } from "@viz/Table";
import { StackedBar, NASpan, RelativePositionSpan, VariantConsequenceImpactSpan } from "@components/Record/Attributes";

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

/* altValue defines what should be displayed if not n/a */
export const resolveNAs = (value: string, altValue: any = null) => {
    if (value === "n/a") {
        return <NASpan key={Math.random().toString(36).slice(2)}></NASpan>;
    }
    return altValue ? altValue : value;
};

export const resolveAccessor = (key: string, accessorType: ColumnAccessorType = "Default") => {
    switch (accessorType) {
        case "StackedBar":
            return (row: any) => resolveNAs(row[key], <StackedBar value={row[key]} percentage={row[key] * 100} />);
        case "BooleanFlag":
            return (row: any) => (isObject(row[key]) ? resolveObjectInput(row[key]) : row[key]);
        case "RelativePosition":
            return (row: any) => resolveNAs(row[key], <RelativePositionSpan value={row[key]} />);
        case "VariantImpact":
            return (row: any) => resolveNAs(row[key], <VariantConsequenceImpactSpan value={row[key]} />);
        case "Link":
        case "ScientificNotation":
        case "Float":
        default:
            return (row: any) => (isObject(row[key]) ? resolveObjectInput(row[key]) : resolveNAs(row[key]));
    }
};
