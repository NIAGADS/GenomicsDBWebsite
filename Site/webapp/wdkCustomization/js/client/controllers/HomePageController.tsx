import React from "react";
import { PageController } from "wdk-client/Controllers";
import { HomePage } from "../components/Page";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../components/MaterialUI";

export default class HomePageController extends PageController {
    getTitle() {
        return "NIAGADS|GenomicsDB";
    }

    renderView = () => (
        <ThemeProvider theme={theme}>
            <HomePage />
        </ThemeProvider>
    );
}
