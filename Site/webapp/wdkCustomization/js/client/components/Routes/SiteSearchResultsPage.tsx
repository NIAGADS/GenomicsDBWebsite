import React, { useState } from "react";
import { Link as RouterLink, withRouter, RouteComponentProps } from "react-router-dom";
import { chain, isEmpty, get } from "lodash";

import { useWdkEffect } from "wdk-client/Service/WdkService";
import { Loading } from "wdk-client/Components";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";
import { SearchResult } from "@components/Tools";
import { buildRouteFromResult } from 'genomics-client/util/util';

import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";

interface SiteSearchResultsNavProps {
    genes: number;
    variants: number;
    datasets: number;
    accessions: number;
}

const SiteSearchResultsNav: React.FC<SiteSearchResultsNavProps> = ({ genes, variants, datasets, accessions }) => {
    return (
        <List disablePadding={true}>
            {genes > 0 && (
                <ListItem>
                    <Link color="initial" href="#genes">
                        {genes} Gene{genes > 1 ? "s" : ""}
                    </Link>
                </ListItem>
            )}
            {variants > 0 && (
                <ListItem>
                    <Link color="initial" href="#variants">
                        {variants} Variant{variants > 1 ? "s" : ""}
                    </Link>
                </ListItem>
            )}
            {accessions > 0 && (
                <ListItem>
                    <Link color="initial" href="#accessions">
                        {accessions} NIAGADS Accession{accessions > 1 ? "s" : ""}
                    </Link>
                </ListItem>
            )}
            {datasets > 0 && (
                <ListItem>
                    <Link color="initial" href="#datasets">
                        {datasets} Summary Statistics Dataset{datasets > 1 ? "s" : ""}
                    </Link>
                </ListItem>
            )}
        </List>
    );
};

const SiteSearchResultsPage: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const [results, setResults] = useState<SearchResult[]>(),
        [loading, setLoading] = useState(false),
        sendRequest = (searchTerm: string) => (service: WdkService) => {
            if (searchTerm && searchTerm.length > 2) {
                setLoading(true);
                service
                    ._fetchJson<SearchResult[]>("get", `/search/site?term=${searchTerm}`)
                    .then((res) => setResults(res))
                    .catch((e) => {
                        setResults([]);
                        console.log("caught: " + e);
                    })
                    .finally(() => setLoading(false));
            }
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

    const nGenes = get(counts, "gene"),
        nVariants = get(counts, "variant"),
        nDatasets = get(counts, "track"),
        nAccessions = get(counts, "dataset");

    return loading ? (
        <Loading />
    ) : searchTerm.length < 3 ? (
        <Grid>
            <Box marginTop={3}>
                <Typography>
                    <strong>{searchTerm}</strong> is too short to search. Please enter a search term that is at least 3
                    characters long.
                </Typography>
            </Box>
        </Grid>
    ) : (
        <Grid container spacing={2}>
            {resultsArray.length ? (
                <Box marginTop={3}>
                    <Grid item xs={3}>
                        <Typography variant="h5">Search Results</Typography>
                        <Typography>
                            <strong>{resultsArray.length}</strong> results were found for the search{" "}
                            <strong>{searchTerm}</strong>
                        </Typography>
                        <SiteSearchResultsNav
                            genes={nGenes}
                            variants={nVariants}
                            datasets={nDatasets}
                            accessions={nAccessions}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Box marginTop={3} />
                        <a id="genes" />
                        {nGenes > 0 && <ResultSectionTitle>Genes</ResultSectionTitle>}
                        {nGenes > 0 && resultsArray.map((res) => _buildSearchResult(res, "gene"))}

                        <a id="variants" />
                        {nVariants > 0 && <ResultSectionTitle>Variants</ResultSectionTitle>}
                        {nVariants > 0 && resultsArray.map((res) => _buildSearchResult(res, "variant"))}

                        <a id="accessions" />
                        {nAccessions > 0 && <ResultSectionTitle>NIAGADS Accessions</ResultSectionTitle>}
                        {nAccessions > 0 && resultsArray.map((res) => _buildSearchResult(res, "dataset"))}

                        <a id="datasets" />
                        {nDatasets > 0 && <ResultSectionTitle>GWAS Summary Statistics Datasets</ResultSectionTitle>}
                        {nDatasets > 0 && resultsArray.map((res) => _buildSearchResult(res, "track"))}
                    </Grid>
                </Box>
            ) : (
                <Grid>
                    <Box marginTop={3}>
                        <Typography>
                            <strong>No</strong> results were found for the search <strong>{searchTerm}</strong>
                        </Typography>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

const ResultSectionTitle = withStyles({
    root: {
        fontVariant: "small-caps",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    },
})(Typography);

const _buildSearchResult = (result: SearchResult, recordType: string) => {
    return (
        result.record_type === recordType && (
            <Box key={result.primary_key} mb={3}>
                <RouterLink to={buildRouteFromResult(result)}>{safeHtml(result.display)}</RouterLink>
                {result.record_type === "variant" && result.matched_term.indexOf("merge") > -1 && (
                    <em>{result.matched_term}</em>
                )}
                <Typography>{safeHtml(result.description)}</Typography>
            </Box>
        )
    );
};

export default withRouter(SiteSearchResultsPage);
