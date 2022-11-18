import React, { ReactElement, useState } from "react";
import { TableInstance } from "react-table";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { CollapsableCardPanel, LabelButton } from "@components/MaterialUI";
import Button from "@material-ui/core/Button";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";

type HideColumnProps<T extends Record<string, unknown>> = {
    instance: TableInstance<T>;
    requiredColumns: string[];
};

export function ToggleColumnsPanel<T extends Record<string, unknown>>({
    instance,
    requiredColumns,
}: HideColumnProps<T>): ReactElement | null {
    const { allColumns, toggleHideColumn } = instance;
    const hideableColumns = allColumns.filter((column) => !(column.id === "_selector"));
    const checkedCount = hideableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0);

    const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length;

    const renderHeader = (
        <LabelButton
            variant="text"
            color="default"
            startIcon={<ViewColumnIcon />}
            fullWidth={true}
            size="small"
            disableElevation
            disableRipple
        >
            Additional Columns
        </LabelButton>
    );

    return hideableColumns.length > 1 ? (
        <CollapsableCardPanel headerContents={renderHeader} borderedHeader={true}>
            <FormControl component="fieldset">
                <FormGroup>
                    {hideableColumns.map((column) => (
                        <FormControlLabel
                            key={column.id}
                            control={
                                <Switch
                                    size="small"
                                    value={`${column.id}`}
                                    disabled={
                                        (column.isVisible && onlyOneOptionLeft) || requiredColumns.includes(column.id)
                                    }
                                />
                            }
                            label={column.render("Header")}
                            checked={column.isVisible}
                            onChange={() => toggleHideColumn(column.id, column.isVisible)}
                            labelPlacement="start"
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </CollapsableCardPanel>
    ) : null;
}
