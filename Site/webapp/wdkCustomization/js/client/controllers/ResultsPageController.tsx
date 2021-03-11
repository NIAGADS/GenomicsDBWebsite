import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { PageController } from "wdk-client/Controllers";
import ResultsPage from "../components/ResultsPage/ResultsPage";
import theme from "../theme";

export default class ResultsPageController extends PageController {
    getTitle() {
        return "NIAGADS|GenomicsDB|Search Results";
    }

    renderView = () => (
        <ThemeProvider theme={theme}>
            <ResultsPage />
        </ThemeProvider>
    );
}
