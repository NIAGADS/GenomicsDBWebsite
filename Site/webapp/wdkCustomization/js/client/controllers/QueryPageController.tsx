import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { PageController } from "wdk-client/Controllers";
import QueryPage from "../components/QueryPage/QueryPage";
import theme from "../theme";

export default class ResultsPageController extends PageController {
    getTitle() {
        return "NIAGADS|GenomicsDB|Query Results";
    }

    renderView = () => (
        <ThemeProvider theme={theme}>
            <QueryPage />
        </ThemeProvider>
    );
}
