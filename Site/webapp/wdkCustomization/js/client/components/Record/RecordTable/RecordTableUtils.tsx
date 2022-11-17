import React from "react";
import { isString, isObject, forIn } from "lodash";
import { resolveObjectInput } from "genomics-client/util/jsonParse";
import { ColumnAccessorType } from "@viz/Table";
import CssBarChart from "./Columns/CssBarChart";

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
            o[k] = _parseJson(v);
        });
    });
};

export const resolveNAs = (value: string, accessor?: any) => {
    if (value === "n/a") {
        return (
            <span key={Math.random().toString(36).slice(2)} className="grey">
                {value}
            </span>
        );
    }
    return value;
};

export const resolveAccessor = (key: string, accessorType: ColumnAccessorType = "Default") => {
    switch (accessorType) {
        case "Default":
            return (row: any) => (isObject(row[key]) ? resolveObjectInput(row[key]) : resolveNAs(row[key]));
        case "StackedBar":
            return (row: any) => <CssBarChart value={row[key]} percentage={row[key] * 100} />;
        case "BooleanFlag":
            return (row: any) => (isObject(row[key]) ? resolveObjectInput(row[key]) : row[key]);
    }
};
