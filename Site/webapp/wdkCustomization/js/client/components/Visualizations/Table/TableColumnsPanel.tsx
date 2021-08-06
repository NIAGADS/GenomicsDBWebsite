import { Checkbox, FormControlLabel, Grid, Typography, createStyles, makeStyles } from "@material-ui/core";
import React, { ReactElement } from "react";
import { TableInstance } from "react-table";

const useStyles = makeStyles(
    createStyles({
        columnsPopOver: {
            padding: 24,
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 198px)",
            "@media (max-width: 600px)": {
                gridTemplateColumns: "repeat(1, 160px)",
            },
            gridColumnGap: 6,
            gridRowGap: 6,
        },
    })
);

type HideColumnProps<T extends Record<string, unknown>> = {
    instance: TableInstance<T>;
};

export function TableColumnsPanel<T extends Record<string, unknown>>({
    instance,
}: HideColumnProps<T>): ReactElement | null {
    const classes = useStyles({});
    const { allColumns, toggleHideColumn } = instance;
    const hideableColumns = allColumns.filter((column) => !(column.id === "_selector"));
    const checkedCount = hideableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0);

    const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length;

    return hideableColumns.length > 1 ? (
        <Grid container style={{ paddingLeft: "20px" }}>
            <div className={classes.grid}>
                {hideableColumns.map((column) => (
                    <FormControlLabel
                        key={column.id}
                        control={<Checkbox value={`${column.id}`} disabled={column.isVisible && onlyOneOptionLeft} />}
                        label={column.render("Header")}
                        checked={column.isVisible}
                        onChange={() => toggleHideColumn(column.id, column.isVisible)}
                    />
                ))}
            </div>
        </Grid>
    ) : null;
}
