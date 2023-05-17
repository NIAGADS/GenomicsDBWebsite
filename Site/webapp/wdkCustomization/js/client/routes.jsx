import React from 'react';
import HomePageController from "./controllers/HomePageController";
import SiteSearchController from "./controllers/Routes/SiteSearchController";
import VisualizationPageController from "./controllers/Routes/VisualizationPageController";
import DocumentationPageController from "./controllers/Routes/DocumentationPageController"


export const wrapRoutes = (ebrcRoutes) => [
    { path: "/", component: HomePageController, rootClassNameModifier: 'no-padding' },
    { path: "/search/site", component: SiteSearchController },   
    { path: "/documentation/:type", component: DocumentationPageController },   
    { path: "/visualizations/:type", component: VisualizationPageController },
    ...ebrcRoutes,
];
