package org.niagads.genomics.controller;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.gusdb.wdk.controller.ServletApplicationContext;

/**
 * A class that is initialized at the start of the web application. This makes
 * sure global resources are available to all the contexts that need them
 */
public class ApplicationInitListener implements ServletContextListener {

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    SiteInitializer.startUp(
      new ServletApplicationContext(
        sce.getServletContext()));
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    SiteInitializer.shutDown(
      new ServletApplicationContext(
        sce.getServletContext()));
  }

}
