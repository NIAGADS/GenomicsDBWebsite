import React from "react";
import { ColumnAccessor, ColoredSpan } from "@viz/Table/ColumnAccessors";

export const VariantConsequenceImpactSpan: React.SFC<ColumnAccessor> = ({ value }) => {
    return <ColoredSpan value={value} className={`impact-indicator ${value.toLowerCase()}`} />;
};
