import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { includes } from "lodash";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import RecordTableContainer from "../RecordTable/RecordTableContainer/RecordTableContainer";
import { CollapsibleSection, Tooltip } from "wdk-client/Components";
import { ErrorBoundary } from "wdk-client/Controllers";
import { clone } from "lodash";
import { BaseRecord } from "../../RecordPage/types";

interface INiagadsRecordTableSection {
  isCollapsed: boolean;
  record: BaseRecord;
  recordClass: any;
  requestPartialRecord?: any;
  onCollapsedChange: any;
  ontologyProperties: any;
  //from store
  table: any;
  urls?: { [key: string]: string };
}

const NiagadsRecordTableSection: React.SFC<INiagadsRecordTableSection> = ({
  isCollapsed,
  onCollapsedChange,
  record,
  recordClass,
  requestPartialRecord,
  table,
  urls
}) => {
  const requestedRef = useRef(false);

  useEffect(() => {
    if (isCollapsed || requestedRef.current) return;
    requestPartialRecord({
      tables: [name],
      attributes: Object.keys(record.attributes)
    });
    requestedRef.current = true;
  }, [isCollapsed]);

  const { name, displayName, description } = table,
    value = record.tables[name],
    isError = includes(record.tableErrors, name),
    isLoading = value == null,
    className = ["wdk-RecordTable", "wdk-RecordTable__" + table.name].join(" "),
    headerContent = (
      <div className="d-flex justify-between align-items-baseline">
        <p>{displayName}</p>
        {description && (
          <Tooltip
            content={safeHtml(_parseTemplate(description, urls))}
            showDelay={0}
            position={{
              my: "top left",
              at: "bottom right"
            }}
          >
            <span className="fa fa-question-circle-o table-help" />
          </Tooltip>
        )}
      </div>
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
          <p style={{ color: "darkred", fontStyle: "italic" }}>
            Unable to load data due to a server error.
          </p>
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
  urls: state.globalData.siteConfig.externalUrls
}))(NiagadsRecordTableSection);

const _parseTemplate = (content: string, urls: { [key: string]: string }) => {
  const regex = /(@\w+@)/gm;
  let m,
    res = clone(content);
  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const stripped = m[0].replace(/@/g, ""),
      val = urls[stripped];
    res = res.replace(m[0], val ? val : "");
  }
  return res;
};
