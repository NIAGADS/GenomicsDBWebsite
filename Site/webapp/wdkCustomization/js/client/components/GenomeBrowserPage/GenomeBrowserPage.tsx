import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import qs from "qs";
import Container from "@material-ui/core/Container";
import { theme } from "@components/MaterialUI";
import TrackBrowser, { IgvTrackConfig } from "@viz/Igv/IgvTrackBrowser";
import IGVBrowser from "@viz/Igv/IgvBrowser";
import { ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import Box from "@material-ui/core/Box";
import { get } from "lodash";
import { useWdkEffect } from "wdk-client/Service/WdkService";
import { PrimaryActionButton } from "@components/MaterialUI";
import { NiagadsGeneReader } from "../../../lib/igv/NiagadsTracks";
import CircularProgress from "@material-ui/core/CircularProgress";


const makeReloadKey = () => Math.random().toString(36).slice(2);

const MemoBroswer = React.memo(IGVBrowser);

interface GenomeBrowserPage {

}

const GenomeBrowserPage: React.FC<GenomeBrowserPage> = ({  }) => {
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const serviceUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);

    useWdkEffect(
        (service) => {
            service._fetchJson<NiagadsRawTrackConfig[]>("GET", `/track/config`).then((res) =>
                setTrackList(
                    res
                        .map((res) => transformRawNiagadsTrack(res))
                        .map((t) =>
                            //we have to manually attach the reader to the config coming out of the backend
                            t.track === "ENSEMBL_GENE"
                                ? {
                                      ...t,
                                      reader: new NiagadsGeneReader(`${serviceUrl}/track/gene`),
                                      trackType: "annotation",
                                  }
                                : t
                        )
                )
            );
        },

        [serviceUrl]
    );

    const [Browser, setBrowser] = useState<any>(),
        [listVisible, setListVisible] = useState(false),
        [loadingTrack, setLoadingTrack] = useState<string>(),
        [reloadKey, setReloadKey] = useState(makeReloadKey()),
        [trackList, setTrackList] = useState<NiagadsBrowserTrackConfig[]>();

    const refGeneTrack = useMemo(() => {
        if (trackList) {
            const refGeneTrack = trackList.find((t) => t.track === "ENSEMBL_GENE"),
                { url, format, reader, name } = refGeneTrack,
                trackConfig: IgvTrackConfig = {
                    displayMode: "expanded",
                    format,
                    id: name,
                    name,
                    reader,
                    type: "annotation",
                    url,
                    visibilityWindow: -1,
                };
            return trackConfig;
        } else return null;
    }, [trackList]);

    const loadTrack = async (config: TrackConfig) => {
            setLoadingTrack(config.name);
            await Browser.loadTrack(config);
            setLoadingTrack(undefined);
        },
        getTrackIsLoaded = (config: TrackConfig) => getLoadedTracks(Browser).includes(config.name);

    //since we're going to treat the ref track like any other track in our track list
    //we're not going to load it from the start but rather wait till the list comes in,
    //grab it from the list, and load it ourselves
    useEffect(() => {
        if (trackList && Browser && refGeneTrack) {
            if (!getTrackIsLoaded(refGeneTrack)) {
                loadTrack(refGeneTrack);
            }
        }
    }, [trackList, Browser, refGeneTrack]);

    const location = useLocation();

    const defaultSpan = useMemo(() => {
        return get(qs.parse(location.search), "locus") as string;
    }, [location.search]);

    const toggleTracks = (config: TrackConfig[]) => {
            config.forEach((c) => {
                getTrackIsLoaded(c) ? unloadTrack(c) : loadTrack(c);
            });
        },
        unloadTrack = (config: TrackConfig) => {
            Browser.removeTrackByName(config.name);
            //force react to update based on imperative change // i dont think we need this?
            setReloadKey(makeReloadKey());
        },
        buildBrowser = useCallback((b: any) => {
            setBrowser(b);
        }, []);

    return (
        projectId ? <Container maxWidth="xl">
                <Grid container item xs={12}>
                    {/* 10px on lm assures flush w/ browser, which has 10px margin by default */}
                  <Box m="10px">
                        <PrimaryActionButton disabled={!!!trackList} onClick={() => setListVisible(true)}>
                            <LibraryBooksIcon />
                            Browse Tracks
                        </PrimaryActionButton>
                    </Box>
                </Grid>
                <Grid>
                    <MemoBroswer
                        defaultSpan={defaultSpan}
                        disableRefTrack={true}
                        onBrowserLoad={buildBrowser}
                        searchUrl={`${serviceUrl}/track/feature?id=`}
                        serviceUrl={serviceUrl}
                        webappUrl={webAppUrl}
                        projectId={projectId}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TrackBrowser
                        activeTracks={getLoadedTracks(Browser)}
                        handleClose={setListVisible.bind(null, false)}
                        isOpen={listVisible}
                        loadingTrack={loadingTrack}
                        toggleTracks={toggleTracks}
                        trackList={trackList}
    /> 
               </Grid> 
        </Container>: <CircularProgress color="secondary"/> 
    );
};



export interface TrackConfig {
    name: string;
    format?: string;
    displayMode: string;
    height?: number;
    url: string;
    indexURL?: string;
    visibilityWindow: number;
}

/* note that id is unreliable, not necessarily passed from config to trackView.track, at least --> todo: make sure to pass into config during conversion */
const getLoadedTracks = (browser: any): string[] =>
    get(browser, "trackViews", []).map((view: any) => view.track.name || view.track.id);

const transformRawNiagadsTrack = (track: NiagadsRawTrackConfig): NiagadsBrowserTrackConfig => {
    const { endpoint, feature_type, path, phenotypes, track_type, track_type_display, ...rest } = track,
        niagadsConfig = (rest as unknown) as NiagadsBrowserTrackConfig;

    if (track.endpoint) {
        niagadsConfig.url = `${track.endpoint}?track=${track.track}`;
    }

    if (track.path) {
        niagadsConfig.url = track.path;
    }

    niagadsConfig.trackType = track.track_type;
    niagadsConfig.trackTypeDisplay = track.track_type_display;
    niagadsConfig.featureType = track.feature_type;

    niagadsConfig.phenotypes = (phenotypes || []).reduce(
        (a, c) => a + "\n" + Object.keys(c)[0].toUpperCase() + " : " + Object.values(c)[0],
        ""
    );

    return niagadsConfig;
};

interface NiagadsBaseTrackConfig {
    description?: string; //for browser
    format?: string; //bed, etc
    label: string; // for track popover
    name: string; //for display in track browser
    source: string; //for display in track browser
}

interface NiagadsRawTrackConfig extends NiagadsBaseTrackConfig {
    endpoint?: string; //for async tracks only
    feature_type: string; //gene, variant, enhancer, etc., for categorizing
    path?: string; //for filer -- can pass in as url
    phenotypes: { [key: string]: string }[]; //for browser filter
    track: string; //unique id (pass to backend for async), for instance
    track_type: string; //igv track type
    track_type_display: string; //niagads track type
}

export interface NiagadsBrowserTrackConfig extends NiagadsBaseTrackConfig {
    featureType: string;
    phenotypes: string;
    reader?: any;
    track: string;
    trackType: string;
    trackTypeDisplay: string;
    url: string;
}
