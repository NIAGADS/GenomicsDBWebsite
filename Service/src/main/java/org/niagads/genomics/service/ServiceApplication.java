package org.niagads.genomics.service;

import java.util.Set;

import org.eupathdb.common.service.EuPathServiceApplication;

import org.niagads.genomics.service.services.LocusZoom.GWASService;
import org.niagads.genomics.service.services.LocusZoom.LinkageService;
import org.niagads.genomics.service.services.Search.SiteSearchService;

import org.niagads.genomics.service.services.Dataset.DatasetModelRefService;
import org.niagads.genomics.service.services.Dataset.DatasetLookupService;
import org.niagads.genomics.service.services.Dataset.GWASSummaryStatisticResultService;

import org.niagads.genomics.service.services.Variant.VariantLDWindowService;
import org.niagads.genomics.service.services.Variant.VariantLookupService;
import org.niagads.genomics.service.services.Variant.VariantLDService;


import org.niagads.genomics.service.services.Manhattan.InteractivePlotService;
import org.niagads.genomics.service.services.GenomeBrowser.GWASSummaryStatisticsTrackService;

import org.niagads.genomics.service.services.Track.TrackConfigService;

// import static org.gusdb.fgputil.functional.Functions.filter;
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
    .add(SiteSearchService.class)

    .add(DatasetModelRefService.class)
    .add(DatasetLookupService.class)
    .add(GWASSummaryStatisticResultService.class)

    .add(VariantLDWindowService.class)
    .add(VariantLookupService.class)
    .add(VariantLDService.class)


    // manhattan plot
    .add(InteractivePlotService.class)

    // genome browser tracks
    .add(GWASSummaryStatisticsTrackService.class)
    .add(TrackConfigService.class)
    
    .toSet();
  }
}
