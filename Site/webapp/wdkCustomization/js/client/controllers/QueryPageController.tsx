import React from "react";
import { PageController } from "wdk-client/Controllers";
import QueryPage from "../components/QueryPage/QueryPage";

export default class ResultsPageController extends PageController {
  getTitle() {
    return "NIAGADS|GenomicsDB|Query Results";
  }

  renderView = () => <QueryPage />;
}
