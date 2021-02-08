import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { Link } from "wdk-client/Components";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";
import { SearchResult } from "./../Shared/Autocomplete";
import { buildRouteFromResult } from "./../HomePage/HomePage";
import { chain, isEmpty, isObject, get } from "lodash";

interface ResultsPageNavProps {
    genes: number;
    variants: number;
    datasets: number;
    accessions: number;
}

const ResultsPageNav: React.FC<ResultsPageNavProps> = ({ genes, variants, datasets, accessions }) => {
    return (
        <div className="flex-column">
            {genes > 0 && (
                <a className="nav-link" href="#genes">
                    {genes} Gene{genes > 1 ? "s" : ""}
                </a>
            )}
            {variants > 0 && (
                <a className="nav-link" href="#variants">
                    {variants} Variant{variants > 1 ? "s" : ""}
                </a>
            )}
            {accessions > 0 && (
                <a className="nav-link" href="#accessions">
                    {accessions} NIAGADS Accession{accessions > 1 ? "s" : ""}
                </a>
            )}
            {datasets > 0 && (
                <a className="nav-link" href="#datasets">
                    {datasets} Summary Statistics Dataset{datasets > 1 ? "s" : ""}
                </a>
            )}
        </div>
    );
};

const ResultsPage: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const [results, setResults] = useState<SearchResult[]>(),
        sendRequest = (searchTerm: string) => (service: WdkService) => {
            !!searchTerm &&
                service
                    ._fetchJson<SearchResult[]>("get", `/search/site?term=${searchTerm}`)
                    .then((res) => setResults(res))
                    .catch((e) => {
                        setResults([]);
                        console.log("caught: " + e);
                    });
        };

    const searchTerm = location.search.split("=")[1];

    //for now empty results are coming back as an empty object rather than array, so cover both possibilities
    const resultsArray = isEmpty(results) ? [] : results,
        counts = chain(resultsArray)
            .groupBy("record_type")
            .mapValues((v) => v.length)
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
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-3 sticky-top h-100">
                                    <h2>Search Results</h2>
                                    <strong className="text-danger">{resultsArray.length}</strong> results were found
                                    for the search <strong className="text-danger">{searchTerm}</strong>
                                    <ResultsPageNav
                                        genes={nGenes}
                                        variants={nVariants}
                                        datasets={nDatasets}
                                        accessions={nAccessions}
                                    />
                                </div>
                                <div className="col-sm-8">
                                    <a id="genes" />
                                    {nGenes > 0 && (
                                        <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">Genes</h3>
                                    )}
                                    {nGenes > 0 && resultsArray.map((res) => _buildSearchResult(res, "gene"))}

                                    <a id="variants" />
                                    {nVariants > 0 && (
                                        <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">Variants</h3>
                                    )}
                                    {nVariants > 0 && resultsArray.map((res) => _buildSearchResult(res, "variant"))}

                                    <a id="accessions" />
                                    {nAccessions > 0 && (
                                        <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">
                                            NIAGADS Accessions
                                        </h3>
                                    )}
                                    {nAccessions > 0 && resultsArray.map((res) => _buildSearchResult(res, "dataset"))}

                                    <a id="datasets" />
                                    {nDatasets > 0 && (
                                        <h3 className="mt-5 mb-2 pb-2 site-search-result__section-title">
                                            GWAS Summary Statistics Datasets
                                        </h3>
                                    )}
                                    {nDatasets > 0 &&
                                        resultsArray.map((res) => _buildSearchResult(res, "gwas_summary"))}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12">
                                <h2>Search Results</h2>
                                <strong className="text-danger">No</strong> results were found for the search{" "}
                                <strong className="text-danger">{searchTerm}</strong>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2>Search Results</h2>
                            Loading results for the search <strong className="text-danger">{searchTerm}</strong>...
                        </div>
                    </div>
                </div>
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
                    {result.record_type === "variant" && result.matched_term.indexOf("merge") > -1 && (
                        <em>{result.matched_term}</em>
                    )}
                </div>

                <div>
                    <small>{safeHtml(result.description)}</small>
                </div>
            </div>
        )
    );
};

export default withRouter(ResultsPage);
