import React from "react";
import { Column } from "react-table";

import { DEFAULT_PVALUE_FILTER_VALUE  } from "@components/Record/RecordTable";
import { NumberThresholdColumnFilter } from "@viz/Table/TableFilters";


//@ts-ignore
export function PValueThresholdFilter<T extends Record<string, unknown>>({
    columns,
    column,
}: {
    columns: Column[];
    column: Column;
}) {
    //@ts-ignore
    const { id, filterValue, setFilter, render, preFilteredRows, target } = column;
    const validateValue = (value: string) => {
        if (!value) {
            return true;
        }

        const eNotationRegex = /\d+e-\d+/g;
        if (value.includes("e")) {
            if (value.match(eNotationRegex) != null) {
                return true;
            } else {
                return false;
            }
        }

        if (parseFloat(value) > 1.0 || parseFloat(value) < 0.0) {
            return false;
        }

        return true;
    };

  
    return (
      <NumberThresholdColumnFilter columns={columns} column={column} defaultValue={DEFAULT_PVALUE_FILTER_VALUE} validator={validateValue} />
    );
}
