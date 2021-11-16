import React from "react";
import { forIn } from "lodash";
import { isJson, resolveJsonInput } from "genomics-client/util/jsonParse";

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
