package org.niagads.genomics.controller;

import org.eupathdb.common.controller.EuPathSiteSetup;
import org.gusdb.fgputil.web.ApplicationContext;
import org.gusdb.wdk.controller.WdkInitializer;
import org.gusdb.wdk.model.WdkModel;

public class SiteInitializer {

  public static void startUp(ApplicationContext context) {
    WdkInitializer.initializeWdk(context);
    WdkModel wdkModel = WdkInitializer.getWdkModel(context);
    EuPathSiteSetup.initialize(wdkModel);
    // ApiSiteSetup.initialize(wdkModel);
  }

  public static void shutDown(ApplicationContext context) {
    WdkInitializer.terminateWdk(context);
  }
}
