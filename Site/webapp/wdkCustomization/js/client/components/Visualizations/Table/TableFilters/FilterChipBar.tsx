// credit to https://github.com/ggascoigne/react-table-example
// @ts-nocheck -- react-table type issues / should be fixed in v8
import React, { ReactElement, useCallback } from "react";
import { Chip, createStyles, makeStyles } from "@material-ui/core";
import { ColumnInstance, FilterValue, IdType, TableInstance } from "react-table";
import { negLog10p } from "../../../RecordPage/RecordTable/RecordTableFilters/filters";

const useStyles = makeStyles(
    createStyles({
        filtersActiveLabel: {
            color: "#998",
            fontSize: "14px",
            paddingRight: 10,
        },
        chipZone: {
            padding: "18px 0 5px 10px",
            width: "100%",
        },
        chipLabel: {
            fontWeight: 500,
            marginRight: 5,
        },
        filterChip: {
            marginRight: 4,
            color: "#222",
        },
    })
);

type FilterChipBarProps<T extends Record<string, unknown>> = {
    instance: TableInstance<T>;
};

const getFilterValue = (column: ColumnInstance<any>, filterValue: FilterValue) => {
    switch (column.filter) {
        case "between":
            const min = filterValue[0];
            const max = filterValue[1];
            return min ? (max ? `${min}-${max}` : `>=${min}`) : `<=${max}`;
    }
    return filterValue;
};

export function FilterChipBar<T extends Record<string, unknown>>({
    instance,
}: FilterChipBarProps<T>): ReactElement | null {
    const classes = useStyles({});
    const {
        allColumns,
        setFilter,
        state: { filters },
    } = instance;
    const handleDelete = useCallback(
        (id: string | number) => {
            setFilter(id as IdType<T>, undefined);
        },
        [setFilter]
    );

    return Object.keys(filters).length > 0 ? (
        <div className={classes.chipZone}>
            <span className={classes.filtersActiveLabel}>Active filters:</span>
            {filters &&
                allColumns.map((column) => {
                    const filter = filters.find((f) => f.id === column.id);
                    const value = filter && filter.value;
                    return (
                        value && (
                            <Chip
                                className={classes.filterChip}
                                key={column.id}
                                label={
                                    <>
                                        <span className={classes.chipLabel}>{column.render("Header")}: </span>
                                        {getFilterValue(column, value)}
                                    </>
                                }
                                onDelete={() => handleDelete(column.id)}
                                variant="outlined"
                            />
                        )
                    );
                })}
        </div>
    ) : null;
}
