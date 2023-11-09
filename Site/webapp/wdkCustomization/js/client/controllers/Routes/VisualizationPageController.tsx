import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "wdk-client/Views/NotFound/NotFound";

import GenomeBrowserPage from "@components/Page/GenomeBrowserPage";
import ErrorBoundary from "wdk-client/Core/Controllers/ErrorBoundary";

import { projectId } from "ebrc-client/config";

const VisualizationsPageController: React.FC<never> = () => {
    //@ts-ignore
    const { type  } = useParams();

    document.title = `GDB: ${projectId} | `;

    let Component;

    switch (type) {
        case "browser":
            document.title = document.title + "Browser"
            Component = GenomeBrowserPage;
            break;
        default:
            Component = NotFound;
    }

    return (
        <ErrorBoundary>
            <Component />
        </ErrorBoundary>
    );
};

export default VisualizationsPageController;
