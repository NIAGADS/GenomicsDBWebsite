import React, { useContext, useEffect, useRef, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { WdkServiceContext } from "wdk-client/Service/WdkService";
import { Link } from "wdk-client/Components";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { debounce, get, isEmpty, isEqual } from "lodash";

export interface SearchResult {
    type?: "result" | "summary";
    description: string;
    display: string;
    match_rank: number;
    primary_key: string;
    record_type: string;
    matched_term: string;
}

interface AutoCompleteSearch {
    canGrow?: boolean;
}

//container component, holds state for search and selection
const AutoCompleteSearch: React.FC<AutoCompleteSearch> = ({ canGrow }) => {
    const [searchTerm, setSearchTerm] = useState<string>(),
        [results, setResults] = useState<SearchResult[]>(),
        [selected, setSelected] = useState<number>(),
        [resultsVisible, setResultsVisible] = useState(false),
        [hasFocus, setHasFocus] = useState(false);

    const ownRef = useRef<any>();

    const displayCount = 5;

    const reset = () => {
        setResults(null);
        setSelected(null);
        setSearchTerm(null);
    };

    const _setSearchTerm = (term: string) => (term.length > 2 ? setSearchTerm(term) : reset());

    const onKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        switch (e.keyCode) {
            //down arrow
            case 40:
                const _index =
                    selected == null
                        ? 0
                        : // +1 b/c we will have summary row if all items cannot be displayed
                        selected < (displayCount ? displayCount : results.length - 1)
                        ? selected + 1
                        : 0;
                return setSelected(_index);
            //up arrow
            case 38:
                return setSelected(selected > 0 ? selected - 1 : null);
            //esc
            case 27:
                return reset();
        }
    };

    //for now empty results are coming back as an empty object rather than array, so cover both possibilities
    const resultsArray = isEmpty(results) ? [] : results,
        displayResults = resultsArray.slice(0, displayCount),
        undisplayedCount = resultsArray.length > displayCount ? resultsArray.length - displayCount : 0;

    //if we're truncating results list, push in results entry with dummy properties so that it's listed normally
    if (undisplayedCount) {
        displayResults.push({
            description: "",
            display: "",
            match_rank: 0,
            matched_term: "",
            record_type: "",
            primary_key: "fake",
            type: "summary",
        });
    }

    return (
        <div className="autocomplete-box" ref={ownRef} style={{ flexGrow: hasFocus && canGrow ? 1 : 0 }}>
            <AutoCompleteSearchBox
                onChange={debounce(_setSearchTerm, 650)}
                onFocus={setHasFocus.bind(null, true)}
                onBlur={setHasFocus.bind(null, false)}
                onKeyDown={onKeyDown}
                onResult={setResults}
                reset={reset}
                results={displayResults}
                resultsVisible={resultsVisible}
                searchTerm={searchTerm}
                selected={get(displayResults, `[${selected}]`)}
                setResultsVisible={setResultsVisible}
                undisplayedCount={undisplayedCount}
            />
        </div>
    );
};

//component that manages searching and selection
interface AutoCompleteSearchBox {
    onBlur: () => void;
    onChange: (arg: string) => void;
    onFocus: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onResult: (results: SearchResult[]) => void;
    reset: () => void;
    setResultsVisible: (isVisible: boolean) => void;
    results: SearchResult[];
    resultsVisible: boolean;
    searchTerm: string;
    selected?: SearchResult;
    undisplayedCount: number;
}

const _AutoCompleteSearchBox: React.FC<AutoCompleteSearchBox & RouteComponentProps<any>> = ({
    history,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    onResult,
    reset,
    results,
    resultsVisible,
    searchTerm,
    selected,
    setResultsVisible,
    undisplayedCount,
}) => {
    const searchInProgress = useRef(false),
        [searchQueue, setSearchQueue] = useState<string[]>([]),
        wdkService = useContext(WdkServiceContext);

    const wrappedKeyDown = (e: React.KeyboardEvent) => {
        //enter
        if (e.keyCode === 13 && searchTerm) {
            const route =
                //if the selection is the summary row or there is no selection (the user has just pressed enter), go to summary page
                !selected || selected.type === "summary"
                    ? _buildSummaryRoute(searchTerm)
                    : buildRouteFromResult(selected);
            history.push(route);
            reset();
        } else {
            onKeyDown(e);
        }
    };

    //the queue ensures that searches are sent in the order received
    useEffect(() => {
        setSearchQueue([searchTerm].concat(searchQueue));
    }, [searchTerm]);

    const _onResult = (res: any) => {
        searchInProgress.current = false;
        onResult(res);
    };

    useEffect(() => {
        if (searchQueue.length && !searchInProgress.current) {
            const term = searchQueue.pop();
            setSearchQueue(searchQueue);
            searchInProgress.current = true;
            wdkService
                ._fetchJson<SearchResult[]>("get", `/search/site?term=${term}`)
                .then((res) => _onResult(res))
                .catch(() => _onResult(null));
        }
        return () => {
            searchInProgress.current = false;
            setSearchQueue([]);
        };
    }, [searchQueue, searchInProgress]);

    const container = useRef(),
        boxWidth = useRef(0);

    useEffect(() => {
        boxWidth.current = get(container, "current.clientWidth", 0);
    });

    return (
        <div className="search-box-with-dropdown">
            <span className="text-box-container">
                <input
                    ref={container}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    onFocus={() => {
                        onFocus();
                        setResultsVisible(true);
                    }}
                    onBlur={() => {
                        onBlur();
                        setResultsVisible(false);
                    }}
                    className="form-control"
                    onKeyDown={wrappedKeyDown}
                    placeholder="Enter a gene or variant"
                />
            </span>
            {resultsVisible && (!!results.length || !!searchQueue.length) && (
                <div className="results-list">
                    {(!!searchQueue.length || searchInProgress.current) && <span>Loading...</span>}
                    {!searchQueue.length &&
                        !searchInProgress.current &&
                        results.map((result, i) => {
                            return (
                                <ResultRow
                                    key={`${i}-${result.primary_key}`}
                                    result={result}
                                    searchTerm={searchTerm}
                                    selected={isEqual(selected, result)}
                                    width={boxWidth.current}
                                    reset={reset}
                                >
                                    <span onClick={reset}>
                                        {result.type === "summary" ? (
                                            <span>{`Plus ${undisplayedCount} more`}</span>
                                        ) : (
                                            _buildResultDisplay(result, searchTerm)
                                        )}
                                    </span>
                                </ResultRow>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

const AutoCompleteSearchBox = withRouter(_AutoCompleteSearchBox);

interface ResultRow {
    reset: () => void;
    result: SearchResult;
    searchTerm: string;
    selected: boolean;
    width: number;
    children: JSX.Element;
}

const ResultRow: React.FC<ResultRow> = ({ children, reset, result, searchTerm, selected, width }) => {
    return (
        <Link
            onMouseDown={(e: React.MouseEvent<any, MouseEvent>) => {
                //prevent input blur event, which would fire before link click and hide dropdown and prevent navigation
                e.preventDefault();
            }}
            style={{
                width: width + "px",
                backgroundColor: selected ? "#9ca3c1" : "inherit", //$dove-grey
                border: selected ? "#950065 thin solid" : "none", //$light-purple
            }}
            to={get(result, "type") === "summary" ? _buildSummaryRoute(searchTerm) : buildRouteFromResult(result)}
        >
            {children}
        </Link>
    );
};

const _buildResultDisplay = (result: SearchResult, searchTerm: string) => {
    return result.display === result.matched_term ? (
        <span>{safeHtml(result.display)}</span>
    ) : (
        <span>
            {safeHtml(result.display)}&nbsp;
            <small>
                <em>{_truncateMatch(result.matched_term, searchTerm)}</em>
            </small>
        </span>
    );
};

const _buildSummaryRoute = (searchTerm: string) => `/searchResults?searchTerm=${searchTerm}`;

export const buildRouteFromResult = (result: SearchResult) => `/record/${result.record_type}/${result.primary_key}`;

const _truncateMatch = (matchedTerm: string, searchTerm: string) => {
    const idx = matchedTerm.toLowerCase().indexOf(searchTerm.toLowerCase()),
        length = searchTerm.length,
        start = idx - 25 >= 0 ? idx - 25 : 0,
        end = idx + length + 25 <= matchedTerm.length ? idx + length + 25 : matchedTerm.length,
        openingEllipsis = start === 0 ? "" : "...",
        closingEllipsis = end <= matchedTerm.length - 4 ? "..." : "",
        _content = safeHtml(matchedTerm),
        content = _content.props.dangerouslySetInnerHTML.__html;

    return `${openingEllipsis}${content.slice(start, end)}${closingEllipsis}`;
};

export default AutoCompleteSearch;
