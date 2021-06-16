import React, { useMemo } from "react";
import { Column } from "react-table";
import { TableField, TableValue, AttributeField } from 'wdk-client/Utils/WdkModel';
import CustomTable /*, { SortIconGroup } */ from "../../Visualizations/Table/Table";
import { Grid, Box } from "@material-ui/core";
import { resolveAccessor, resolveData } from "./RecordTableUtils";
import { RecordTableProps } from './RecordTableTypes';

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
                    return _buildColumn(attribute, attribute.isSortable);
                }
            );

        return columns;
    }
};

const _buildColumn = (attribute: AttributeField, sortable: boolean, filterType?: any) => ({
    Header: _buildHeader(attribute),
    sortable,
    accessor: resolveAccessor(attribute.name, attribute.type),
    id: attribute.name,
    filterMethod: filterType ? filterType : (filter: any, rows: any) => rows,
});

const _buildHeader = (attribute: AttributeField) => {
    return (
        <Box>
            {attribute.displayName}{" "}
            {/* attribute.help ? <HelpIcon>{attribute.help}</HelpIcon> : null */}
            {/*attribute.isSortable && <SortIconGroup /> */}
        </Box>
    );
};

export default RecordTable;
