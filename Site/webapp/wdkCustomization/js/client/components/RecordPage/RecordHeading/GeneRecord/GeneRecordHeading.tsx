import React from "react";
import { connect } from "react-redux";
import { RecordHeading } from "wdk-client/Components";
import { HeaderRecordActions, RecordOutLink } from "./../Shared";
import * as gr from "./../../types";
import {
  resolveJsonInput,
  LinkType,
  withTooltip
} from "../../../../util/jsonParse";

interface StoreProps {
  externalUrls: { [key: string]: any };
  webAppUrl: string;
}

const enhance = connect<StoreProps, any, IRecordHeading>((state: any) => ({
  externalUrls: state.globalData.siteConfig.externalUrls,
  webAppUrl: state.globalData.siteConfig.webAppUrl
}));

interface IRecordHeading {
  record: gr.GeneRecord;
  recordClass: { [key: string]: any };
  headerActions: gr.HeaderActions[];
}

type GeneRecordSummary = StoreProps & gr.GeneRecord;

const GeneRecordSummary: React.SFC<IRecordHeading & StoreProps> = props => {
  const { record, recordClass, headerActions, externalUrls } = props;
  return (
    <React.Fragment>
      <div className="record-summary-container gene-record-summary-container">
        <div>
          <HeaderRecordActions
            record={record}
            recordClass={recordClass}
            headerActions={headerActions}
          />
          <h1 className="record-heading">
            {recordClass.displayName}: {record.displayName}
          </h1>
        </div>
        <h2>
          {record.displayName} - {record.attributes.source_id}
        </h2>
        <ul>
          <li>
            <h4 className="subtitle">{record.attributes.gene_name}</h4>
          </li>
          
          {record.attributes.synonyms && <li><span className="label">Also known as: {record.attributes.synonyms}</span></li>}
          
          <li>
            <span className="label">Gene Type</span>:{" "}
            {record.attributes.gene_type}
          </li>
          {record.attributes.ad_evidence_flag && (
            <li>
              <span className="label">Genetic Evidence for AD?</span>&nbsp;YES
            </li>
          )}
        </ul>

      </div>
    </React.Fragment>
  );
};

export default enhance(GeneRecordSummary);

interface LabeledLinkOuts {
  linkOutJson: string;
  direction: "horizontal" | "vertical";
}

interface LabeledLinkOutGroupItem {
  key: string;
  value: LinkType;
}

interface LabeledLinkOutGroup {
  data: LabeledLinkOutGroupItem[];
}

const LabeledLinkOuts: React.SFC<LabeledLinkOuts> = props => {
  const { linkOutJson, direction } = props,
    classnames =
      "link-list d-flex" + direction === "vertical" ? "flex-column" : "",
    linkoutObj = (resolveJsonInput(
      linkOutJson
    ) as unknown) as LabeledLinkOutGroup;
  return (
    <ul className={classnames}>
      {linkoutObj.data.map(link => (
        <li key={link.key}>
          <span className="label">{link.key}</span>:&nbsp;
          <RecordLinkOut link={link.value} />
        </li>
      ))}
    </ul>
  );
};

interface RecordLinkOuts {
  linkOutJson: string;
  type?: "badge" | "link";
  direction?: "horizontal" | "vertical";
}

const RecordLinkOuts: React.SFC<RecordLinkOuts> = props => {
  const { linkOutJson, type, direction } = props,
    input = JSON.parse(linkOutJson) as LinkType[],
    classnames =
      "link-list d-flex" + direction === "vertical" ? "flex-column" : "";
  return (
    <ul className={classnames}>
      {input.map(link => (
        <li key={link.url}>
          <RecordLinkOut link={link} type={type} />
        </li>
      ))}
    </ul>
  );
};

interface RecordLinkOut {
  link: LinkType;
  type?: "badge" | "link";
}

const RecordLinkOut: React.SFC<RecordLinkOut> = props => {
  const { link, type } = props,
    classnames = type === "badge" ? "badge" : "wdk-Link";
  return withTooltip(
    <a className={classnames} href={link.url}>
      {link.value}
    </a>,
    link.tooltip,
    "d-flex"
  );
};
