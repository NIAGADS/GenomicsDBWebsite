import React, { useMemo, useRef, useState } from "react";
import { groupBy, startCase, truncate, uniq as unique } from "lodash";

import { Column, TableInstance, HeaderProps } from "react-table";
import { TableField, TableValue, AttributeField } from "wdk-client/Utils/WdkModel";

import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";

import { findIndex, has, get } from "lodash";
import { HelpIcon } from "wdk-client/Components";

import { SelectColumnFilter } from "@viz/Table/TableFilters/TableFilters";
import TableContainer /*, { SortIconGroup } */ from "@viz/Table/TableContainer";

import { fuzzyTextFilter, globalTextFilter, includesFilter } from "@viz/Table/TableFilters/filters";
import { PieChartFilter } from "@viz/Table/TableFilters";
import classNames from "classnames";
import { SortByAlpha } from "@material-ui/icons";

import { NiagadsBrowserTrackConfig } from "@components/GenomeBrowserPage/GenomeBrowserPage";
import { IgvTrackConfig } from "@viz/GenomeBrowser";

const DEFAULT_PVALUE_FILTER_VALUE = 5e-8;

const filterTypes = {
    global: globalTextFilter,
    fuzzyText: fuzzyTextFilter,
    pie: includesFilter,
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            /* minHeight: 500,
          maxHeight: 500,
          overflowY: "scroll",
          overflowX: "hidden" */
        },
        fullWidth: {
            width: "100%",
        },
    })
);

interface TrackTableProps {
    data: NiagadsBrowserTrackConfig[];
    activeTracks: string[];
    toggleTracks: (t: IgvTrackConfig[]) => void;
    loadingTrack: string;
}

export const TrackTable: React.FC<TrackTableProps> = ({ data, activeTracks, toggleTracks, loadingTrack }) => {
    const buildColumns = () => {
        let columns = [
            {
                id: "select",
                accessor: (row: any) => {
                    return (
                        <UnpaddedCheckbox
                            color="primary"
                            checked={activeTracks.includes(row.name)}
                            onChange={toggleTracks.bind(null, tracksToTrackConfigs([row]))}
                            disabled={!!loadingTrack}
                        />
                    );
                },
                Header: () => "Select",
                width: 50,
            } as Column,
        ].concat(
            _getColumns().map((col: Column) => {
                col.Header = () => startCase(col.id);
                col.accessor = (row: any) => {
                    if (col.id === "description") {
                        return <ShowMore str={row[col.id] ? row[col.id] : ""} />;
                    } else {
                        return row[col.id];
                    }
                };
                return col;
            })
        );
        return columns;
    };

    const columns: Column<{}>[] = useMemo(() => buildColumns(), [data]);

    //const initialFilters = _setInitialFilters(table);
    //const initialSort = _setInitialSort(table);

    const classes = useStyles();

    return (
        <TableContainer
            className={classes.fullWidth}
            columns={columns}
            data={data}
            filterTypes={filterTypes}
            canFilter={true}
            showAdvancedFilter={true}
            showHideColumns={true}
            title="Track Selection"
        />
    );
};

const _setInitialFilters = (table: TableField) => {
    let columnFilters: any = table.properties.column_filter ? JSON.parse(table.properties.column_filter[0]) : null;
    if (columnFilters && "pvalue" in columnFilters) {
        return { id: "pvalue", value: DEFAULT_PVALUE_FILTER_VALUE };
    }
    return null;
};

/*const _setInitialSort = (table: TableField) => {
    let sortBy: any = table.properties.sorted_by ? JSON.parse(table.properties.sorted_by[0]) : null;
    return useMemo(() => sortBy, []);
}; */

export const tracksToTrackConfigs = (tracks: NiagadsBrowserTrackConfig[]): IgvTrackConfig[] => {
    return tracks.map((track) => {
        const base = {
            displayMode: "expanded",
            format: track.format,
            url: track.url,
            indexURL: `${track.url}.tbi`,
            name: track.name,
            type: track.trackType,
            id: track.trackType,
            visibilityWindow: -1,
        } as IgvTrackConfig;
        if (track.reader) {
            base.reader = track.reader;
        }
        return base;
    });
};

/*
    
        let columnFilters: any = table.properties.column_filter ? JSON.parse(table.properties.column_filter[0]) : null;
       
   
            .map((k): Column => {
                const attribute: AttributeField = attributes.find((item) => item.name === k);
                let filterType =
                columnFilters && has(columnFilters, attribute.name) ? columnFilters[attribute.name] : null;
                let column = _buildColumn(attribute, attribute.isSortable, filterType);
                //@ts-ignore
                if (column.id.endsWith("link")) column.sortType = linkColumnSort;
             

                if (column.id.includes("flag")) {
                    //@ts-ignore
                    column.sortType = flagColumnSort;
                    //@ts-ignore
                    column.disableGlobalFilter = true;
                    if (filterType && filterType === "pie") {
                        filterType = "booleanPie";
                    }
                }

                if (filterType) {
                    //@ts-ignore
                    column = _addColumnFilters(column, filterType);
                }

                if (defaultHiddenColumns && defaultHiddenColumns.includes(column.id)) {
                    //@ts-ignore
                    column.show = false
                }

                return column;
            })

*/

const _addColumnFilters = (column: Column, filterType: string) => {
    if (filterType === "select") {
        //@ts-ignore
        column.Filter = SelectColumnFilter;
    }
    if (filterType.toLowerCase().includes("pie")) {
        //@ts-ignore
        column.Filter = PieChartFilter;
    }

    if (filterType === "pvalue") {
        //@ts-ignore
        column.Filter = PValueFilter;
    }

    //@ts-ignore
    column.filter = filterType;

    return column;
};


const _getColumns = (): Column[] => [
    { id: "name", maxWidth: 300 } as Column,
    { id: "description" },
    { id: "source", width: 100 },
    { id: "featureType", width: 120 },
];


const _indexSort = (col1: Column, col2: Column, attributes: AttributeField[]) => {
    const idx1 = findIndex(attributes, (att) => att.name === col1.id),
        idx2 = findIndex(attributes, (att) => att.name === col2.id);
    return idx2 > idx1 ? -1 : 1;
};

export const UnpaddedCheckbox = withStyles(() => ({
    root: {
        padding: "0px",
    },
}))(Checkbox);

const ShowMore: React.FC<{ str: string }> = ({ str }) => {
    const [fullStringVisible, setFullStringVisible] = useState(false);

    if (str.length < 150) return <span>{str}</span>;

    return fullStringVisible ? (
        <span>
            {str}&nbsp;
            <span className="link" onClick={() => setFullStringVisible(false)}>
                less
            </span>
        </span>
    ) : (
        <span>
            {truncate(str, { length: 150 })}{" "}
            <span className="link" onClick={() => setFullStringVisible(true)}>
                more
            </span>
        </span>
    );
};



