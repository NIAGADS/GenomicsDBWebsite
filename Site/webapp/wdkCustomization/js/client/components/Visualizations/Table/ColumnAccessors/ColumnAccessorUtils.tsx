import React from "react";

import {
    NASpan,
    SparkPercentageBarAccessor,
    ColoredTextAccessor,
    BooleanCheckAccessor,
    ColumnAccessorType,
    DefaultTextAccessor,
} from "@viz/Table/ColumnAccessors";


/* altValue defines what should be displayed if not n/a */
export const resolveNAs = (value: string, altValue: any = null) => {
    if (value === "n/a") {
        return <NASpan key={Math.random().toString(36).slice(2)}></NASpan>;
    }
    return altValue ? altValue : value;
};

export const resolveColumnAccessor = (key: string, accessorType: ColumnAccessorType = "Default") => {
    switch (accessorType) {
        case "PercentageBar":
            return (row: any) =>
                resolveNAs(row[key], <SparkPercentageBarAccessor value={{ value: row[key], percentage: row[key] * 100 }} />);
        case "BooleanCheck":
            return (row: any) => <BooleanCheckAccessor value={row[key]} />;
        case "ColoredSpan":
            return (row: any) => resolveNAs(row[key], <ColoredTextAccessor value={row[key]} htmlColor="red" />);
        case "Link":
        case "ScientificNotation":
        case "Float":
        default:
            return (row: any) => resolveNAs(row[key], <DefaultTextAccessor value={row[key]}/>);
        //  return (row: any) => (isObject(row[key]) ? resolveObjectInput(row[key]) : resolveNAs(row[key]));
    }
};
