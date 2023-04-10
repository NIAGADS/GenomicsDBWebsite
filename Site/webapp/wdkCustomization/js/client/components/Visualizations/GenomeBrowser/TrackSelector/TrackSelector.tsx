import React, { useMemo, useState, useEffect, useLayoutEffect } from "react";
import { isObject, merge, indexOf, has, get, noop } from "lodash";
import classNames from "classnames";

import { Column } from "react-table";

import { TableOptions, TableProperties, useTableStyles } from "@viz/Table";
import { Table } from "@viz/Table/TableSections";
import { ColumnAccessorType, resolveColumnAccessor } from "@viz/Table/ColumnAccessors";

import {
    SelectColumnFilter,
    globalTextFilter,
    PieChartColumnFilter,
    CheckboxSelectColumnFilter,
    TypeAheadSelectColumnFilter,
    RadioSelectColumnFilter,
    FilterType,
} from "@viz/Table/TableFilters";

import {
    TissueColumnFilter,
    ConfigServiceResponse,
    TrackSelectorRow,
    TrackColumnConfig,
} from "@viz/GenomeBrowser/TrackSelector";

export const resolveSelectorData = (response: ConfigServiceResponse): TrackSelectorRow[] => {
    const expectedColumns = Object.keys(response.columns.columns);
    const data = response.tracks.map((track: { [x: string]: any }) => {
        let resolvedTrack: any = {};
        for (const k in track) {
            const value = track[k];
            if (isObject(value)) {
                resolvedTrack = merge(resolvedTrack, value);
            } else {
                resolvedTrack[k] = value;
            }
        }
        const missingColumns = expectedColumns.filter((x: string) => !(x in resolvedTrack));
        missingColumns.forEach((col) => {
            resolvedTrack[col] = null;
        });
        resolvedTrack["row_id"] = resolvedTrack["track"];
        return resolvedTrack;
    });

    return data;
};

interface TrackSelector {
    columnConfig: TrackColumnConfig;
    data: any;
    properties: TableProperties;
    handleTrackSelect: any;
    onSelectorLoad: any;
}

export const TrackSelector: React.FC<TrackSelector> = ({
    columnConfig,
    data,
    properties,
    handleTrackSelect,
    onSelectorLoad,
}) => {
    const { columns, order } = columnConfig;
    const [selectedTracks, setSelectedTracks] = useState<string[]>(null);
    const [options, setOptions] = useState<TableOptions>(_initializeTableOptions(properties));

    const classes = useTableStyles();

    useEffect(() => {
        // only want to handle track select if selected tracks were changed based
        // on interacting w/the selector
        selectedTracks != null && handleTrackSelect(selectedTracks);
    }, [selectedTracks]);

    const tableColumns = useMemo(() => {
        if (!data) {
            return [];
        }
        if (data.length === 0) {
            return [];
        } else {
            let columnFilters: any = get(properties, "filters", null);
            const accessors: any = get(properties, "accessors", null);
            const defaultHiddenColumns = get(properties, "hiddenColumns", null);

            let selectorColumns: Column<{}>[] = order.map((name) => {
                const header = columns[name];
                const accessorType: ColumnAccessorType =
                    accessors && accessors.hasOwnProperty(name)
                        ? accessors[name]
                        : name.includes("link")
                        ? "Link"
                        : "Default";

                let filterType = columnFilters && has(columnFilters, name) ? columnFilters[name] : null;
                let tableColumn = _buildColumn(name, header, accessorType);
                tableColumn = _addColumnFilters(tableColumn, filterType);

                if (options.showHideColumns && defaultHiddenColumns.includes(tableColumn.id)) {
                    tableColumn.show = false;
                }

                return tableColumn;
            });

            return selectorColumns;
        }
    }, [options]);

    return (
        <Table
            className={classNames(get(properties, "fullWidth", true) ? classes.fullWidth : "shrink", classes.table)}
            columns={tableColumns}
            data={data}
            onTableLoad={onSelectorLoad}
            title="Available Tracks"
            options={Object.assign(options, {
                canExport: false,
                rowSelect: {
                    label: "Display Track",
                    tooltip: "Toggle track display",
                    type: "MultiCheck",
                    action: handleTrackSelect,
                },
            })}
        />
    );
};

const _addColumnFilters = (column: any, filterType: FilterType) => {
    switch (filterType) {
        case "select":
            column.Filter = SelectColumnFilter;
            break;
        case "pie":
        case "boolean_pie":
            column.Filter = PieChartColumnFilter;
            break;
        case "tissue":
            column.Filter = TissueColumnFilter;
            break;
        case "radio_select":
            column.Filter = RadioSelectColumnFilter;
            break;
        case "checkbox_select":
            column.Filter = CheckboxSelectColumnFilter;
            break;
        case "typeahead_select":
            column.Filter = TypeAheadSelectColumnFilter;
            break;
        case null:
        default:
            return column;
    }

    column.filter = filterType;
    return column;
};

const _indexSort = (col1: Column, col2: Column, fields: string[]) => {
    const idx1 = indexOf(fields, col1.id),
        idx2 = indexOf(fields, col2.id);
    return idx2 > idx1 ? -1 : 1;
};

const _buildColumn: any = (name: string, header: string, accessorType: ColumnAccessorType) => ({
    Header: header,
    sortable: true,
    accessor: resolveColumnAccessor(name, accessorType),
    accessorType: accessorType,
    id: name,
    sortType: "alphanumeric",
});

const _initializeTableOptions = (properties: any) => {
    const filterTypes = {
        global: useMemo(() => globalTextFilter, []),
    };
    const hasHiddenColumns = get(properties, "hiddenColumns", null);
    const opts: TableOptions = {
        showAdvancedFilter: properties.hasOwnProperty("filters"),
        canFilter: get(properties, "canFilter", true), // default to true if missing
        filterTypes: filterTypes,
        filterGroups: get(properties, "filterGroups", null),
        showHideColumns: hasHiddenColumns || get(properties, "canToggleColumns", false),
        requiredColumns: get(properties, "requiredColumns", null),
    };

    return opts;
};
