import React from "react";
import * as GR from "./../../../types";
import { resolveObjectInput } from "./../../../../../util/jsonParse";

interface ConsequenceSummary {
  [key: string]: {
    gene_link: { [key: string]: any };
    transcript_links: { [key: string]: any }[];
  }[];
}

const VariantTranscriptConsequencesSummary: React.SFC<{
  record: GR.VariantRecord;
}> = props => {
  const { attributes } = props.record,
    { transcript_consequence_summary } = attributes,
    consequences = JSON.parse(
      transcript_consequence_summary
    ) as ConsequenceSummary[];
  return +attributes.num_impacted_transcripts > 0 ? (
    <div className="consequence-summary-container">
      <p>
        This variant is colocated with {attributes.num_impacted_transcripts}
        &nbsp;transcript{+attributes.num_impacted_transcripts > 1 ? "s" : ""}
        &nbsp;in {attributes.num_impacted_genes}
        &nbsp;gene{+attributes.num_impacted_genes > 1 ? "s" : ""}, with the
        following predicted effects:
      </p>
      <div className="consequence-details">
        {consequences.map(consequence => {
          const key = Object.keys(consequence)[0];
          return (
            <div key={key} className="consequence-section">
              <p>{key}</p>
              {consequence[key].map((cons, i) => {
                return (
                  <div key={i}>
                    {resolveObjectInput(cons.gene_link)}&nbsp;-&nbsp;
                    {cons.transcript_links.map((link, i) => (
                      <span key={i}>{resolveObjectInput(link)}&nbsp;</span>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default VariantTranscriptConsequencesSummary;
