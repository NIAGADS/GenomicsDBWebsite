import * as siteConfig from "./config";
import { initialize } from "ebrc-client/bootstrap";
import * as componentWrappers from "./component-wrappers";
import { wrapRoutes } from "./routes";
import pluginConfig from "./pluginConfig";

import "bootstrap/dist/js/bootstrap.bundle.min";
import "site/wdkCustomization/css/client.css";
import "site/wdkCustomization/sass/client.scss";

// Initialize the application.
const context = initialize({
    componentWrappers,
    wrapRoutes,
    pluginConfig,
    //storeWrappers,
});

//override default ebrc siteConfig with local
const SITE_CONFIG_LOADED = "eupathdb/site-config-loaded";
context.store.dispatch({
    type: SITE_CONFIG_LOADED,
    payload: { siteConfig },
});
