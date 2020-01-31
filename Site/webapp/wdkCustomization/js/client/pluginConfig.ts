import { StepAnalysisDefaultResult } from "wdk-client/Plugins";

import DefaultQuestionForm from "wdk-client/Views/Question/DefaultQuestionForm";

import { StepAnalysisGoEnrichmentResults } from "./components/StepAnalysis/StepAnalysisGoEnrichmentResults";
import Ideogram from "./components/SummaryViews/Ideogram";

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
    component: DefaultQuestionForm
  },
  {
    type: "summaryView",
    name: "ideogram",
    component: Ideogram
  },

  {
    type: "stepAnalysisResult",
    name: "pathway-enrichment",
    component: StepAnalysisDefaultResult
  },
  {
    type: "stepAnalysisResult",
    name: "go-enrichment",
    component: StepAnalysisGoEnrichmentResults
  }
];
