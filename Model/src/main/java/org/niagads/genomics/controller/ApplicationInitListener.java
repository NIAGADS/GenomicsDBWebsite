package org.niagads.genomics.controller;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.eupathdb.common.controller.EuPathSiteSetup;
import org.gusdb.wdk.controller.WdkInitializer;

/**
 * A class that is initialized at the start of the web application. This makes
 * sure global resources are available to all the contexts that need them
 */
public class ApplicationInitListener implements ServletContextListener {

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    ServletContext context = sce.getServletContext();
    WdkInitializer.initializeWdk(context);
    EuPathSiteSetup.initialize(WdkInitializer.getWdkModel(context));
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    ServletContext context = sce.getServletContext();
    WdkInitializer.terminateWdk(context);
  }
}
