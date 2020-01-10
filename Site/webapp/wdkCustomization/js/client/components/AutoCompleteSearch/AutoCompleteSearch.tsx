import React, { useEffect, useRef, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { Link } from "wdk-client/Components";
import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";
import { get, isEqual, isEmpty } from "lodash";

export interface SearchResult {
  type?: "result" | "summary";
  description: string;
  display: string;
  match_rank: number;
  primary_key: string;
  record_type: string;
  matched_term: string;
}

interface AutoCompleteSearch {}

//container component, holds state for search and selection
const AutoCompleteSearch: React.FC<AutoCompleteSearch> = () => {
  const [searchTerm, setSearchTerm] = useState<string>(),
    [results, setResults] = useState<SearchResult[]>(),
    [selected, setSelected] = useState<number>(),
    [resultsVisible, setResultsVisible] = useState(false);

  const displayCount = 5;

  const reset = () => {
    setResults(null);
    setSelected(null);
    setSearchTerm(null);
  };

  const _setSearchTerm = (term: string) =>
    term.length > 2 ? setSearchTerm(term) : reset();

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
    undisplayedCount =
      resultsArray.length > displayCount
        ? resultsArray.length - displayCount
        : 0;
  //if we're truncating results list, push in results entry with a bunch of dummy values
  if (undisplayedCount) {
    displayResults.push({
      description: "",
      display: "",
      match_rank: 0,
      matched_term: "",
      record_type: "",
      primary_key: "fake",
      type: "summary"
    });
  }

  return (
    <div className={`autocomplete-box`}>
      <AutoCompleteSearchBox
        onChange={_setSearchTerm}
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
  onChange: (arg: string) => void;
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

const _AutoCompleteSearchBox: React.FC<AutoCompleteSearchBox &
  RouteComponentProps<any>> = ({
  history,
  onChange,
  onKeyDown,
  onResult,
  reset,
  results,
  resultsVisible,
  searchTerm,
  selected,
  setResultsVisible,
  undisplayedCount
}) => {
  const sendRequest = (searchTerm: string) => (service: WdkService) => {
      service
        ._fetchJson<SearchResult[]>("get", `/search/site?term=${searchTerm}`)
        .then(res => onResult(res))
        .catch(e => onResult(null));
    },
    wrappedKeyDown = (e: React.KeyboardEvent) => {
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
  useWdkEffect(sendRequest(searchTerm), [searchTerm]);

  const container = useRef(),
    boxWidth = useRef(0);

  useEffect(() => {
    boxWidth.current = get(container, "current.clientWidth", 0);
  });

  return (
    <div
      className="search-box-with-dropdown"
      onMouseLeave={setResultsVisible.bind(null, false)}
      onMouseEnter={setResultsVisible.bind(null, true)}
    >
      <span className="text-box-container">
        <input
          ref={container}
          onChange={e => onChange(e.currentTarget.value)}
          onFocus={setResultsVisible.bind(null, true)}
          className="form-control"
          onKeyDown={wrappedKeyDown}
          placeholder="Enter a gene or variant"
        />
      </span>
      {/* need to check for search term in case fast typing wiped it out while results are loaded */}
      {!!get(results, "length") && resultsVisible && searchTerm && (
        <div className="results-list">
          {results.map((result, i) => {
            return (
              <ResultRow
                key={`${i}-${result.primary_key}`}
                result={result}
                searchTerm={searchTerm}
                selected={isEqual(selected, result)}
                width={boxWidth.current}
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
  result: SearchResult;
  searchTerm: string;
  selected: boolean;
  width: number;
  children: JSX.Element;
}

const ResultRow: React.FC<ResultRow> = ({
  children,
  result,
  searchTerm,
  selected,
  width
}) => {
  return (
    <Link
      style={{
        width: width + "px",
        backgroundColor: selected ? "#9ca3c1" : "inherit", //$dove-grey
        border: selected ? "#950065 thin solid" : "none" //$light-purple
      }}
      to={
        get(result, "type") === "summary"
          ? _buildSummaryRoute(searchTerm)
          : buildRouteFromResult(result)
      }
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
        <em>{_truncateMatch(result.matched_term, searchTerm, result.record_type)}</em>
      </small>
    </span>
  );
};

const _buildSummaryRoute = (searchTerm: string) =>
  `/searchResults?searchTerm=${searchTerm}`;

export const buildRouteFromResult = (result: SearchResult) =>
  `/record/${result.record_type}/${result.primary_key}`;

const _truncateMatch = (matchedTerm: string, searchTerm: string, recordType: string) => {
  const idx = matchedTerm.toLowerCase().indexOf(searchTerm.toLowerCase()),
    length = searchTerm.length,
    start = idx - 25 >= 0 ? idx - 25 : 0,
    end = idx + length + 25 <= matchedTerm.length ? idx + length + 25 : matchedTerm.length,
    openingEllipsis = start === 0 ? "" : "...",
    closingEllipsis = end <= matchedTerm.length - 4 ? "..." : "",
    _content = safeHtml(matchedTerm),
    content = _content.props.dangerouslySetInnerHTML.__html;

  return `${openingEllipsis}${content.slice(
    start,
    end
  )}${closingEllipsis}`;
};

export default AutoCompleteSearch;
