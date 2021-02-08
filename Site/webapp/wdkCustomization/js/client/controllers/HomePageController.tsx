import React from "react";
import { PageController } from "wdk-client/Controllers";
import HomePage from "../components/HomePage/HomePage";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./../theme";

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
