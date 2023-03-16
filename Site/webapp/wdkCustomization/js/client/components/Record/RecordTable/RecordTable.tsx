import React, { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";
import { findIndex, has, get } from "lodash";
import classNames from "classnames";

import { Column } from "react-table";

import CircularProgress from "@material-ui/core/CircularProgress";

import { LocusZoomPlot, DEFAULT_FLANK as LZ_DEFAULT_FLANK } from "@viz/LocusZoom";
import { TableOptions, useTableStyles } from "@viz/Table";
import { Table } from "@viz/Table/TableSections";
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
    extractIndexedFieldValue,
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
import { nullValue } from "wdk-client/Utils/Json";

const MemoLocusZoomPlot = React.memo(LocusZoomPlot);

export const RecordTable: React.FC<RecordTableProps> = ({ table, data, properties, recordPrimaryKey }) => {
    const { attributes } = table;
    const classes = useTableStyles();

    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const [panelContents, setPanelContents] = useState<any>(null);
    const [options, setOptions] = useState<TableOptions>(_initializeTableOptions(table, properties));
    const [rowSelectTarget, setRowSelectTarget] = useState<string>(get(properties, "linkedPanel.column"));
    const [hasLinkedPanel, setHasLinkedPanel] = useState<boolean>(
        Object.keys(get(properties, "linkedPanel", {})).length > 0
    );

    const setLinkedPanelRenderer = (panelType: string) => {
        switch (panelType) {
            case "LocusZoom":
                return useMemo(() => {
                    const topVariant = extractIndexedFieldValue(data, rowSelectTarget, false, 0); // sorted so first row should be top hit
                    return projectId ? (
                        <MemoLocusZoomPlot
                            genomeBuild={projectId}
                            variant={topVariant}
                            track={recordPrimaryKey}
                            divId="record-table-locus-zoom"
                            population="ADSP"
                            setPlotState={setLocusZoomPlot}
                            className={classes.borderedLinkedPanel}
                        />
                    ) : (
                        <CircularProgress />
                    );
                }, [projectId]);
            default:
                return "Not yet implemented";
        }
    };

    const setLinkedPanelHelp = (panelType: string) => {
        switch (panelType) {
            case "LocusZoom":
                return "Click to center LocusZoom view on variant: ";
            default:
                return "Not yet implemented";
        }
    };

    const setLinkedPanelAction: any = (panelType: string) => {
        switch (panelType) {
            case "LocusZoom":
                return updateLocusZoomPlot;
            default:
                return null;
        }
    };

    const setLocusZoomPlot = useCallback(
        (plot: any) => {
            plot && setPanelContents(plot);
        },
        [panelContents]
    );

    const updateLocusZoomPlot = (targetVariant: string) => {
        const [chrm, position, ...rest] = targetVariant.split(":"); // chr:pos:ref:alt
        const start = parseInt(position) - LZ_DEFAULT_FLANK;
        const end = parseInt(position) + LZ_DEFAULT_FLANK;
        panelContents &&
            panelContents.applyState({
                chr: "chr" + chrm,
                start: start,
                end: end,
                ldrefvar: targetVariant,
            });
    };

    const columns: Column<{}>[] = useMemo(() => {
        if (!data) {
            // just so no calculations are done unless options are set
            return [];
        }
        if (data.length === 0) {
            return [];
        } else {
            let columnFilters: any = get(properties, "filters", null);
            let attributes: AttributeField[] = table.attributes;
            const accessors: any = get(properties, "accessors", null);
            const defaultHiddenColumns = get(properties, "hiddenColumns", null);

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

                    const userProps =
                        accessorType === "RowSelectButton"
                            ? {
                                  action: setLinkedPanelAction(get(properties, "linkedPanel.type")),
                                  tooltip: setLinkedPanelHelp(get(properties, "linkedPanel.type")),
                              }
                            : null;
                    let filterType =
                        columnFilters && has(columnFilters, attribute.name) ? columnFilters[attribute.name] : null;
                    let column = _buildColumn(attribute, accessorType, userProps);

                    if (attribute.help) {
                        column.help = attribute.help;
                    }

                    column = _setColumnBehavior(column, filterType, accessorType);

                    if (options.showHideColumns && defaultHiddenColumns.includes(column.id)) {
                        column.show = false;
                    }

                    return column;
                })
                .sort((c1, c2) => _indexSort(c1, c2, attributes));

            return columns;
        }
    }, [options, rowSelectTarget, data.length]);

    const resolvedData: any = useMemo(() => resolveData(data), [data.length]);

    if (data.length === 0 || columns.length === 0) {
        return (
            <p>
                <em>No data available</em>
            </p>
        );
    }

    return (
        <Table
            className={classNames(get(properties, "fullWidth", true) ? classes.fullWidth : "shrink", classes.table)}
            columns={columns}
            data={resolvedData}
            title={table.displayName}
            options={
                hasLinkedPanel
                    ? Object.assign(options, {
                          linkedPanel: {
                              type: get(properties, "linkedPanel.type"),
                              contents: setLinkedPanelRenderer(get(properties, "linkedPanel.type")),
                          },
                      })
                    : options
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
    return sortBy;
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
        case "RowSelectButton":
            //@ts-ignore
            column.disableGlobalFilter = true;
            delete column.sortType;
            column.canSort = false;
            column.disableSortBy = true;
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

const _buildColumn: any = (attribute: AttributeField, accessorType: ColumnAccessorType, userProps: any) => ({
    Header: attribute.displayName,
    canSort: attribute.isSortable,
    disable: attribute.isSortable,
    accessor:
        accessorType === "RowSelectButton"
            ? resolveColumnAccessor(attribute.name, accessorType, userProps)
            : resolveColumnAccessor(attribute.name, accessorType),
    accessorType: accessorType,
    id: attribute.name,
    sortType: "alphanumeric",
});

const _initializeTableOptions = (table: any, properties: any) => {
    const filterTypes = {
        pvalue: useMemo(() => negLog10pFilter, []),
        boolean_pie: useMemo(() => booleanFlagFilter, []),
        global: useMemo(() => globalTextFilter, []),
    };
    const hasHiddenColumns = get(properties, "hiddenColumns", null);
    const opts: TableOptions = {
        showAdvancedFilter: properties.hasOwnProperty("filters"),
        canFilter: get(properties, "canFilter", true), // default to true if missing
        initialFilters: _setInitialFilters(table, properties),
        initialSort: _setInitialSort(table, properties),
        filterTypes: filterTypes,
        filterGroups: get(properties, "filterGroups", null),
        showHideColumns: hasHiddenColumns || get(properties, "canToggleColumns", false),
        requiredColumns: get(properties, "requiredColumns", null),
    };

    return opts;
};
