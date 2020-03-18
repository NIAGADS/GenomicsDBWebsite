import React, { useEffect, useCallback, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { HeaderRecordActions } from "./../Shared";
import * as gr from "./../../types";
import { resolveJsonInput } from "../../../../util/jsonParse";
import { convertHtmlEntites } from "../../../../util/util";
import { HelpIcon, LoadingOverlay } from "wdk-client/Components";
import {
  SubmissionMetadata,
  submitQuestion,
  updateParamValue,
  updateActiveQuestion
} from "wdk-client/Actions/QuestionActions";
import { QuestionState } from "wdk-client/StoreModules/QuestionStoreModule";

const SEARCH_NAME = "gwas_stats";
const PVALUE_PARAM_NAME = "pvalue";

interface StoreProps {
  externalUrls: { [key: string]: any };
  webAppUrl: string;
  questionState: QuestionState;
}

interface IRecordHeading {
  record: gr.GWASDatasetRecord;
  recordClass: { [key: string]: any };
  headerActions: gr.HeaderActions[];
}

interface SearchProps {
  questionState: QuestionState;
}

type GWASDatasetRecord = StoreProps & gr.GWASDatasetRecord;

const GWASDatasetSearchHelp: React.SFC<any> = props => {
  return (
    <div>
      <p>
        Set the adjusted p-value threshold for GWAS significant. The search will
        return all genes supported by an p-value &le; the specified threshold.
      </p>
      <p>
        p-values may be specified in decimal (e.g., 0.000003) or scientific
        (e.g., 3e-6 or 3^-6 or 3 x 10^-6) notation.
      </p>
      <p>For exome array studies a p-value threshold of 1e-3 is recommended.</p>
    </div>
  );
};

const GWASDatasetSearch: React.FC<SearchProps> = ({ questionState }) => {
  //const [activeQuestion, setActionQuestion] = useState(null),
  const [error, setError] = useState(false),
    submissionMetadata: SubmissionMetadata = { type: "create-strategy" },
    dispatch = useDispatch();

  let handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      dispatch(submitQuestion({ searchName: SEARCH_NAME, submissionMetadata }));
    },
    [SEARCH_NAME, submissionMetadata]
  );

  let handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      //drop whitespace to simplify regex
      const val = event.target.value.replace(/ /g, ""),
        re = new RegExp(/(^\d(e|\^|x10\^)?-\d$)|(^((\d)?\.)\d+$)/);

      if (!re.test(val)) {
        return setError(true);
      }

      setError(false);

      dispatch(
        updateParamValue({
          searchName: SEARCH_NAME,
          parameter: questionState.question.parametersByName["pvalue"],
          paramValues: questionState.paramValues,
          paramValue: event.target.value
        })
      );
    },
    [questionState]
  );

  return (
    <>
      <form className="form-inline" onSubmit={handleSubmit}>
        <div className="input-group mb-3 d-flex align-items-center">
          <div className="input-group-prepend mr-2">Mine this dataset
            <span className="help-block">
              <HelpIcon>
                <GWASDatasetSearchHelp />
              </HelpIcon>
            </span>
          </div>
          <input
            type="text"
            className="form-control input-sm"
            onFocus={e => e.target.select()}
            name={PVALUE_PARAM_NAME}
            defaultValue="5e-8"
            placeholder={"5e-8"}
            onChange={handleChange}
          />
          <div className="input-group-append">
            <button
              disabled={error}
              className="btn btn-outline-secondary"
              type="submit"
            >
              <i className="fa fa-search" />
            </button>
          </div>

        </div>
      </form>
      {error && (
        <p className="red">
          Please enter a valid p-value, e.g., 0.0007, 3e-6, 3^-6, 3x10^-6
        </p>
      )}
      {questionState.submitting && (
        <LoadingOverlay>
          <span>Loading Data...</span>
        </LoadingOverlay>
      )}
    </>
  );
};

const GWASDatasetRecordSummary: React.SFC<IRecordHeading &
  StoreProps> = props => {
    const { record, recordClass, headerActions, questionState } = props;

    const dispatch = useDispatch();
    useEffect(() => {
      const initialParamData = {
        gwas_accession: record.attributes.niagads_accession,
        gwas_dataset: record.id[0].value,
        pvalue: "5e-8"
      };
      dispatch(
        updateActiveQuestion({
          searchName: SEARCH_NAME,
          autoRun: false,
          initialParamData: initialParamData,
          stepId: undefined
        })
      );
    }, []);

    return (
      <React.Fragment>
        <div className="record-summary-container dataset-record-summary-container">
          <div>
            <HeaderRecordActions
              record={record}
              recordClass={recordClass}
              headerActions={headerActions}
            />
            <h1 className="record-heading">
              Dataset: {record.attributes.name}{" "}
            </h1>
          </div>
          <h2>{convertHtmlEntites(record.attributes.name)} &nbsp;({record.attributes.attribution})</h2>

          <ul>
            <li>
              <h5 className="dataset-subtitle">
                {record.attributes.description}
              </h5>
            </li>
            <li>
              <span className="label">Category:</span> {recordClass.displayName}
            </li>
            <li>
              <span className="label">Explore related datasets:</span>
              {resolveJsonInput(record.attributes.accession_link)}{" "}
            </li>
          </ul>
          {record.attributes.is_adsp && (
            <h2><strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp)}</strong></h2>
          )}

          <GWASDatasetSearch questionState={questionState}></GWASDatasetSearch>
        </div>
      </React.Fragment>
    );
  };

const enhance = connect<StoreProps, any, IRecordHeading>((state: any) => ({
  externalUrls: state.globalData.siteConfig.externalUrls,
  webAppUrl: state.globalData.siteConfig.webAppUrl,
  questionState: (state.question.questions[SEARCH_NAME] || {}) as QuestionState
}));

export default enhance(GWASDatasetRecordSummary);
