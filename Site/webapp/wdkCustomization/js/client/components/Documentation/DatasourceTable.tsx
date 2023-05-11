import React, { useMemo, useState, useEffect, useCallback } from "react";
import { webAppUrl } from "ebrc-client/config";

import classNames from "classnames";

import { Column } from "react-table";

import { TableOptions, useTableStyles } from "@viz/Table";
import { Table } from "@viz/Table/TableSections";
import WdkService, { useWdkEffect } from "wdk-client/Service/WdkService";
import { ColumnAccessorType, resolveColumnAccessor } from "../Visualizations/Table/ColumnAccessors";
import { toProperCase } from "genomics-client/util/util";
import { CircularProgress } from "@material-ui/core";

interface DatasourceTableProps {
    recordClass: string;
    category: string;
}

interface DatasourceRecord {
    resource: any;
    version: string;
    description: string;
    download_url: string;
    release_date: string;
    record_class: string;
    category: string;
}

const TABLE_COLUMNS = ["resource", "version", "release_date", "description", "download_url"];

export const DatasourceTable: React.FC<DatasourceTableProps> = ({ recordClass, category }) => {
    const classes = useTableStyles();
    const [data, setData] = useState<DatasourceRecord[]>(null);

    const options: TableOptions = useMemo(() => {
        return {
            showAdvancedFilters: false,
            canFilter: false,
            showHideColumns: false,
            hideToolbar: true,
            hideNavigation: true
        };
    }, []);

    useWdkEffect((service: WdkService) => {
        service
            ._fetchJson<DatasourceRecord[]>("get", `/dataset/reference?record=${recordClass}&category=${category}`)
            .then(setData)
            .catch(() => setData(null));
    }, []);

    const buildColumn: any = (name: string) => ({
        Header: toProperCase(name.replace(/_/g, " ")),
        canSort: true,
        accessor: resolveColumnAccessor(name, "Default"),
        accessorType: "Default",
        id: name,
        sortType: name === "resource" || name.endsWith("url") ? "link" : "alphanumeric",
    });

    const columns = useMemo(() => {
        if (!data) {
            // just so no calculations are done unless options are set
            return [];
        }
        if (data.length === 0) {
            return [];
        } else {
            let columns: Column<{}>[] = TABLE_COLUMNS.map((name): Column => {
                let column = buildColumn(name);

                if (name === "version" || name === "release_date") {
                    column.help =
                        "Resource versioning information.  One of a version, data freeze, DOI, official release date or download date.";
                }

                if (name === "download_url") {
                    column.help = "Link for original file download (may be an FTP site).";
                }

                return column;
            });

            return columns;
        }
    }, [data]);

    return data ? (
        data.length === 0 || columns.length === 0 ? (
            <p>
                <em>No data available</em>
            </p>
        ) : (
            <Table
                className={classNames(false ? classes.fullWidth : "shrink", classes.table)}
                columns={columns}
                data={data}
                title="Resources"
                options={options}
            />
        )
    ) : (
        <CircularProgress size="sm"></CircularProgress>
    );
};
