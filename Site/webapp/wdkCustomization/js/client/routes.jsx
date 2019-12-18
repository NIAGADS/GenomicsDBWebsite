import HomePageController from "./controllers/HomePageController";
import ResultsPageController from "./controllers/ResultsPageController";

export const wrapRoutes = ebrcRoutes => [
  { path: "/", component: HomePageController },
  { path: "/searchResults", component: ResultsPageController },
  ...ebrcRoutes
];
