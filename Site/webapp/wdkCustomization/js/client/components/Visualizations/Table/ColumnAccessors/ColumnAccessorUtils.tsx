import React from "react";

import {
    NASpan,
    SparkPercentageBarAccessor,
    ColoredTextAccessor,
    BooleanCheckAccessor,
    ColumnAccessorType,
    DefaultTextAccessor,
    LinkAccessor,
} from "@viz/Table/ColumnAccessors";

/* altValue defines what should be displayed if not n/a */
export const resolveNAs = (value: string, altValue: any = null) => {
    if (value === "n/a" || value === null) {
        return <NASpan key={Math.random().toString(36).slice(2)}></NASpan>;
    }
    return altValue ? altValue : value;
};

// the |any for accessor type is to handle custom types that build on 
// or wrap the default accessors (e.g., see GenomicsDB Record Table)
// not sure of the correct syntax
export const resolveColumnAccessor = (key: string, accessorType: ColumnAccessorType | any= "Default") => {
    switch (accessorType) {
        case "PercentageBar":
            return (row: any) =>
                resolveNAs(
                    row[key],
                    <SparkPercentageBarAccessor value={{ value: row[key], percentage: row[key] * 100 }} />
                );
        case "BooleanCheck":
            return (row: any) => <BooleanCheckAccessor value={row[key]} />;
        case "ColoredText":
            return (row: any) => resolveNAs(row[key], <ColoredTextAccessor value={row[key]} htmlColor="red" />);
        case "Link":
            return (row: any) => resolveNAs(row[key], <LinkAccessor value={row[key]}/>);
        case "ScientificNotation":
        case "Float":
        default:
            return (row: any) => resolveNAs(row[key], <DefaultTextAccessor value={row[key]} />);
    }
};
