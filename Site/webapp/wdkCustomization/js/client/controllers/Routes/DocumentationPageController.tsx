import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "wdk-client/Views/NotFound/NotFound";
import ExternalContentController from "ebrc-client/controllers/ExternalContentController";

import { ThemeProvider } from "@material-ui/core";
import { theme} from "@components/MaterialUI";

import AboutPage from "@components/Page/AboutPage";
import ErrorBoundary from "wdk-client/Core/Controllers/ErrorBoundary";



const DocumentationPageController: React.FC<never> = () => {
    const { type } = useParams();

    document.title = "GDB | ";

    let Component;

    switch (type) {
        case "about":
            document.title = document.title + "About";
            Component = AboutPage;
            break;
        case "api":
            <ExternalContentController
                url={`${window.location.protocol}//${window.location.host}/genomics/docs/genomics-service-api.html`}
            />;
        default:
            Component = NotFound;
    }

    return (
        <ErrorBoundary>
            <ThemeProvider theme={theme}>
                <Component />
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default DocumentationPageController;
