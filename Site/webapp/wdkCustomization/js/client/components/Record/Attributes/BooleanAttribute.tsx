import React from "react";

import { ColumnAccessor, BooleanCheckAccessor } from "@viz/Table/ColumnAccessors";

export const BooleanAttribute: React.SFC<ColumnAccessor> = ({ value, htmlColor }) => {
    return <BooleanCheckAccessor value={value} htmlColor="color"/>;
};
