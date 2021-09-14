import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "wdk-client/Views/NotFound/NotFound";
import LinkagePlotPage from "../../components/LinkagePlotPage/LinkagePlotPage";
import GenomeBrowserPage from "../../components/GenomeBrowserPage/GenomeBrowserPage";
import ErrorBoundary from "wdk-client/Core/Controllers/ErrorBoundary";

const VisualizationsPageController: React.FC<never> = () => {
    const { type } = useParams();

    document.title = "NIAGADS | GenomicsDB";

    let Component;

    switch (type) {
        case "linkage":
            Component = LinkagePlotPage;
            break;
        case "browser":
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
