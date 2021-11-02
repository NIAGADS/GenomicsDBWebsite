import React  from "react";
import { isString, isObject, findIndex, forIn, get, toNumber } from "lodash";
import { resolveObjectInput, withTooltip } from "../../../util/jsonParse";
import CssBarChart from "./CssBarChart/CssBarChart";


const _parseJson = (value: any) => {
    //not reallly a json test, more like a check to see if the backend is sending us something we assume we can treat as json
    if (!value) return value;
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

export const resolveAccessor = (key: string, attributeType: string) => {
    switch (attributeType) {
        case "string":
        case "json_text":
            return (row: { [key: string]: any }) => (isObject(row[key]) ? resolveObjectInput(row[key]) : row[key]);
        case "integer":
        case "boolean":
        case "numeric":
            return (row: any) => row[key];
        //if table, we want to convert it back to json and let the subtable handler take care of it
        case "json_table":
            return (row: any) => JSON.stringify(row[key]);
        case "percentage_bar":
            return (row: any) => <CssBarChart original={row[key]} pctFull={row[key] * 100} />;
        case "json_link":
        case "json_icon":
        case "json_text_or_link":
        case "json_dictionary":
            //resolveData() has already parsed json, here we just resolve the component through the accessor
            return (row: { [key: string]: any }) => resolveObjectInput(row[key]);
    }
    throw new Error(`No accessor for value of type ${attributeType}`);
};
