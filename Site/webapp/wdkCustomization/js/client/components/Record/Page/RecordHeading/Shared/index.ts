import RecordOutLink from "./RecordOutLink";
import HeaderRecordActions from "./HeaderRecordActions";
import ImpactIndicator from "./ImpactIndicator/ImpactIndicator";
import RecordAttributeItem from "./RecordAttributeItem";
import SummaryPlotHeader from "./SummaryPlotHeader";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

export { HeaderRecordActions, ImpactIndicator, RecordAttributeItem, RecordOutLink, SummaryPlotHeader };

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

