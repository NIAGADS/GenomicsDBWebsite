import { StepAnalysisDefaultResult } from "wdk-client/Plugins";

import DefaultQuestionForm from "wdk-client/Views/Question/DefaultQuestionForm";

import { StepAnalysisGoEnrichmentResults } from "./components/StepAnalysis/StepAnalysisGoEnrichmentResults";
//import HistogramIdeogramView from "./components/SummaryViews/VariantGenomeView";

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
        type: "questionForm",
        component: DefaultQuestionForm,
    },
   /* {
        type: "summaryView",
        name: "variant-histogram-ideogram",
        component: HistogramIdeogramView,
    },*/

    {
        type: "stepAnalysisResult",
        name: "pathway-enrichment",
        component: StepAnalysisDefaultResult,
    },
    {
        type: "stepAnalysisResult",
        name: "go-enrichment",
        component: StepAnalysisGoEnrichmentResults,
    },
  
];
