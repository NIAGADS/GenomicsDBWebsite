import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { PageController } from "wdk-client/Controllers";
import SiteSearchResultsPage from "@components/Page/SiteSearchResultsPage";
import { theme } from "@components/MaterialUI";
import { projectId } from "ebrc-client/config";
export default class SiteSearchController extends PageController {
    getTitle() {
        return `GDB: ${projectId} | Site Search`;
    }

    renderView = () => (
        <ThemeProvider theme={theme}>
            <SiteSearchResultsPage />
        </ThemeProvider>
    );
}
