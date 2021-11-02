import * as siteConfig from "./config";
import { initialize } from "ebrc-client/bootstrap";
import * as componentWrappers from "./component-wrappers";
import { wrapRoutes } from "./routes";
import pluginConfig from "./pluginConfig";

//this needs to be imported first
import "eupathdb/wdkCustomization/css/client.scss";

import "site/wdkCustomization/sass/client.scss"; //local;

import "@fontsource/libre-franklin/700.css";
import "@fontsource/libre-franklin";
import "@fontsource/raleway/700.css";
import "@fontsource/raleway";

// Initialize the application.
const context = initialize({
    componentWrappers,
    wrapRoutes,
    pluginConfig,
});

//override default ebrc siteConfig with local
const SITE_CONFIG_LOADED = "eupathdb/site-config-loaded";
context.store.dispatch({
    type: SITE_CONFIG_LOADED,
    payload: { siteConfig },
});
