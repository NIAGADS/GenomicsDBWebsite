package org.niagads.genomics.service;

import java.util.Set;

import org.eupathdb.common.service.EuPathServiceApplication;

import org.niagads.genomics.service.services.Search.SiteSearchService;
import org.niagads.genomics.service.services.LocusZoom.*;
import org.niagads.genomics.service.services.Dataset.*;
import org.niagads.genomics.service.services.Variant.*;
import org.niagads.genomics.service.services.GenomeBrowser.*;

// import static org.gusdb.fgputil.functional.Functions.filter;
import org.gusdb.fgputil.SetBuilder;

public class ServiceApplication extends EuPathServiceApplication {

  @Override
  public Set<Class<?>> getClasses() {
    return new SetBuilder<Class<?>>()
     // add WDK services
     .addAll(super.getClasses())

     // add NIAGADS Services
    .add(LZLinkageService.class)
    .add(LZGWASService.class)
    .add(LZGeneService.class)
    .add(LZRecombinationService.class)

    .add(SiteSearchService.class)

    .add(DatasetModelRefService.class)
    .add(DatasetLookupService.class)
    .add(DatasetSummaryPlotService.class)
    .add(DatasetTopFeaturesService.class)

    .add(VariantLDWindowService.class)
    .add(VariantLookupService.class)
    .add(VariantLDService.class)

    // genome browser tracks
    .add(GWASSummaryStatisticsTrackService.class)
    .add(VariantTrackService.class)
    .add(TrackConfigService.class)
    .add(FeatureLookupService.class)
    .add(GeneTrackService.class)
    
    .toSet();
  }
}
