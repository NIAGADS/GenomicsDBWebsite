import React from 'react';
import HomePageController from "./controllers/HomePageController";
import SiteSearchController from "./controllers/Routes/SiteSearchController";
import VisualizationPageController from "./controllers/Routes/VisualizationPageController";
import ExternalContentController from 'ebrc-client/controllers/ExternalContentController';

export const wrapRoutes = (ebrcRoutes) => [
    { path: "/", component: HomePageController },
    { path: "/search/site/result", component: SiteSearchController },   
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
