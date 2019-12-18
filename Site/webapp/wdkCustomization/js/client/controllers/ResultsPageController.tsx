import React from "react";
import { PageController } from "wdk-client/Controllers";
import ResultsPage from "../components/ResultsPage/ResultsPage";

export default class ResultsPageController extends PageController {
  getTitle() {
    return "NIAGADS|GenomicsDB|Search Results";
  }

  renderView = () => <ResultsPage />;
}
