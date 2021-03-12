import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { includes } from "lodash";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { RecordClass } from "wdk-client/Utils/WdkModel";
import RecordTableContainer from "../RecordTable/RecordTableContainer/RecordTableContainer";
import { CollapsibleSection, HelpIcon } from "wdk-client/Components";
import { ErrorBoundary } from "wdk-client/Controllers";
import { BaseRecord, Table } from "../../RecordPage/types";
import { Box } from "@material-ui/core";
import { BaseText } from "../../Shared";

interface NiagadsRecordTableSection {
    isCollapsed: boolean;
    record: BaseRecord;
    recordClass: RecordClass;
    requestPartialRecord?: any;
    onCollapsedChange: any;
    ontologyProperties: any;
    //from store
    table: Table;
    urls?: { [key: string]: string };
}

const NiagadsRecordTableSection: React.SFC<NiagadsRecordTableSection> = ({
    isCollapsed,
    onCollapsedChange,
    record,
    recordClass,
    requestPartialRecord,
    table,
}) => {
    const requestedRef = useRef(false);

    useEffect(() => {
        if (isCollapsed || requestedRef.current) return;
        requestPartialRecord({
            tables: [name],
            attributes: Object.keys(record.attributes),
        });
        requestedRef.current = true;
    }, [isCollapsed]);

    const { name, displayName, description } = table,
        value = record.tables[name],
        isError = includes(record.tableErrors, name),
        isLoading = value == null,
        className = ["wdk-RecordTable", "wdk-RecordTable__" + table.name].join(" "),
        headerContent = (
            <Box display="flex" justifyContent="space-between" alignItems="baseline">
                <BaseText variant="caption">{displayName}</BaseText>
                {description && <HelpIcon>{safeHtml(description)}</HelpIcon>}
            </Box>
        );

    return (
        <CollapsibleSection
            id={name}
            className="wdk-RecordTableContainer"
            headerContent={headerContent}
            isCollapsed={isCollapsed}
            onCollapsedChange={onCollapsedChange}
        >
            <ErrorBoundary>
                {isError ? (
                    <BaseText color="error">
                        <em>Unable to load data due to a server error.</em>
                    </BaseText>
                ) : isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <RecordTableContainer
                        className={className}
                        value={value}
                        table={table}
                        record={record}
                        recordClass={recordClass}
                    />
                )}
            </ErrorBoundary>
        </CollapsibleSection>
    );
};

export default connect((state: any) => ({
    urls: state.globalData.siteConfig.externalUrls,
}))(NiagadsRecordTableSection);
