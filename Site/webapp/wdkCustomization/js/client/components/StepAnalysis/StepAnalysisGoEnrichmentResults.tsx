import React, { Fragment, useState } from "react";

import { scientificCellFactory, decimalCellFactory } from "wdk-client/Components";
import { StepAnalysisResultPluginProps } from "wdk-client/Components";
import { StepAnalysisEnrichmentResultTable } from "wdk-client/Components";
import { StepAnalysisButtonArray } from "./StepAnalysisButtonArray";
import { WordCloudModal } from "wdk-client/Components";

// import 'wdk-client/Core/MoveAfterRefactor/Components/StepAnalysis/StepAnalysisEnrichmentResult.scss';

const goIdRenderFactory = (goTermBaseUrl: string) => ({ row }: Record<string, any>) => (
    <a title="Browse this term in the GO hierarchy (AMIGO)" href={`${goTermBaseUrl}${row.ID}#display-lineage-tab`}>
        {row.ID}
    </a>
);

const goButtonsConfigFactory = (
    stepId: number,
    analysisId: number,
    { imageDownloadPath, downloadPath, revigoInputList, revigoBaseUrl }: any,
    webAppUrl: string,
    setWordCloudOpen: (wordCloudOpen: boolean) => void
) => [
    {
        key: "revigo",
        customButton: (
            <form target="_blank" action={revigoBaseUrl} method="post">
                <textarea name="inputGoList" rows={10} cols={80} hidden readOnly value={revigoInputList} />
                <input name="isPValue" hidden readOnly value="yes" />
                <input name="outputListSize" hidden readOnly value="medium" />
                <button type="submit" name="startRevigo" className="btn" style={{ fontSize: "12px" }}>
                    <i className="fa fa-bar-chart red-text" style={{ marginLeft: 0, paddingLeft: 0 }}>
                        {" "}
                    </i>
                    Open in <b>Revigo</b>
                </button>
            </form>
        ),
    },
    {
        key: "wordCloud",
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setWordCloudOpen(true);
        },
        href: `${webAppUrl}/service/users/current/steps/${stepId}/analyses/${analysisId}/resources?path=${imageDownloadPath}`,
        iconClassName: "fa fa-picture-o red-text",
        contents: (
            <Fragment>
                Show <b>Word Cloud</b>
            </Fragment>
        ),
    },
    {
        key: "download",
        href: `${webAppUrl}/service/users/current/steps/${stepId}/analyses/${analysisId}/resources?path=${downloadPath}`,
        iconClassName: "fa fa-download blue-text",
        contents: "Download",
    },
];

export const StepAnalysisGoEnrichmentResults: React.FC<StepAnalysisResultPluginProps> = ({
    analysisResult,
    analysisConfig,
    webAppUrl,
}) => {
    const [wordCloudOpen, setWordCloudOpen] = useState(false);

    return (
        <Fragment>
            <StepAnalysisButtonArray
                configs={goButtonsConfigFactory(
                    analysisConfig.stepId,
                    analysisConfig.analysisId,
                    analysisResult,
                    webAppUrl,
                    setWordCloudOpen
                )}
            />
            <h3>Analysis Results: </h3>
            <StepAnalysisEnrichmentResultTable
                emptyResultMessage={"No enrichment was found with significance at the p-value threshold you specified."}
                rows={analysisResult.resultData}
                columns={analysisResult.header.map((column: any) =>
                    column.key === "ID"
                        ? { ...column, renderCell: goIdRenderFactory(analysisResult.goTermBaseUrl) }
                        : column.type && column.type == "scientific"
                        ? { ...column, renderCell: scientificCellFactory(2)(column.key) }
                        : column.type && column.type.includes("float")
                        ? { ...column, renderCell: decimalCellFactory(column.type.split("_")[1])(column.key) }
                        : column
                )}
                initialSortColumnKey={"P_VALUE"}
                fixedTableHeader
            />
            <WordCloudModal
                imgUrl={`${webAppUrl}/service/users/current/steps/${analysisConfig.stepId}/analyses/${analysisConfig.analysisId}/resources?path=${analysisResult.imageDownloadPath}`}
                open={wordCloudOpen}
                onClose={() => {
                    setWordCloudOpen(false);
                }}
            />
        </Fragment>
    );
};
