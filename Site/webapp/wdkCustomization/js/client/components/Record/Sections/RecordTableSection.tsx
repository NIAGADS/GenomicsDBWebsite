import { includes, get } from "lodash";
import React from "react";
import { useEffect, useRef } from "react";
import CollapsibleSection from "wdk-client/Components/Display/CollapsibleSection";
import ErrorBoundary from "wdk-client/Core/Controllers/ErrorBoundary";
import { CategoryTreeNode } from "wdk-client/Utils/CategoryUtils";
import { TableField, RecordInstance, RecordClass } from "wdk-client/Utils/WdkModel";
import RecordTableDescription from "wdk-client/Views/Records/RecordTable/RecordTableDescription";
import { PartialRecordRequest } from "wdk-client/Views/Records/RecordUtils";
import { DefaultSectionTitle } from "wdk-client/Views/Records/SectionTitle";

import { makeStyles, createStyles, Theme } from "@material-ui/core";

import RecordTable from "../RecordTable/RecordTable";
import {_tableProperties, _defaultTableProperties} from "genomics-client/data/record_properties/_recordTableProperties";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minHeight: 500,
        },
    })
);

export interface RecordTableSection {
    table: TableField;
    isCollapsed: boolean;
    onCollapsedChange: () => void;
    ontologyProperties: CategoryTreeNode["properties"];
    record: RecordInstance;
    recordClass: RecordClass;
    requestPartialRecord: (request: PartialRecordRequest) => void;
    title?: React.ReactNode;
}

/** Record table section on record page */
function RecordTableSection(props: RecordTableSection) {
    let { table, record, recordClass, isCollapsed, onCollapsedChange, requestPartialRecord, title } = props;
    let { displayName, description, name } = table;
    let data = record.tables[name];
    let properties = get(_tableProperties[recordClass.displayName], name, _defaultTableProperties);
    let isError = includes(record.tableErrors, name);
    let isLoading = data == null;

    const classes = useStyles();
     
    const requestedRef = useRef(false);

    useEffect(() => {
        if (isCollapsed || requestedRef.current) return;
        requestPartialRecord({ tables: [name] });
        requestedRef.current = true;
    }, [isCollapsed]);

    const headerContent = title ?? <DefaultSectionTitle displayName={displayName} help={description} />;

    return (
        <CollapsibleSection
            id={name}
            className="wdk-RecordTableContainer"
            headerContent={headerContent}
            isCollapsed={isCollapsed}
            onCollapsedChange={onCollapsedChange}
        >
            <ErrorBoundary>
                {/* <RecordTableDescription table={table} record={record} recordClass={recordClass}/> */}
                {isError ? (
                    <p style={{ color: "darkred", fontStyle: "italic" }}>Unable to load data due to a server error.</p>
                ) : isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <RecordTable data={data} table={table} properties={properties} />
                )}
            </ErrorBoundary>
        </CollapsibleSection>
    );
}

export default RecordTableSection;
