import React, { useContext, useEffect, useRef, useState } from "react";
import { StandardTextField } from "./../Shared";
import { Autocomplete } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import { get, isEmpty } from "lodash";
import { WdkServiceContext } from "wdk-client/Service/WdkService";

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
    selected: SearchResult;
    setSelected: (result: SearchResult) => void;
}

export const MultiSearch: React.FC<MultiSearch> = ({ canGrow, selected, setSelected }) => {
    const [open, setOpen] = useState(false),
        [options, setOptions] = useState<SearchResult[]>([]),
        [inputValue, setInputValue] = useState<string>(),
        [searchInProgress, setSearchInProgress] = useState(false),
        wdkService = useContext(WdkServiceContext);

    useEffect(() => {
        if (inputValue && inputValue.length > 2) {
            setSearchInProgress(true);
            wdkService
                ._fetchJson<SearchResult[]>("get", `/search/site?term=${inputValue}`)
                .then((res) => {
                    setSearchInProgress(false);
                    setOptions(isEmpty(res) ? [] : res);
                })
                .catch(() => {
                    setSearchInProgress(false);
                    setOptions([]);
                });
        }
    }, [inputValue, wdkService]);

    return (
        <Autocomplete
            autoComplete
            autoSelect
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            freeSolo
            getOptionSelected={(option, value) => option.primary_key === value.primary_key}
            getOptionLabel={(option) => get(option, "primary_key", "")}
            options={options}
            loading={searchInProgress}
            onChange={(event, newValue: any) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setSelected(newValue);
            }}
            open={open}
            value={selected}
            renderInput={(params) => (
                <StandardTextField
                    {...params}
                    label="Search"
                    InputProps={{
                        ...params.InputProps,
                        placeholder: "Search",
                        endAdornment: (
                            <React.Fragment>
                                {searchInProgress ? <CircularProgress color="inherit" size={20} /> : null}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};
