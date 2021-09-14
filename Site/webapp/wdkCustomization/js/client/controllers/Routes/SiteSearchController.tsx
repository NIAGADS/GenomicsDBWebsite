import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { PageController } from "wdk-client/Controllers";
import SiteSearchResultsPage from "../../components/Routes/SiteSearchResultsPage";
import theme from "../../theme";

export default class SiteSearchController extends PageController {
    getTitle() {
        return "NIAGADS|GenomicsDB|Search Results";
    }

    renderView = () => (
        <ThemeProvider theme={theme}>
            <SiteSearchResultsPage />
        </ThemeProvider>
    );
}
