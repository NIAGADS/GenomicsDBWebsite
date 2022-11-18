import React, { useMemo, useRef, useState } from "react";
import { groupBy, startCase, truncate, uniq as unique } from "lodash";

import { Column, TableInstance, HeaderProps } from "react-table";
import { TableField, TableValue, AttributeField } from "wdk-client/Utils/WdkModel";

import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";

import { findIndex, has, get } from "lodash";
import { HelpIcon } from "wdk-client/Components";

import { TableContainer } from "@viz/Table";
import { PieChartColumnFilter, SelectColumnFilter, fuzzyTextFilter, globalTextFilter, includesFilter } from "@viz/Table";

import classNames from "classnames";
import { SortByAlpha } from "@material-ui/icons";

import { IgvTrackConfig, RawTrackConfig, TrackSelectorColumnConfig } from "@viz/GenomeBrowser";
import { CircularProgress } from "@material-ui/core";

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
    data: RawTrackConfig[];
    activeTracks: string[];
    toggleTracks: (t: RawTrackConfig[], b: any) => void;
    loadingTrack: string;
    browser: any;
    selectorColumns: TrackSelectorColumnConfig[]
}

export const TrackTable: React.FC<TrackTableProps> = ({ data, activeTracks, toggleTracks, loadingTrack, browser, selectorColumns }) => {

    const DEFAULT_VISIBLE_COLUMNS = ['name', 'description', 'data_source', 'feature_type', 'track_type_display'];
    const TEXT_SEARCH_ONLY_COLUMNS = ['name', 'description', 'data_source', 'feature_type', 'track_type_display'];

    const _buildColumn = (field: TrackSelectorColumnConfig, sortable: boolean) => ({
        Header: field['header'],
        sortable,
        id: field['id']
        //sortType: defaultColumnSort,
    });


    const _buildColumns = () => {
        let columns: Column<{}>[] =
            [
                {
                    id: "select",
                    accessor: (row: any) => {
                        return (
                            !!loadingTrack ? <CircularProgress size="0.9rem"></ CircularProgress>
                                : <UnpaddedCheckbox
                                    color="primary"
                                    checked={activeTracks.includes(row.name)}
                                    onChange={toggleTracks.bind(null, tracksToTrackConfigs([row]), browser)}
                                //disabled={!!loadingTrack}
                                />
                        );
                    },
                    Header: () => "Select",
                    //@ts-ignore
                    disableGlobalFilter: true,
                    width: 50,
                } as Column,
            ].concat(
                selectorColumns.map((k): Column => {

                    let column = _buildColumn(k, true);

                    if (!TEXT_SEARCH_ONLY_COLUMNS.includes(column.id)) {
                        //@ts-ignore
                        column = _addColumnFilters(column, "pie");
                    }

                    if (DEFAULT_VISIBLE_COLUMNS.includes(column.id)) {
                        //@ts-ignore
                        column.show = false;
                    }

                    return column;
                }));

        return columns;
    };

    const buildColumns = () => {
        let columns = [
            {
                id: "select",
                accessor: (row: any) => {
                    return (
                        !!loadingTrack ? <CircularProgress size="0.9rem"></ CircularProgress>
                            : <UnpaddedCheckbox
                                color="primary"
                                checked={activeTracks.includes(row.name)}
                                onChange={toggleTracks.bind(null, tracksToTrackConfigs([row]), browser)}
                            //disabled={!!loadingTrack}
                            />
                    );
                },
                Header: () => "Select",
                //@ts-ignore
                disableGlobalFilter: true,
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

    const columns: Column<{}>[] = useMemo(() => _buildColumns(), [data]);



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



export const tracksToTrackConfigs = (tracks: RawTrackConfig[]): IgvTrackConfig[] => {

    return tracks.map((track) => {

        if (track.track === "REFSEQ_GENE") {
            return track as unknown as IgvTrackConfig;
        }

        const base =
            {
                displayMode: "expanded",
               // format: track.format,
                url: track.url,
                indexURL: `${track.url}.tbi`,
                name: track.name,
               // type: track.trackType,
                //id: track.trackType,
                supportsWholeGenome: false,
              //  visibilityWindow: track.trackType === 'variant' ? 1000000 : -1
            } as IgvTrackConfig;
       /* if (track.reader) {
            base.reader = track.reader;
        }*/
        return base;
    });
};


const _getColumns = (): Column[] => [
    { id: "name", maxWidth: 300 } as Column,
    { id: "description" },
    { id: "source", width: 100 },
    { id: "featureType", width: 120 },
];


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



