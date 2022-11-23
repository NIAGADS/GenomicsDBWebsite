import React from "react";

import { ColumnAccessor, DefaultTextAccessor } from "@viz/Table/ColumnAccessors";

export const LinkAttribute: React.SFC<ColumnAccessor> = ({ value }) => {
    return <DefaultTextAccessor value={value}/>;
};
