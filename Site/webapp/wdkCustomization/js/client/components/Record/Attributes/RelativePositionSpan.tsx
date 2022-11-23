import React from "react";

import { ColumnAccessor, ColoredSpan } from "@viz/Table/ColumnAccessors";

export const RelativePositionSpan: React.SFC<ColumnAccessor> = ({ value }) => {
    const className = value.includes("in") || value.includes("overlap") ? "colocated" : value.toLowerCase();

    return <ColoredSpan value={value} className={`position-indicator ${className}`} />;
};
