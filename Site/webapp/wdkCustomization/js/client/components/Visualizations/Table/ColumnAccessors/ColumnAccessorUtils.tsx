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
    const MemoNASpan = React.memo(NASpan);
    if (value === "N/A" || value === null || value === "") {
        return <MemoNASpan key={Math.random().toString(36).slice(2)}></MemoNASpan>;
    }
    return altValue != null ? altValue : value;
};

// the |any for accessor type is to handle custom types that build on 
// or wrap the default accessors (e.g., see GenomicsDB Record Table)
// not sure of the correct syntax


export const resolveColumnAccessor = (key: string, accessorType: ColumnAccessorType | any = "Default") => {
    const MemoSparkPercentageBarAccessor = React.memo(SparkPercentageBarAccessor);
    const MemoBooleanCheckAccessor = React.memo(BooleanCheckAccessor);
    const MemoColoredTextAccessor = React.memo(ColoredTextAccessor);
    const MemoDefaultTextAccessor = React.memo(DefaultTextAccessor);
    switch (accessorType) {
        case "PercentageBar":
            return (row: any) =>
                resolveNAs(
                    row[key],
                    <MemoSparkPercentageBarAccessor value={{ value: row[key], percentage: row[key] * 100 }} />
                );
        case "BooleanCheck":
            return (row: any) => <MemoBooleanCheckAccessor value={row[key]} />;
        case "ColoredText":
            return (row: any) => resolveNAs(row[key], <MemoColoredTextAccessor value={row[key]} htmlColor="red" />);
        case "Link":
            return (row: any) => resolveNAs(row[key], <MemoDefaultTextAccessor value={row[key]} />);
        case "ScientificNotation":
        case "Float":
        default:
            return (row: any) => resolveNAs(row[key], <MemoDefaultTextAccessor value={row[key]} />);
    }
};
