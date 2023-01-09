import React, { useMemo, useState } from "react";
import { isObject, merge, forIn, indexOf, has, get } from "lodash";

import { Column } from "react-table";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { EncapsulatedTableContainer as TableContainer } from "@viz/Table";
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

import { TissueColumnFilter } from "@viz/GenomeBrowser/TrackSelector";
import { ConfigServiceResponse, TrackSelectorRow, TrackColumnConfig } from "@viz/GenomeBrowser/TrackSelector";

import { _trackSelectorTableProperties as properties } from "genomics-client/data/genome_browser/_trackSelector";
import { useWdkEffect } from "wdk-client/Service/WdkService";

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

        return resolvedTrack;
    });

    return data;
};

interface TrackSelector {
    columnConfig: TrackColumnConfig;
    data: any;
    browser: any;
    isOpen: boolean;
    handleClose: any;
    preSelectedTracks?: string[];
    handleTrackSelect?: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            width: "100%",
            minHeight: 500,
            //maxHeight: 1000,
            overflowY: "scroll",
            overflowX: "scroll",
        },
    })
);

export const TrackSelector: React.FC<TrackSelector> = ({
    columnConfig,
    data,
    isOpen,
    browser,
    handleClose,
    handleTrackSelect,
    preSelectedTracks,
}) => {
    const { columns, order } = columnConfig;
    const [open, setOpen] = useState<boolean>(isOpen);
    const [selectedTracks, setSelectedTracks] = useState<string[]>(preSelectedTracks ? preSelectedTracks : []);
    const classes = useStyles();
    const filterTypes = {
        global: useMemo(() => globalTextFilter, []),
    };

    const updateSelectedTracks = (tracks: any) => {
        setSelectedTracks(
            tracks.map((track: any) => {
                return track.original.track;
            })
        );
    };

    useWdkEffect(() => {
        handleTrackSelect(selectedTracks);
    }, [selectedTracks]);

    const buildColumns = () => {
        if (!data) {
            return [];
        }
        if (data.length === 0) {
            return [];
        } else {
            let columnFilters: any = get(properties, "filters", null);
            const accessors: any = get(properties, "accessors", null);
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

                if (defaultHiddenColumns && defaultHiddenColumns.includes(name)) {
                    tableColumn.show = false;
                }

                return tableColumn;
            });

            return selectorColumns;
        }
    };

    const defaultHiddenColumns = get(properties, "hiddenColumns");
    const hasHiddenColumns = defaultHiddenColumns ? true : false;
    const canToggleColumns = hasHiddenColumns || get(properties, "canToggleColumns", false);

    const selectorColumns: Column<{}>[] = useMemo(() => buildColumns(), [columnConfig]);

    const canFilter = get(properties, "canFilter", true); // default to true if missing
    const hasColumnFilters = properties.hasOwnProperty("filters");

    // component here
    return (
        <TableContainer
            className={classes.table}
            columns={selectorColumns}
            data={data}
            filterTypes={filterTypes}
            filterGroups={get(properties, "filterGroups", null)}
            canFilter={canFilter}
            canExport={false}
            showAdvancedFilter={hasColumnFilters}
            showHideColumns={canToggleColumns}
            requiredColumns={get(properties, "requiredColumns", null)}
            title="Genome Browser Track Selector"
            isOpen={open}
            handleClose={handleClose}
            onRowSelect={updateSelectedTracks}
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
