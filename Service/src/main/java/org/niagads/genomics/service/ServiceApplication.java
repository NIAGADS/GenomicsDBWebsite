package org.niagads.genomics.service;

import java.util.Set;

import org.eupathdb.common.service.EuPathServiceApplication;

import org.niagads.genomics.service.services.LocusZoom.GWASService;
import org.niagads.genomics.service.services.LocusZoom.LinkageService;
//import org.niagads.genomics.service.services.LocusZoom.Gwas;

import static org.gusdb.fgputil.functional.Functions.filter;
import org.gusdb.fgputil.SetBuilder;

public class ServiceApplication extends EuPathServiceApplication {

  @Override
  public Set<Class<?>> getClasses() {
    return new SetBuilder<Class<?>>()
     // add WDK services
     .addAll(super.getClasses())

     // add NIAGADS Services
    .add(LinkageService.class)
    .add(GWASService.class)

    .toSet();
  }
}
