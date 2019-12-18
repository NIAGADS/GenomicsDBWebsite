import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { Link } from "wdk-client/Components";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";
import {
  SearchResult,
  buildRouteFromResult
} from "../AutoCompleteSearch/AutoCompleteSearch";
import { isEmpty } from "lodash";

interface ResultsPage {}

const ResultsPage: React.FC<ResultsPage & RouteComponentProps<any>> = ({
  location
}) => {
  const [results, setResults] = useState<SearchResult[]>(),
    sendRequest = (searchTerm: string) => (service: WdkService) => {
      !!searchTerm &&
        service
          ._fetchJson<SearchResult[]>("get", `/search/site?term=${searchTerm}`)
          .then(res => setResults(res))
          .catch(e => {
            setResults([]);
            console.log("caught: " + e);
          });
    };

  const searchTerm = location.search.split("=")[1];

  //for now empty results are coming back as an empty object rather than array, so cover both possibilities
  const resultsArray = isEmpty(results) ? [] : results;

  //search term could change in header box
  useWdkEffect(sendRequest(searchTerm), [searchTerm]);

  return (
    <div>
      {resultsArray.length ? (
        <React.Fragment>
          <h2>Results for search "{searchTerm}"</h2>
          {resultsArray.map(res => _buildSearchResult(res))}
        </React.Fragment>
      ) : (
        <h2>No results for search "{searchTerm}"</h2>
      )}
    </div>
  );
};

const _buildSearchResult = (result: SearchResult) => {
  return (
    <div key={result.primary_key}>
      <hr />
      <div>
        <strong>Result</strong>:{" "}
        <Link className="wdk-Link" to={buildRouteFromResult(result)}>
          {safeHtml(result.display)}
        </Link>
      </div>
      <div>
        <strong>Description</strong>: {safeHtml(result.description)}
      </div>
      <div>
        <strong>Type</strong>: {safeHtml(result.record_type)}
      </div>
      <div>
        <strong>Matched Term</strong>: {safeHtml(result.matched_term)}
      </div>
    </div>
  );
};

export default withRouter(ResultsPage);
