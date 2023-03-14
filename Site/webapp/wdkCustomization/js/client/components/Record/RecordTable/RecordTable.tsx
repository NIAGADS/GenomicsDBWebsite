import React, { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";
import { findIndex, has, get } from "lodash";
import classNames from "classnames";

import { Column } from "react-table";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { LocusZoomPlot, DEFAULT_FLANK as LZ_DEFAULT_FLANK } from "@viz/LocusZoom";
import { TableContainer } from "@viz/Table";
import {
    SelectColumnFilter,
    RadioSelectColumnFilter,
    CheckboxSelectColumnFilter,
    TypeAheadSelectColumnFilter,
    globalTextFilter,
    PieChartColumnFilter,
} from "@viz/Table/TableFilters";

import {
    resolveColumnAccessor,
    resolveData,
    extractIndexedPrimaryKeyFromRecordLink,
    RecordTableProps,
    RecordTableColumnAccessorType as ColumnAccessorType,
    RecordTableProperties as TableProperties,
} from "@components/Record/RecordTable";

import {
    negLog10pFilter,
    booleanFlagFilter,
    PValueThresholdFilter as PValueFilter,
    DEFAULT_PVALUE_FILTER_VALUE,
} from "@components/Record/RecordTable/RecordTableFilters";

import { TableField, AttributeField } from "wdk-client/Utils/WdkModel";

const MemoLocusZoomPlot = React.memo(LocusZoomPlot);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            /* minHeight: 500,
          maxHeight: 500,
          overflowY: "scroll", */
        },
        lzPanel: {
            border: "2px solid #1f1f1f",
            padding: "20px",
            marginBottom: "10px",
        },
        fullWidth: {
            width: "100%",
            overflowX: "scroll",
        },
    })
);

export const RecordTable: React.FC<RecordTableProps> = ({ table, data, properties, recordPrimaryKey }) => {
    const { attributes } = table;
    const classes = useStyles();
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const [lzPlot, setLzPlot] = useState<any>(null);

    const filterTypes = {
        pvalue: useMemo(() => negLog10pFilter, []),
        boolean_pie: useMemo(() => booleanFlagFilter, []),
        global: useMemo(() => globalTextFilter, []),
    };

    const buildColumns = useCallback(() => {
        if (!data) {
            return [];
        }
        if (data.length === 0) {
            return [];
        } else {
            let columnFilters: any = get(properties, "filters", null);
            let attributes: AttributeField[] = table.attributes;
            const accessors: any = get(properties, "accessors", null);
            let columns: Column<{}>[] = Object.keys(data[0])
                .filter((k) => {
                    const attribute: AttributeField = attributes.find((item) => item.name === k);
                    return attribute && attribute.isDisplayable;
                })
                .map((k): Column => {
                    const attribute: AttributeField = attributes.find((item) => item.name === k);
                    const accessorType: ColumnAccessorType =
                        accessors && accessors.hasOwnProperty(attribute.name)
                            ? accessors[attribute.name]
                            : attribute.name.includes("link")
                            ? "Link"
                            : "Default";

                    let filterType =
                        columnFilters && has(columnFilters, attribute.name) ? columnFilters[attribute.name] : null;
                    let column = _buildColumn(attribute, accessorType);

                    if (attribute.help) {
                        column.help = attribute.help;
                    }

                    column = _setColumnBehavior(column, filterType, accessorType);

                    if (defaultHiddenColumns && defaultHiddenColumns.includes(column.id)) {
                        column.show = false;
                    }

                    return column;
                })
                .sort((c1, c2) => _indexSort(c1, c2, attributes));

            return columns;
        }
    }, [table]);

    const renderLocusZoom = (hasLZView: boolean) => {
        if (hasLZView) {
            const topVariant = getLocusZoomTargetVariant(0); // sorted so first row should be top hit
            return projectId ? (
                <MemoLocusZoomPlot
                    genomeBuild={projectId}
                    variant={topVariant}
                    track={recordPrimaryKey}
                    divId="record-table-locus-zoom"
                    population="ADSP"
                    setPlotState={setLocusZoomPlot}
                    className={classes.lzPanel}
                ></MemoLocusZoomPlot>
            ) : (
                <CircularProgress />
            );
        } else {
            return null;
        }
    };

    const setLocusZoomPlot = useCallback((plot:any) => { plot && setLzPlot(plot)}, [lzPlot]);

    const getLocusZoomTargetVariant = useCallback((index: number) => {
        return extractIndexedPrimaryKeyFromRecordLink(data, "variant_link", index);
    }, [data]);

    const updateLocusZoomPlot = useCallback(
        (index: number) => {
            const targetVariant = getLocusZoomTargetVariant(index);
            const [chrm, position, ...rest] = targetVariant.split(":"); // chr:pos:ref:alt
            const start = parseInt(position) - LZ_DEFAULT_FLANK;
            const end = parseInt(position) + LZ_DEFAULT_FLANK;
            lzPlot && lzPlot.applyState({
                chr: 'chr' + chrm,
                start: start,
                end: end,
                ldrefvar: targetVariant,
            });
        },
        [lzPlot]
    );

    const defaultHiddenColumns = get(properties, "hiddenColumns");
    const hasHiddenColumns = defaultHiddenColumns ? true : false;
    const canToggleColumns = hasHiddenColumns || get(properties, "canToggleColumns", false);

    const hasLocusZoomView = get(properties, "locusZoomView", false);
    const locusZoomView = useMemo(() => renderLocusZoom(hasLocusZoomView), [data]);

    const columns: Column<{}>[] = useMemo(() => buildColumns(), [table]);
    const resolvedData: any = useMemo(() => resolveData(data), [data]);

    const canFilter = get(properties, "canFilter", true); // default to true if missing
    const hasColumnFilters = properties.hasOwnProperty("filters");
    const initialFilters = _setInitialFilters(table, properties);
    const initialSort = _setInitialSort(table, properties);

    if (data.length === 0 || columns.length === 0) {
        return (
            <p>
                <em>No data available</em>
            </p>
        );
    }

    return (
        <TableContainer
            className={classNames(get(properties, "fullWidth", true) ? classes.fullWidth : "shrink", classes.table)}
            columns={columns}
            data={resolvedData}
            filterTypes={filterTypes}
            filterGroups={get(properties, "filterGroups", null)}
            canFilter={canFilter}
            showAdvancedFilter={hasColumnFilters}
            showHideColumns={canToggleColumns}
            requiredColumns={get(properties, "requiredColumns", null)}
            initialFilters={initialFilters}
            initialSort={initialSort}
            title={table.displayName}
            linkedPanel={
                hasLocusZoomView
                    ? {
                          contents: locusZoomView,
                          label: "LocusZoom",
                          select: {
                              action: updateLocusZoomPlot,
                              type: "Check",
                              tooltip: "Select to move LocusZoom View to this variant",
                          },
                      }
                    : null
            }
        />
    );
};

const _setInitialFilters = (table: TableField, properties: TableProperties) => {
    let columnFilters: any = get(properties, "filters", null);
    if (columnFilters && "pvalue" in columnFilters) {
        return { id: "pvalue", value: DEFAULT_PVALUE_FILTER_VALUE };
    }
    return null;
};

const _setInitialSort = (table: TableField, properties: TableProperties) => {
    let sortBy: any = get(properties, "sortedBy", null);
    return useMemo(() => sortBy, []);
};

const _setColumnBehavior = (column: any, filterType: string, accessorType: ColumnAccessorType = "Default") => {
    switch (accessorType) {
        case "BooleanGreenCheck":
        case "BooleanRedCheck":
        case "BooleanCheck":
            //@ts-ignore
            column.disableGlobalFilter = true;
            column.sortType = "booleanFlag";
            break;
        case "Link":
            column.sortType = "link";
            break;
        case "PercentageBar":
            //@ts-ignore
            column.disableGlobalFilter = true;
            column.sortType = "stackedBar";
            break;
        case "Float":
            column.disableGlobalFilter = true;
            break;
        case "ScientificNotation":
            //@ts-ignore
            column.disableGlobalFilter = true;
            column.sortType = "scientificNotation";
            break;
        default:
            // catch legacy links
            if (column.id.endsWith("link") || column.id.endsWith("links")) {
                column.sortType = "link";
            }
    }

    column = _addColumnFilters(column, filterType);
    return column;
};

const _addColumnFilters = (column: any, filterType: string) => {
    switch (filterType) {
        case "select":
            column.Filter = SelectColumnFilter;
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
        case "pie":
        case "boolean_pie":
            column.Filter = PieChartColumnFilter;
            break;
        case "pvalue":
            column.Filter = PValueFilter;
            break;

        case null:
        default:
            return column;
    }

    column.filter = filterType;
    return column;
};

const _indexSort = (col1: Column, col2: Column, attributes: AttributeField[]) => {
    const idx1 = findIndex(attributes, (att) => att.name === col1.id),
        idx2 = findIndex(attributes, (att) => att.name === col2.id);
    return idx2 > idx1 ? -1 : 1;
};

const _buildColumn: any = (attribute: AttributeField, accessorType: ColumnAccessorType) => ({
    Header: attribute.displayName,
    sortable: attribute.isSortable,
    accessor: resolveColumnAccessor(attribute.name, accessorType),
    accessorType: accessorType,
    id: attribute.name,
    sortType: "alphanumeric",
});
