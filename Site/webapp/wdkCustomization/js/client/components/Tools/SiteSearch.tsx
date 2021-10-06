import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import { isEmpty } from "lodash";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { isString, get } from "lodash";
import { fade, makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        search: {
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.25),
            //backgroundColor: fade(theme.palette.primary.dark, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.primary.dark, 0.15),
                //backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(3),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1.5, 1, 1.5, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: "20ch",
            },
        },
    })
);

export interface SearchResult {
    type?: "result" | "summary";
    description: string;
    display: string;
    match_rank: number;
    primary_key: string;
    record_type: string;
    matched_term: string;
}

interface SiteSearchProps {
    canGrow?: boolean;
    onSelect: (selectedOption: SearchResult, searchTerm: string) => void;
}

export const SiteSearch: React.FC<SiteSearchProps> = ({ canGrow, onSelect }) => {
    const [options, setOptions] = useState<SearchResult[]>([]),
        [inputValue, setInputValue] = useState<string>(""),
        [resetKey, setResetKey] = useState(Math.random().toString(32).slice(2)),
        [searchInProgress, setSearchInProgress] = useState(false);

    const classes = useStyles();

    useWdkEffect(
        (service) => {
            if (inputValue && inputValue.length > 2) {
                setSearchInProgress(true);
                service
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
        },

        [inputValue]
    );

    const reset = () => {
        setInputValue("");
        setResetKey(Math.random().toString(32).slice(2));
        setOptions([]);
    };

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
            onClose={reset}
            onInputChange={(event, newInputValue) => {
                //prevent requery on select
                if (!options.map((o) => o.display).includes(newInputValue)) {
                    setInputValue(newInputValue);
                }
            }}
            onChange={(event: any, selectedValue: string | SearchResult, reason: string) => {
                //seems simpler to hold onto internal state
                //controlling b/c we might want to format differently than getOptionLabel() would have us, which is the default for uncontrolled
                if (inputValue && reason !== "clear") {
                    if (isString(selectedValue)) {
                        onSelect(null, inputValue);
                    } else onSelect(selectedValue, inputValue);
                    reset();
                }
            }}

            renderInput={(params) => {
                const { InputLabelProps, InputProps, ...rest } = params;
                return (
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            //inputProps={{ "aria-label": "search" }}
                            {...rest}
                            {...InputProps}
                            endAdornment={searchInProgress ? <CircularProgress size={16} /> : null}
                        />
                    </div>

                    /* <UnlabeledTextField
                        placeholder="Search by keyword or identifier"
                        {...rest}
                        {...InputProps}
                        startAdornment={<Search fontSize={"small"} htmlColor={theme.palette.grey[600]} />}
                        
                  />*/
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
