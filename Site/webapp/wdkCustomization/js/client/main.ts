// import CSS/LESS/SAS files
//import "../../css/client.css"; // copied from ApiCommonWebsite/Site/webapp/wdkCustomization/css/client.ss; may not be needed in long run
import "../../sass/style.scss";

import * as siteConfig from "./config";

// initialize from ebrc
import { initialize } from "ebrc-client/bootstrap";

// import wrappers and additional routes
import * as componentWrappers from "./component-wrappers";
import { wrapRoutes } from "./routes";

import pluginConfig from './pluginConfig';

// Initialize the application.
const castInitialize: any = initialize;

const context = castInitialize({
  isPartOfEuPathDB: false,
  includeQueryGrid: true,
  componentWrappers,
  wrapRoutes,
  pluginConfig
  //storeWrappers,
});

//override default ebrc siteConfig with local
const SITE_CONFIG_LOADED = "eupathdb/site-config-loaded";
context.store.dispatch({
  type: SITE_CONFIG_LOADED,
  payload: { siteConfig }
});
