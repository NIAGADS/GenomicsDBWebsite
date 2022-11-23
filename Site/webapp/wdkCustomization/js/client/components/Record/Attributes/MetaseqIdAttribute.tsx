import React from "react";

import { ColumnAccessor, DefaultTextAccessor } from "@viz/Table/ColumnAccessors";

// this will handle large ones that need to be truncated
export const MetaseqIdAttribute: React.SFC<ColumnAccessor> = ({ value }) => {
    return <DefaultTextAccessor value={value} maxLength={30}/>;
};
