import React from "react";
import Typography from "@material-ui/core/Typography";

import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

export const LabeledBooleanAttribute: React.SFC<ColumnAccessor & { label: string }> = ({ value, className, label }) => {
    return value && ["true", "yes"].includes(value.toString().toLowerCase()) ? (
       <span className={`fa fa-check ${className}`}>{label}</span>
    ) : null;
};
