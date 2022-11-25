import React from "react";
import { ColumnAccessor, ColoredTextAccessor } from "@viz/Table/ColumnAccessors";

export const VariantConsequenceImpactSpan: React.SFC<ColumnAccessor> = ({ value }) => {
    return <ColoredTextAccessor value={value} className={`impact-indicator ${value.toLowerCase()}`} />;
};
