import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { find } from "lodash";
//import clsx from "clsx";

import { RootState } from "wdk-client/Core/State/Types";
import { useWdkEffect } from "wdk-client/Service/WdkService";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InfoIcon from "@material-ui/icons/Info";

import { CustomPanel } from "@components/MaterialUI";
import AboutThisPageDialog from "@components/Page/AboutGenomeBrowserDialog";

import {
    IGVBrowser as GenomeBrowser,
    DEFAULT_FLANK,
    getLoadedTracks,
    removeTrackById,
    ConfigServiceResponse,
    TrackSelectorRow,
    resolveSelectorData,
    TrackSelector,
    convertRawToIgvTrack,
} from "@viz/GenomeBrowser";

import { _genomes } from "genomics-client/data/genome_browser/_igvGenomes";
import { _trackSelectorTableProperties as properties } from "genomics-client/data/genome_browser/_trackSelector";
import { _externalUrls } from "genomics-client/data/_externalUrls";

const MemoBroswer = React.memo(GenomeBrowser);

const DEFAULT_TRACKS = ["ADSP_17K"];

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: theme.spacing(3),
        },
        selectorHeader: {
            backgroundColor: theme.palette.primary.main,
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(1),
            borderTop: "4px solid " + theme.palette.secondary.main,
            width: "100%",
        },
        selectorHeaderText: {
            color: "white",
            fontSize: "1.3em",
            fontWeight: 500,
            padding: theme.spacing(1.5),
        },
        expand: {
            transform: "rotate(0deg)",
            marginLeft: "auto",
            color: "white",
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            color: "white",
            transform: "rotate(180deg)",
        },
    })
);

const GenomeBrowserPage: React.FC<{}> = () => {
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const serviceUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);

    const [browser, setBrowser] = useState<any>();
    const [browserIsLoaded, setBrowserIsLoaded] = useState<boolean>(false);
    const [trackSelectorIsLoaded, setTrackSelectorIsLoaded] = useState<boolean>(null);
    const [trackSelector, setTrackSelector] = useState<any>();

    const [loadingTrack, setLoadingTrack] = useState<string>(null);
    const [serviceTrackConfig, setServiceTrackConfig] = useState<ConfigServiceResponse>(null);
    const [browserOptions, setBrowserOptions] = useState<any>(null);
    const [triggerRemoveTrack, setTriggerRemoveTrack] = useState<string>(null);
    const [highlightInitialLocus, setHighlightInitialLocus] = useState<string>(null);

    const [aboutThisPageDialogIsOpen, setAboutThisPageDialogIsOpen] = useState(false);

    const closeAboutThisPageDialog = () => {
        setAboutThisPageDialogIsOpen(false);
    };

    const classes = useStyles();

    const resolvedSelectorData: TrackSelectorRow[] = useMemo(
        () => serviceTrackConfig && resolveSelectorData(serviceTrackConfig),
        [serviceTrackConfig]
    );

    const browserTrackConfig: any = useMemo(
        () => serviceTrackConfig && convertRawToIgvTrack([...serviceTrackConfig.tracks]),
        [serviceTrackConfig]
    );

    const loadTracks = (selectedTracks: string[], loadedTracks: string[]) => {
        selectedTracks.forEach((trackKey: string) =>
            browserTrackConfig
                .filter((track: any) => track.id === trackKey)
                .map((track: any) => {
                    // avoid duplicate loads due to aysnc issues
                    !loadedTracks.includes(track.id) && loadTrack(track, browser);
                })
        );
    };

    const unloadTracks = (selectedTracks: string[], loadedTracks: string[]) => {
        const removedTracks = loadedTracks.filter((track) => !selectedTracks.includes(track));
        removedTracks.forEach((trackKey: string) =>
            browserTrackConfig
                .filter((track: any) => track.id === trackKey)
                .map((track: any) => {
                    removeTrackById(track.id, browser);
                })
        );
    };

    const toggleTracks = useCallback(
        (selectedTracks: string[]) => {
            if (browser && browserTrackConfig) {
                const loadedTracks = getLoadedTracks(browser);
                loadTracks(selectedTracks, loadedTracks);
                unloadTracks(selectedTracks, loadedTracks);
            }
        },
        [browser, browserTrackConfig]
    );

    useEffect(() => {
        if (triggerRemoveTrack) {
            updateSelectorTrackState([triggerRemoveTrack], "remove");
            setTriggerRemoveTrack(null);
        }
    }, [triggerRemoveTrack]);

    const updateSelectorTrackState = useCallback(
        (tracks: string[], action: "add" | "remove") => {
            if (action === "add") {
                // need to validate tracks before trying to add
                let invalidTracks: string[] = [];
                tracks.forEach((id: string) => {
                    if (trackSelector.data.filter((row: any) => row.row_id === id).length > 0) {
                        trackSelector.toggleRowSelected(id, true);
                    } else {
                        invalidTracks.push(id);
                    }
                });
                if (invalidTracks.length > 0) {
                    alert(
                        `Invalid track identifier(s): ${invalidTracks.toString()} specified in URL string or session file.\nNOTE: track identifiers are CASE SENSITIVE.`
                    );
                }
            } else {
                tracks.forEach((id: string) => {
                    trackSelector.toggleRowSelected(id, false);
                });
            }
        },
        [trackSelector]
    );

    const initializeBrowser = useCallback((b: any) => {
        setBrowser(b);
        setBrowserIsLoaded(true);
    }, []);

    const initializeTrackSelector = useCallback((s: any) => {
        setTrackSelector(s);
        setTrackSelectorIsLoaded(true);
    }, []);

    // load initTracks, files and ROI from query string
    useEffect(() => {
        if (browserIsLoaded && trackSelectorIsLoaded) {
            // if locus passed through query string, highlight
            if (highlightInitialLocus !== null) {
                const initialFrame: any = browser.referenceFrameList[0];
                const regionOfInterest = [
                    {
                        name: "Initial Locus",
                        color: "rgba(245,215,95,0.5)",
                        features: [
                            {
                                chr: initialFrame.chr,
                                start: initialFrame.start + DEFAULT_FLANK,
                                end: initialFrame.end - DEFAULT_FLANK,
                                name: highlightInitialLocus,
                            },
                        ],
                    },
                ];

                browser.loadROI(regionOfInterest);
            }

            // load initial tracks from query string
            //let loadedTracks = getLoadedTracks(browser); // reference tracks
            if (browser.config.initTracks) {
                //loadTracks(browser.config.initTracks, loadedTracks);
                updateSelectorTrackState(browser.config.initTracks, "add");
            }

            // load files from query string
            if (browser.config.hasOwnProperty("files")) {
                const filesAreIndexed = browser.config.files.indexed;
                let fileIds: string[] = [];
                browser.config.files.urls.forEach((url: string) => {
                    const id = "file_" + url.split("/").pop().replace(/\..+$/, "");
                    const newTrackConfig = filesAreIndexed
                        ? { url: url, indexURL: url + ".tbi", label: "USER: " + id, id: id }
                        : { url: url, label: "USER: " + id, id: id };

                    browser.loadTrack(newTrackConfig).catch(function (error: any) {
                        alert("Unable to load user track from: " + url + "\n" + error.toString());
                    });
                });
            }

            // regions of interest
        }
    }, [browserIsLoaded, trackSelectorIsLoaded]);

    const loadTrack = async (config: any, browser: any) => {
        setLoadingTrack(config.id);
        await browser.loadTrack(config);
        setLoadingTrack(undefined);
    };

    const parseTrackConfigServiceResponse = (response: ConfigServiceResponse) => {
        setServiceTrackConfig(response);
    };

    const setUrls = useCallback(
        (track: any) => {
            if (webAppUrl) {
                track.url = track.url.replace("@WEBAPP_URL@", webAppUrl);
                track.indexURL = track.indexURL.replace("@WEBAPP_URL@", webAppUrl);
            }
            return track;
        },
        [webAppUrl]
    );

    useEffect(() => {
        if (projectId) {
            const referenceTrackId = projectId === "GRCh37" ? "hg19" : "hg38";
            const referenceTrackConfig = find(_genomes, { id: referenceTrackId });

            // set gene track urls
            referenceTrackConfig.tracks[0] = setUrls(referenceTrackConfig.tracks[0]);
            let boptions = {
                reference: {
                    id: referenceTrackId,
                    name: referenceTrackConfig.name,
                    fastaURL: referenceTrackConfig.fastaURL,
                    indexURL: referenceTrackConfig.indexURL,
                    cytobandURL: referenceTrackConfig.cytobandURL,
                    tracks: referenceTrackConfig.tracks,
                },
                loadDefaultGenomes: false,
                genomeList: _genomes,
            };

            const queryParams = new URLSearchParams(window.location.search);
            let locus = queryParams.get("locus");
            let label = queryParams.get("roiLabel");
            if (locus) {
                if (locus.startsWith("chr")) {
                    let [chr, position] = locus.split(":");
                    position = position.replace(/,/g, ""); // remove any commas
                    let start = position.includes("-") ? parseInt(position.split("-")[0]) : parseInt(position);
                    let end = position.includes("-") ? parseInt(position.split("-")[1]) : parseInt(position);
                    start = start - DEFAULT_FLANK;
                    end = end + DEFAULT_FLANK;
                    locus = chr + ":" + start.toString() + "-" + end.toString();
                }
                boptions = Object.assign(boptions, { locus: locus });
                setHighlightInitialLocus(label ? label : locus);
            }

            const initTracks = queryParams.get("track")
                ? queryParams.get("track").split(",").concat(DEFAULT_TRACKS)
                : DEFAULT_TRACKS;
            const tSet = new Set(initTracks); // remove duplicates
            boptions = Object.assign(boptions, { initTracks: Array.from(tSet) });

            if (queryParams.get("file")) {
                const files = queryParams.get("file").split(",");
                const fSet = new Set(files);

                // indexed = "" means &indexed was in the url, but not set
                // as opposed to &indexed=true or &indexed=false
                // indexed is null means, &indexed was not in the url
                let indexed = queryParams.get("indexed") === null ? "false" : queryParams.get("indexed");

                boptions = Object.assign(boptions, {
                    files: { urls: Array.from(fSet), indexed: indexed === "" || indexed === "true" ? true : false },
                });
            }

            setBrowserOptions(boptions);
        }
    }, [projectId, webAppUrl]);

    useWdkEffect((service) => {
        service._fetchJson<ConfigServiceResponse>("GET", `/track/config`).then(function (res: ConfigServiceResponse) {
            return parseTrackConfigServiceResponse(res);
        });
    }, []);

    return (
        <>
            {browserOptions && serviceUrl && webAppUrl && resolvedSelectorData ? (
                <CustomPanel
                    hasBaseArrow={false}
                    className={classes.panel}
                    alignItems="flex-start"
                    justifyContent="space-between"
                >
                    <Grid item container sm={12} justifyContent="flex-end" alignItems="baseline">
                        <Grid item>
                            <Button
                                endIcon={<InfoIcon />}
                                size="small"
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    setAboutThisPageDialogIsOpen(true);
                                }}
                            >
                                About this Page
                            </Button>
                        </Grid>
                    </Grid>
                    <MemoBroswer
                        webAppUrl={webAppUrl}
                        onBrowserLoad={initializeBrowser}
                        onTrackRemoved={setTriggerRemoveTrack}
                        searchUrl={`${serviceUrl}/track/feature?&id=`}
                        options={browserOptions}
                    />

                    <Box className={classes.selectorHeader}>
                        <Typography variant="h3" className={classes.selectorHeaderText}>
                            Select Tracks
                        </Typography>
                    </Box>

                    <TrackSelector
                        properties={properties}
                        columnConfig={serviceTrackConfig.columns}
                        data={resolvedSelectorData}
                        handleTrackSelect={toggleTracks}
                        onSelectorLoad={initializeTrackSelector}
                    />
                </CustomPanel>
            ) : (
                <CustomPanel>
                    <Typography component="span">
                        Loading...
                        <CircularProgress size="small" color="secondary" />
                    </Typography>
                </CustomPanel>
            )}
            <AboutThisPageDialog
                isOpen={aboutThisPageDialogIsOpen}
                handleClose={closeAboutThisPageDialog}
            ></AboutThisPageDialog>
        </>
    );
};

export default GenomeBrowserPage;
