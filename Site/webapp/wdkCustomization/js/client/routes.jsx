import HomePageController from "./controllers/HomePageController";
import ResultsPageController from "./controllers/ResultsPageController";
import QueryPageController from "./controllers/QueryPageController";
import VisualizationPageController from "./controllers/VisualizationPageController";

export const wrapRoutes = (ebrcRoutes) => [
    { path: "/", component: HomePageController },
    { path: "/searchResults", component: ResultsPageController },
    { path: "/query", component: QueryPageController },
    { path: "/visualizations/:type", component: VisualizationPageController },
    ...ebrcRoutes,
];
