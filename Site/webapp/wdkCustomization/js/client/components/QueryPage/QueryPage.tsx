import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { QuestionState } from "wdk-client/StoreModules/QuestionStoreModule";
import { updateActiveQuestion } from "wdk-client/Actions/QuestionActions";
import { get, isEmpty } from "lodash";
import { LoadError, LoadingOverlay } from "wdk-client/Components";

interface QueryPage {
    //connected props
    question?: {
        questions: { [key: string]: QuestionState };
    };
}

const QueryPage: React.FC<QueryPage> = (props) => {
    const params: { [key: string]: string } = {};
    new URLSearchParams(useLocation().search).forEach((v, k) => (params[k] = v));
    const dispatch = useDispatch(),
        {
            question, //required or we can't even run
        } = params,
        errors: { general: any[]; byKey: { [key: string]: string[] } } = get(
            props,
            `question.questions.${question}.stepValidation.errors`
        );

    //http://localhost:8080/genomics_gus_4/app/query?question=gwas_stats&gwas_accession=NG00027&gwas_dataset=NG00027_ADJ_STAGE1&pvalue=5e-8

    useEffect(() => {
        if (question) {
            //validate params

            dispatch(
                updateActiveQuestion({
                    prepopulateWithLastParamValues: false,
                    searchName: question,
                    autoRun: true,
                    initialParamData: params,
                    stepId: undefined,
                })
            );
        }
    }, []);

    return !isEmpty(errors) ? (
        <LoadError />
    ) : question ? (
        <LoadingOverlay>
            <span>Loading...</span>
        </LoadingOverlay>
    ) : (
        <span>No Question Provided!</span>
    );
};

export default connect((state: any) => ({ question: state.question }))(QueryPage);
