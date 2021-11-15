import { makeStyles, createStyles, Theme } from "@material-ui/core";

export * from "./HeaderRecordActions";
export * from "./ImpactIndicator/ImpactIndicator";
export * from "./RecordAttributeItem";
export * from "./SummaryPlotHeader";

export const useHeadingStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: "10px",
            paddingLeft: "50px",
        },
    })
);
