import React from "react";
import { isJson, resolveJsonInput } from "../util/jsonParse";
import { forIn } from "lodash";

export const ResultTableSummaryViewController = (Comp: React.ComponentType) => {
    return (props: any) => {
        if (props.viewData.answer) {
            (props.viewData.answer.records as any).forEach((record: any) => {
                forIn(record.attributes, (v: string, k: string, o: { [key: string]: any }) => {
                    if (isJson(v)) {
                        o[k] = resolveJsonInput(v);
                    }
                });
            });
        }
        return <Comp {...props} />;
    };
};
