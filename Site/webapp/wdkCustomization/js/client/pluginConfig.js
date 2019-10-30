import { 
    // ResultTableSummaryViewPlugin,
    StepAnalysisPathwayEnrichmentResults
  } from 'wdk-client/Plugins';
  
  import { StepAnalysisGoEnrichmentResults } from './components/StepAnalysis/StepAnalysisGoEnrichmentResults';
  
  export default [

   /* {
      type: 'questionFilter',
      name: 'matched_transcript_filter_array',
      component: MatchedTranscriptsFilterPlugin
    },
    {
      type: 'questionFilter',
      name: 'gene_boolean_filter_array',
      component: MatchedTranscriptsFilterPlugin
    },*/
   
    {
      type: 'stepAnalysisResult',
      name: 'pathway-enrichment',
      component: StepAnalysisPathwayEnrichmentResults
    },
    {
      type: 'stepAnalysisResult',
      name: 'go-enrichment',
      component: StepAnalysisGoEnrichmentResults
    },
  ];