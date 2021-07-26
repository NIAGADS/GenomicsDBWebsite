import React from 'react';
import HomePageController from "./controllers/HomePageController";
import ResultsPageController from "./controllers/ResultsPageController";
import QueryPageController from "./controllers/QueryPageController";
import VisualizationPageController from "./controllers/VisualizationPageController";
import ExternalContentController from 'ebrc-client/controllers/ExternalContentController';

export const wrapRoutes = (ebrcRoutes) => [
    { path: "/", component: HomePageController },
    { path: "/searchResults", component: ResultsPageController },
    { path: "/query", component: QueryPageController },
    { path: "/visualizations/:type", component: VisualizationPageController },
    {
        path: "/api",
        component: props =>
          <ExternalContentController
            url={`${window.location.protocol}//${window.location.host}/genomics/docs/genomics-service-api.html`}
          />
      },
    ...ebrcRoutes,
];
