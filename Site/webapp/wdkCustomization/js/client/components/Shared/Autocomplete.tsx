import React, { useContext, useEffect, useState } from "react";
import { UnlabeledTextField } from "./../Shared";
import { Autocomplete } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Search from "@material-ui/icons/Search";
import { isEmpty } from "lodash";
import { WdkServiceContext } from "wdk-client/Service/WdkService";
import { useTheme } from "@material-ui/core";
import { isString, get } from "lodash";

export interface SearchResult {
    type?: "result" | "summary";
    description: string;
    display: string;
    match_rank: number;
    primary_key: string;
    record_type: string;
    matched_term: string;
}

interface MultiSearch {
    canGrow?: boolean;
    onSelect: (selectedOption: SearchResult, searchTerm: string) => void;
}

export const MultiSearch: React.FC<MultiSearch> = ({ canGrow, onSelect }) => {
    const [options, setOptions] = useState<SearchResult[]>([]),
        [inputValue, setInputValue] = useState<string>(""),
        [resetKey, setResetKey] = useState(Math.random().toString(32).slice(2)),
        [searchInProgress, setSearchInProgress] = useState(false),
        wdkService = useContext(WdkServiceContext);

    useEffect(() => {
        if (inputValue && inputValue.length > 2) {
            setSearchInProgress(true);
            wdkService
                ._fetchJson<SearchResult[]>("get", `/search/site?term=${inputValue}`)
                .then((res) => {
                    setSearchInProgress(false);
                    setOptions(
                        isEmpty(res)
                            ? []
                            : res.slice(0, 5).concat(
                                  res.length > 5
                                      ? [
                                            {
                                                type: "summary",
                                                match_rank: 0,
                                                matched_term: "click to view full results",
                                                record_type: "dummy",
                                                description: "dummy",
                                                display: `...and ${res.length - 5} more`,
                                                primary_key: "dummy",
                                            },
                                        ]
                                      : []
                              )
                    );
                })
                .catch(() => {
                    setSearchInProgress(false);
                    setOptions([]);
                });
        }
    }, [inputValue, wdkService]);

    const theme = useTheme();

    return (
        <Autocomplete
            key={resetKey}
            style={{ flexGrow: 1 }}
            autoComplete
            clearOnEscape
            //we're filtering on the server, so no need to filter here
            //also, we don't want our summary option filtered
            filterOptions={(results) => results}
            freeSolo
            fullWidth={canGrow}
            getOptionSelected={(option, value) => option.primary_key === value.primary_key}
            getOptionLabel={(option) => get(option, "matched_term", "")}
            includeInputInList={true}
            noOptionsText="No Results"
            options={options}
            loading={searchInProgress}
            onInputChange={(event, newInputValue) => {
                //prevent requery on select
                if (!options.map((o) => o.display).includes(newInputValue)) {
                    setInputValue(newInputValue);
                }
            }}
            onChange={(event: any, selectedValue: string | SearchResult) => {
                //seems simpler to hold onto internal state
                //controlling b/c we might want to format differently than getOptionLabel() would have us, which is the default for uncontrolled
                setInputValue("");
                setResetKey(Math.random().toString(32).slice(2));
                if (isString(selectedValue)) {
                    onSelect(null, inputValue);
                } else onSelect(selectedValue, inputValue);
            }}
            renderInput={(params) => {
                const { InputLabelProps, InputProps, ...rest } = params;
                return (
                    <UnlabeledTextField
                        placeholder="Search by keyword or identifier"
                        {...rest}
                        {...InputProps}
                        startAdornment={<Search fontSize={"small"} htmlColor={theme.palette.grey[600]} />}
                        endAdornment={searchInProgress ? <CircularProgress size={16} /> : null}
                    />
                );
            }}
            renderOption={(option) => (
                <span>
                    {option.type === "summary" ? <strong>{option.display}</strong> : option.display}&nbsp;
                    <small>
                        <em>{_truncateMatch(option.matched_term, inputValue)}</em>
                    </small>
                </span>
            )}
            value={""}
        />
    );
};

const _truncateMatch = (matchedTerm: string, searchTerm: string) => {
    const offset = matchedTerm.toLowerCase().indexOf(searchTerm.toLowerCase()),
        start = offset > 25 ? offset - 25 : 0,
        length = searchTerm.length,
        end = offset + length + 25 <= matchedTerm.length ? offset + length + 25 : matchedTerm.length,
        openingEllipsis = start === 0 ? "" : "...",
        closingEllipsis = end <= matchedTerm.length - 4 ? "..." : "";

    return `${openingEllipsis}${matchedTerm.slice(start, end)}${closingEllipsis}`;
};
