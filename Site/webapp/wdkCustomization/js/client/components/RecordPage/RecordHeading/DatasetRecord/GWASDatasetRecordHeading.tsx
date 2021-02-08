import React, { useEffect, useCallback, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { HeaderRecordActions } from "./../Shared";
import * as gr from "./../../types";
import { resolveJsonInput } from "../../../../util/jsonParse";
import { convertHtmlEntites } from "../../../../util/util";
import { HelpIcon, LoadingOverlay } from "wdk-client/Components";

const SEARCH_PATH = "../../search/gwas_summary/filter";
const PVALUE_PARAM_NAME = "param.pvalue";
const ACCESSION_PARAM_NAME = "param.gwas_accession";
const DATASET_PARAM_NAME = "param.gwas_dataset";

interface StoreProps {
    externalUrls: { [key: string]: any };
    webAppUrl: string;
}

interface IRecordHeading {
    record: gr.GWASDatasetRecord;
    recordClass: { [key: string]: any };
    headerActions: gr.HeaderActions[];
}

interface SearchProps {
    record: string;
    accession: string;
}

type GWASDatasetRecord = StoreProps & gr.GWASDatasetRecord;

const GWASDatasetSearchHelp: React.SFC<any> = (props) => {
    return (
        <div>
            <p>
                Set the adjusted p-value threshold for GWAS significance. The search will return all genes supported by
                a p-value &le; the specified threshold.
            </p>
            <p>
                p-values may be specified in decimal (e.g., 0.000003) or scientific (e.g., 3e-6 or 3^-6 or 3 x 10^-6)
                notation.
            </p>
            <p>For exome array studies a p-value threshold of 1e-3 is recommended.</p>
        </div>
    );
};

const GWASDatasetSearch: React.FC<SearchProps> = ({ record, accession }) => {
    //const [activeQuestion, setActionQuestion] = useState(null),
    const [error, setError] = useState(false);

    let handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        //drop whitespace to simplify regex
        const val = event.target.value.replace(/ /g, ""),
            re = new RegExp(/(^\d(e|\^|x10\^)?-\d$)|(^((\d)?\.)\d+$)/);

        if (!re.test(val)) {
            return setError(true);
        }

        setError(false);
    }, []);

    return (
        <>
            <h4>Mine this dataset</h4>
            <form className="form-inline" action={SEARCH_PATH}>
                <div className="input-group mb-3 d-flex align-items-center">
                    {" "}
                    p-value &le;
                    <div className="input-group-prepend mr-2">
                        <span className="help-block">
                            <HelpIcon>
                                <GWASDatasetSearchHelp />
                            </HelpIcon>
                        </span>
                    </div>
                    <input type="hidden" name="autoRun" />
                    <input type="hidden" name={DATASET_PARAM_NAME} defaultValue={record} />
                    <input type="hidden" name={ACCESSION_PARAM_NAME} defaultValue={accession} />
                    <input
                        type="text"
                        className="form-control input-sm"
                        onFocus={(e) => e.target.select()}
                        name={PVALUE_PARAM_NAME}
                        defaultValue="5e-8"
                        placeholder={"5e-8"}
                        onChange={handleChange}
                    />
                    <div className="input-group-append">
                        <button disabled={error} className="btn btn-outline-secondary" type="submit">
                            <i className="fa fa-search" />
                        </button>
                    </div>
                </div>
            </form>
            {error && <p className="red">Please enter a valid p-value, e.g., 0.0007, 3e-6, 3^-6, 3x10^-6</p>}
        </>
    );
};

const GWASDatasetRecordSummary: React.SFC<IRecordHeading & StoreProps> = (props) => {
    const { record, recordClass, headerActions } = props;

    return (
        <React.Fragment>
            <div className="col-sm-3">
                <div className="record-summary-container dataset-record-summary-container">
                    <div>
                        <HeaderRecordActions record={record} recordClass={recordClass} headerActions={headerActions} />
                        <h1 className="record-heading">Dataset: {record.attributes.name} </h1>
                    </div>
                    <h2>
                        {convertHtmlEntites(record.attributes.name)} &nbsp;(
                        {record.attributes.attribution})
                    </h2>

                    <ul>
                        <li>
                            <h5 className="dataset-subtitle">{record.attributes.description}</h5>
                        </li>
                        <li>
                            <span className="label">Category:</span> {recordClass.displayName}
                        </li>
                        <li>
                            <span className="label">Explore related datasets: </span>
                            {resolveJsonInput(record.attributes.accession_link)}{" "}
                        </li>
                    </ul>
                    {record.attributes.is_adsp && (
                        <h2>
                            <strong>&nbsp;{resolveJsonInput(record.attributes.is_adsp)}</strong>
                        </h2>
                    )}

                    <GWASDatasetSearch
                        accession={record.attributes.niagads_accession}
                        record={record.id[0].value}
                    ></GWASDatasetSearch>
                </div>
            </div>
        </React.Fragment>
    );
};

const enhance = connect<StoreProps, any, IRecordHeading>((state: any) => ({
    externalUrls: state.globalData.siteConfig.externalUrls,
    webAppUrl: state.globalData.siteConfig.webAppUrl,
}));

export default enhance(GWASDatasetRecordSummary);
