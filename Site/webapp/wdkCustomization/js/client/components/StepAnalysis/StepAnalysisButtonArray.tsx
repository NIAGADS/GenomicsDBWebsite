import React, { ReactNode } from "react";

interface StepAnalysisButtonArrayProps {
    configs: StepAnalysisButtonConfig[];
}

export const StepAnalysisButtonArray: React.SFC<StepAnalysisButtonArrayProps> = ({ configs }) => (
    <div style={{ textAlign: "right", display: "block", float: "right", paddingTop: "35px" }}>
        {configs.map((config) => (
            <StepAnalysisButton key={config.key} {...config} />
        ))}
    </div>
);

type StepAnalysisButtonConfig = StepAnalysisButtonProps & { key: string };

interface StepAnalysisButtonProps {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    customButton?: ReactNode;
    href?: string;
    iconClassName?: string;
    contents?: ReactNode;
}

const StepAnalysisButton: React.SFC<StepAnalysisButtonProps> = ({ onClick, customButton, iconClassName, contents }) => (
    <div style={{ display: "inline-block", margin: "5px" }}>
        {customButton || (
            <button className="btn btn-info" onClick={onClick}>
                <i className={`${iconClassName} text-white mr-2`}> </i>
                {contents}
            </button>
        )}
    </div>
);
