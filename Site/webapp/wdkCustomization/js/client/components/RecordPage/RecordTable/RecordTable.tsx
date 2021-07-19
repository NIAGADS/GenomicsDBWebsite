import React, { useMemo, useRef } from "react";
import { Column, TableInstance, HeaderProps } from "react-table";
import { TableField, TableValue, AttributeField } from 'wdk-client/Utils/WdkModel';
import CustomTable /*, { SortIconGroup } */ from "../../Visualizations/Table/Table";
import { Box } from "@material-ui/core";
import { resolveAccessor, resolveData } from "./RecordTableUtils";
import { RecordTableProps } from './RecordTableTypes';
import { findIndex, has } from "lodash";
import { HelpIcon } from "wdk-client/Components";
import { linkColumnSort, sciNotationColumnSort } from "./RecordTableSort";

import { SelectColumnFilter } from "../../Visualizations/Table/TableFilters/TableFilters";
import { useWdkEffect } from "wdk-client/Service/WdkService";

import { fuzzyRecordTableTextFilter } from './RecordTableFilter';

const RecordTable: React.FC<RecordTableProps> = ({ table, data, onLoad }) => {
    const { attributes } = table;

    const instance = useRef<TableInstance>();
    const columns:Column<{}>[] = useMemo(() => _buildColumns(table, data), [table]);
    const resolvedData: any = useMemo(() => resolveData(data), [data]);

    const hiddenFilterCol = {
        Header: () => <span />,
        id: "all",
        width: 0,
        resizable: false,
        sortable: false,
        Filter: (): null => null,
        filter: fuzzyRecordTableTextFilter,
        filterAll: true,
    };

    useWdkEffect(() => {
        onLoad(instance);
    }, [onLoad]);
    
    return (
        <CustomTable className={table.properties.canShrink ? "shrink" : ""} columns={columns} data={resolvedData} />
    );
};

const _buildColumns = (table: TableField, data: TableValue) => {
    if (!data) {
        return [];
    }
    if (data.length === 0) {
        return [];
    } else {
        let columnFilters:any = table.properties.column_filter ? JSON.parse(table.properties.column_filter[0]) : null;
        let attributes: AttributeField[] = table.attributes;
        let columns: Column<{}>[] = Object.keys(data[0])
            .filter((k) => {
                const attribute: AttributeField = attributes.find((item) => item.name === k);
                return attribute && attribute.isDisplayable;
            })
            .map(
                (k): Column => {
                    const attribute: AttributeField = attributes.find((item) => item.name === k);
                    const filterType = columnFilters && has(columnFilters, attribute.name) ? columnFilters[attribute.name] : null;
                    let column = _buildColumn(attribute, attribute.isSortable, filterType);
                    //@ts-ignore
                    if (column.id.endsWith('link')) column.sortType = linkColumnSort;
                    //@ts-ignore
                    if (column.id.includes('pvalue')) column.sortType = sciNotationColumnSort;
                    //@ts-ignore
                    if (filterType) { column = _addColumnFilters(column, filterType);}
                    return column;
                }
            ).sort((c1, c2) => _indexSort(c1, c2, attributes));

        return columns;
    }
};

const _addColumnFilters = (column: Column, filterType: string) => {
    if (filterType === 'select') {
        //@ts-ignore
        column.Filter = SelectColumnFilter;
        //@ts-ignore
        column.filter = 'customIncludes';
    }
    return column;
};

const _buildColumn = (attribute: AttributeField, sortable: boolean, filterType?: any) => ({
    Header: _buildHeader(attribute),
    sortable,
    accessor: resolveAccessor(attribute.name, attribute.type),
    id: attribute.name,
    //sortType: recordTableSort,
    //filter: filterType ? filterType : 'default',
    //Filter: 
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
