import HomePageController from "./controllers/HomePageController";
import ResultsPageController from "./controllers/ResultsPageController";
import VisualizationPageController from "./controllers/VisualizationPageController";

export const wrapRoutes = ebrcRoutes => [
  { path: "/", component: HomePageController },
  { path: "/searchResults", component: ResultsPageController },
  { path: "/visualizations/:type", component: VisualizationPageController },
  ...ebrcRoutes
];
