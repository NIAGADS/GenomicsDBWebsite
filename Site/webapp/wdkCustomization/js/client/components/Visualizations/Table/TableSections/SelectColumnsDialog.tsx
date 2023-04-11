import React, { ReactElement, useState } from "react";

import { TableInstance } from "react-table";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import { ROW_SELECTION_FIELD } from "@viz/Table";

type HideColumnProps<T extends Record<string, unknown>> = {
    instance: TableInstance<T>;
    requiredColumns: string[];
    handleClose: any;
    isOpen: boolean;
};

export function SelectColumnsDialog<T extends Record<string, unknown>>({
    instance,
    isOpen,
    requiredColumns,
    handleClose,
}: HideColumnProps<T>): ReactElement | null {
    const { allColumns, toggleHideColumn } = instance;
    const hideableColumns = allColumns.filter((column) => !(column.id === ROW_SELECTION_FIELD));
    const checkedCount = hideableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0);

    const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length;

    return (
        <Dialog maxWidth="xs" aria-labelledby="dialog-title" open={isOpen} onClose={handleClose}>
            <DialogTitle id="dialog-title">Add or Remove Columns</DialogTitle>
            <DialogContent dividers>
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
                                            (column.isVisible && onlyOneOptionLeft) ||
                                            (requiredColumns && requiredColumns.includes(column.id))
                                        }
                                    />
                                }
                                label={column.render("Header")}
                                checked={column.isVisible}
                                onChange={() => toggleHideColumn(column.id, column.isVisible)}
                                labelPlacement="end"
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
