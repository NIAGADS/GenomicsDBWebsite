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
import { chain, isEmpty, isObject, get, groupBy, mapValues } from "lodash";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

interface ResultsPage { }
interface ResultsPageNavProps {
  genes: number;
  variants: number;
  datasets: number;
  accessions: number;
}

const ResultsPageNav: React.FC<ResultsPageNavProps> = ({
  genes,
  variants,
  datasets,
  accessions
}) => {
  return (
    <Nav className="flex-column">
      {genes > 0 && (
        <Nav.Link href="#genes">{genes} Gene{genes > 1 ? "s" : ""}</Nav.Link>
      )}
      {variants > 0 && (
        <Nav.Link href="#variants">{variants} Variant{variants > 1 ? "s" : ""}</Nav.Link>
      )}
      {accessions > 0 && (
        <Nav.Link href="#accessions">{accessions} NIAGADS Accession{accessions > 1 ? "s" : ""}</Nav.Link>
      )}
      {datasets > 0 && (
        <Nav.Link href="#datasets">{datasets} Summary Statistics Dataset{datasets > 1 ? "s" : ""}</Nav.Link>
      )}
    </Nav>
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
  const resultsArray = isEmpty(results) ? [] : results,
    counts = chain(resultsArray)
      .groupBy("record_type")
      .mapValues(v => v.length)
      .value();

  //search term could change in header box
  useWdkEffect(sendRequest(searchTerm), [searchTerm]);

  const nGenes = get(counts, "gene");
  const nVariants = get(counts, "variant");
  const nDatasets = get(counts, "gwas_summary");
  const nAccessions = get(counts, "dataset");

  return (
    <div>
      {isObject(results) ? (
        resultsArray.length ? (
          <React.Fragment>
            <Container fluid={true}>
              <Row>
                <Col sm={3} className="sticky-top h-100">
                  <h2>Search Results</h2>
                  <strong className="text-danger">{resultsArray.length}</strong> results were found for the search <strong className="text-danger">{searchTerm}</strong>
                  <ResultsPageNav
                    genes={nGenes}
                    variants={nVariants}
                    datasets={nDatasets}
                    accessions={nAccessions}
                  />
                </Col>
                <Col sm={8}>
                  <a id="genes" />
                  {nGenes > 0 && <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">Genes</h3>}
                  {nGenes > 0 && resultsArray.map(res => _buildSearchResult(res, "gene"))}

                  <a id="variants" />
                  {nVariants > 0 && <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">Variants</h3>}
                  {nVariants > 0 && resultsArray.map(res => _buildSearchResult(res, "variant"))}

                  <a id="accessions" />
                  {nAccessions > 0 && <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">NIAGADS Accessions</h3>}
                  {nAccessions > 0 && resultsArray.map(res => _buildSearchResult(res, "dataset"))}

                  <a id="datasets" />
                  {nDatasets > 0 && <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">GWAS Summary Statistics Datasets</h3>}
                  {nDatasets > 0 && resultsArray.map(res => _buildSearchResult(res, "gwas_summary"))}
                </Col>
              </Row>
            </Container>
          </React.Fragment>
        ) : (
            <Container fluid={true}>
              <Row>
                <Col>
                  <h2>Search Results</h2>
                  <strong className="text-danger">No</strong> results were found for the search <strong className="text-danger">{searchTerm}</strong>
                </Col>
              </Row>
            </Container>
          )
      ) : (
          <Container fluid={true}>
            <Row>
              <Col>
                <h2>Search Results</h2>
                Loading results for the search <strong className="text-danger">{searchTerm}</strong>...
          </Col>
            </Row>
          </Container>
        )}
    </div>
  );
};

const _buildSearchResult = (result: SearchResult, recordType: string) => {
  return (
    result.record_type === recordType && (
      <div key={result.primary_key} className="mb-3">
        <div>
          <Link className="h6 wdk-Link" to={buildRouteFromResult(result)}>
            {safeHtml(result.display)}
          </Link>
          {result.record_type === "variant" &&
            result.matched_term.indexOf("merge") > -1 && (
              <em>{result.matched_term}</em>
            )}
        </div>

        <div>
          <small>
            {safeHtml(result.description)}
          </small>
        </div>
      </div>
    )
  );
};

export default withRouter(ResultsPage);
