import React, { useEffect, useRef, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { TextBox, Link } from "wdk-client/Components";
import { CompositeService as WdkService } from "wdk-client/Service/ServiceMixins";
import { get, isEqual } from "lodash";

interface SearchResult {
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
    [width, setWidth] = useState<number>();

  const randomClass = useRef(
    Math.random()
      .toString(36)
      .slice(2)
  ).current;

  useEffect(() => {
    const boxWidth = get(
      window.document.querySelectorAll(`.${randomClass}`),
      "[0].clientWidth",
      0
    );

    if (boxWidth != width) {
      setWidth(boxWidth);
    }
  });

  const _setResults = (results: SearchResult[]) =>
    setResults((Array.isArray(results) ? results : []).slice(0, 15));

  const _setSearchTerm = (term: string) =>
    term.length > 2 ? setSearchTerm(term) : reset();

  const reset = () => {
    setResults(null);
    setSelected(null);
    setSearchTerm(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    switch (e.keyCode) {
      //down arrow
      case 40:
        return setSelected(
          selected == null
            ? 0
            : selected < results.length - 1
            ? selected + 1
            : 0
        );
      //up arrow
      case 38:
        return setSelected(selected > 0 ? selected - 1 : null);
      //esc
      case 27:
        return reset();
    }
  };

  return (
    <div className={`autocomplete-box ${randomClass}`}>
      <AutoCompleteSearchBox
        onChange={_setSearchTerm}
        onKeyDown={onKeyDown}
        onResult={_setResults}
        reset={reset}
        results={results}
        searchTerm={searchTerm}
        selected={get(results, `[${selected}]`)}
        width={width}
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
  results: SearchResult[];
  searchTerm: string;
  selected?: SearchResult;
  width: number;
}

const _AutoCompleteSearchBox: React.FC<AutoCompleteSearchBox &
  RouteComponentProps<any>> = ({
  history,
  onChange,
  onKeyDown,
  onResult,
  reset,
  results,
  searchTerm,
  selected,
  width
}) => {
  const sendRequest = (searchTerm: string) => (service: WdkService) => {
      service
        ._fetchJson<SearchResult[]>("get", `/search/site?term=${searchTerm}`)
        .then(res => onResult(res))
        .catch(e => console.log("caught: " + e));
    },
    wrappedKeyDown = (e: React.KeyboardEvent) => {
      //enter
      if (e.keyCode === 13 && selected) {
        history.push("/" + _buildRouteFromResult(selected));
        reset();
      } else {
        onKeyDown(e);
      }
    };
  useWdkEffect(sendRequest(searchTerm), [searchTerm]);
  return (
    <div className="search-box-with-dropdown">
      <span className="text-box-container">
        <TextBox
          onChange={onChange}
          className="form-control"
          onKeyDown={wrappedKeyDown}
          placeholder="Enter a gene or variant"
        />
      </span>
      {results && (
        <div className="results-list">
          {results.map((result, i) => {
            return (
              <ResultRow
                result={result}
                key={`${i}-${result.primary_key}`}
                width={width}
                selected={isEqual(selected, result)}
              >
                {result.display}
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
  selected: boolean;
  width: number;
}

const ResultRow: React.FC<ResultRow> = ({
  children,
  result,
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
      to={_buildRouteFromResult(result)}
    >
      {children}
    </Link>
  );
};

const _buildRouteFromResult = (result: SearchResult) =>
  `record/${result.record_type}/${result.primary_key}`;

export default AutoCompleteSearch;
