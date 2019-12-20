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

interface ResultsPage { }
interface ResultsPageNavProps {
  genes: number,
  variants: number,
  datasets: number,
  accessions: number
}

const ResultsPageNav: React.FC<ResultsPageNavProps> =
  ({ genes, variants, datasets, accessions }) => {

    return (
      <div>
        <ul className="nav">
          {genes > 0 &&
            <li className="nav-item">
              <a className="nav-link active" href="#genes">{genes} Gene{genes > 1 ? 's' : ''}</a>
            </li>
          }
          {variants > 0 &&
            <li className="nav-item">
              <a className="nav-link active" href="#variants">{variants} Variant{variants > 1 ? 's' : ''}</a>
            </li>
          }
          {accessions > 0 &&
            <li className="nav-item">
              <a className="nav-link active" href="#accessions">{accessions} NIAGADS Accession{accessions > 1 ? 's' : ''}</a>
            </li>
          }
          {datasets > 0 &&
            <li className="nav-item">
              <a className="nav-link active" href="#datasets">{datasets} Summary Statistics Dataset{datasets > 1 ? 's' : ''}</a>
            </li>
          }
        </ul>
      </div>
    );
  };

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
  const numGeneMatches = resultsArray.filter(function (value) { return value.record_type === 'gene' }).length;
  const numDatasetMatches = resultsArray.filter(function (value) { return value.record_type === 'gwas_summary' }).length;
  const numVariantMatches = resultsArray.filter(function (value) { return value.record_type === 'variant' }).length;
  const numAccessionMatches = resultsArray.filter(function (value) { return value.record_type === 'dataset' }).length;

  //search term could change in header box
  useWdkEffect(sendRequest(searchTerm), [searchTerm]);

  return (
    <div>
      {resultsArray.length ? (
        <React.Fragment>
          <h2>Results for search "{searchTerm}"</h2>
          <ResultsPageNav genes={numGeneMatches} variants={numVariantMatches} datasets={numDatasetMatches} accessions={numAccessionMatches} />
          <a id="gene" />
          {resultsArray.map(res => _buildSearchResult(res, 'gene'))}

          <a id="variant" />
          {resultsArray.map(res => _buildSearchResult(res, 'variant'))}

          <a id="accessions" />
          {resultsArray.map(res => _buildSearchResult(res, 'dataset'))}

          <a id="datasets" />
          {resultsArray.map(res => _buildSearchResult(res, 'gwas_summary'))}
        </React.Fragment>
      ) : (
          <h2>No results for search "{searchTerm}"</h2>
        )}
    </div>
  );
};

const _buildSearchResult = (result: SearchResult, recordType: string) => {
  return (
    result.record_type === recordType &&
    <div key={result.primary_key}>
      <hr />
      <div>
        <Link className="h6 wdk-Link" to={buildRouteFromResult(result)}>
          {safeHtml(result.display)}
        </Link>
        {(result.record_type === 'variant' && result.matched_term.indexOf('merge') > -1) && <em>{result.matched_term}</em>}
      </div>


      <div>
        <p className="site-search-result__description">{safeHtml(result.description)}</p>
      </div>
    </div>

  );
};

export default withRouter(ResultsPage);
