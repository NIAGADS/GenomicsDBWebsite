import React, { useMemo } from "react";
import { Column } from "react-table";
import { TableField, TableValue, AttributeField } from 'wdk-client/Utils/WdkModel';
import CustomTable /*, { SortIconGroup } */ from "../../Visualizations/Table/Table";
import { Box } from "@material-ui/core";
import { resolveAccessor, resolveData } from "./RecordTableUtils";
import { RecordTableProps } from './RecordTableTypes';
import { findIndex } from "lodash";
import { HelpIcon } from "wdk-client/Components";
import { linkColumnSort } from "./RecordTableSort";

const RecordTable: React.FC<RecordTableProps> = ({ table, data }) => {
    const { attributes } = table;
    const columns:Column<{}>[] = useMemo(() => _buildColumns(table, data), [table]);
    const resolvedData: any = useMemo(() => resolveData(data), [data]);
    return (
        <CustomTable columns={columns} data={resolvedData} />
    );
};

const _buildColumns = (table: TableField, data: TableValue) => {
    if (!data) {
        return [];
    }
    if (data.length === 0) {
        return [];
    } else {
        let attributes: AttributeField[] = table.attributes;
        let columns: Column<{}>[] = Object.keys(data[0])
            .filter((k) => {
                const attribute: AttributeField = attributes.find((item) => item.name === k);
                return attribute && attribute.isDisplayable;
            })
            .map(
                (k): Column => {
                    const attribute: AttributeField = attributes.find((item) => item.name === k);
                    const column = _buildColumn(attribute, attribute.isSortable);
                    //@ts-ignore
                    if (column.id.endsWith('link')) column.sortType = linkColumnSort;
                    return column;
                }
            ).sort((c1, c2) => _indexSort(c1, c2, attributes));

        return columns;
    }
};

const _buildColumn = (attribute: AttributeField, sortable: boolean, filterType?: any) => ({
    Header: _buildHeader(attribute),
    sortable,
    accessor: resolveAccessor(attribute.name, attribute.type),
    id: attribute.name,
    //sortType: recordTableSort,
    filterMethod: filterType ? filterType : (filter: any, rows: any) => rows,
});

const _buildHeader = (attribute: AttributeField) => {
    return (
        <Box>
            {attribute.help ? <HelpIcon>{attribute.help}</HelpIcon>: null}
            {attribute.help ? " ": null}
            {attribute.displayName}   
        </Box>
    );
};

const _indexSort = (col1: Column, col2: Column, attributes: AttributeField[]) => {
    const idx1 = findIndex(attributes, (att) => att.name === col1.id),
        idx2 = findIndex(attributes, (att) => att.name === col2.id);
    return idx2 > idx1 ? -1 : 1;
};

export default RecordTable;
