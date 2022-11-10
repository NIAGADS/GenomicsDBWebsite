import React, { ReactElement, useState } from "react";
import { TableInstance } from "react-table";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { CollapsableCardPanel } from "@components/MaterialUI";

type HideColumnProps<T extends Record<string, unknown>> = {
    instance: TableInstance<T>;
};

export function TableColumnsPanel<T extends Record<string, unknown>>({
    instance,
}: HideColumnProps<T>): ReactElement | null {
    const { allColumns, toggleHideColumn } = instance;
    const hideableColumns = allColumns.filter((column) => !(column.id === "_selector"));
    const checkedCount = hideableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0);

    const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length;

    return hideableColumns.length > 1 ? (
        <CollapsableCardPanel title="Add or Remove Columns">
            {hideableColumns.map((column) => (
                <FormControlLabel
                    key={column.id}
                    control={<Switch size="small" value={`${column.id}`} disabled={column.isVisible && onlyOneOptionLeft} />}
                    label={column.render("Header")}
                    checked={column.isVisible}
                    onChange={() => toggleHideColumn(column.id, column.isVisible)}
                    labelPlacement="start"
                    
                />
            ))}
        </CollapsableCardPanel>
    ) : null;
}
