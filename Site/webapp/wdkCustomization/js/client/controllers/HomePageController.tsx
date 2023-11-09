import React from "react";
import { PageController } from "wdk-client/Controllers";
import { HomePage } from "../components/Page";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../components/MaterialUI";
import { projectId } from "ebrc-client/config";

export default class HomePageController extends PageController {
    getTitle() {
        return `GDB: ${projectId} | Home`;
    }

    renderView = () => (
        <ThemeProvider theme={theme}>
            <HomePage />
        </ThemeProvider>
    );
}
