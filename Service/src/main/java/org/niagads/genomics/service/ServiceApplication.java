package org.niagads.genomics.service;

import java.util.Set;

import org.niagads.genomics.service.services.LocusZoom.GWASService;
import org.niagads.genomics.service.services.LocusZoom.LinkageService;
//import org.niagads.genomics.service.services.LocusZoom.Gwas;

import static org.gusdb.fgputil.functional.Functions.filter;
import org.gusdb.fgputil.SetBuilder;
import org.gusdb.wdk.service.WdkServiceApplication;
import org.gusdb.wdk.service.service.SessionService;
import org.gusdb.wdk.service.service.user.BasketService;

public class ServiceApplication extends WdkServiceApplication {

  @Override
  public Set<Class<?>> getClasses() {
    return new SetBuilder<Class<?>>()
     // add WDK services
     .addAll(filter(super.getClasses(), clazz ->
     !clazz.getName().equals(SessionService.class.getName()) &&
     !clazz.getName().equals(BasketService.class.getName())))

     // add NIAGADS Services
    .add(LinkageService.class)
    .add(GWASService.class)

    .toSet();
  }
}
