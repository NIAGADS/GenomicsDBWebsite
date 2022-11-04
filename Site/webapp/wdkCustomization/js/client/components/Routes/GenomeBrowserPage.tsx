import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { get, find, concat, merge } from "lodash";
import qs from "qs";

import { RootState } from "wdk-client/Core/State/Types";
import { useWdkEffect } from "wdk-client/Service/WdkService";

import Grid from "@material-ui/core/Grid";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import { PrimaryActionButton } from "@components/MaterialUI";

import {
    GenomeBrowser,
    TrackSummary,
    ServiceTrack,
    generateTrackSummary,
    getLoadedTracks,
    removeTrack,
    trackIsLoaded,
    TrackSelector,
    TrackConfig,
} from "@viz/GenomeBrowser";

import { _genomes } from "../../data/_igvGenomes";

const makeReloadKey = () => Math.random().toString(36).slice(2);

const MemoBroswer = React.memo(GenomeBrowser);

interface GenomeBrowserPage {}
interface TrackConfigServiceResponse {
    columns: any,
    tracks: any;
}

const GenomeBrowserPage: React.FC<GenomeBrowserPage> = ({}) => {
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const serviceUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    const [browser, setBrowser] = useState<any>(),
        [listVisible, setListVisible] = useState(false),
        [loadingTrack, setLoadingTrack] = useState<string>(),
        [selectorColumns, setSelectorColumns] = useState<any>(),
       // [reloadKey, setReloadKey] = useState(makeReloadKey()),
        [tracks, setTracks] = useState<TrackSummary[]>(),
        [options, setOptions] = useState(null);

    const toggleTracks = (config: TrackConfig[], browser: any) => {
        config.forEach((c) => {
            trackIsLoaded(c, browser) ? removeTrack(c, browser) : loadTrack(c, browser);
        });
    };

    /* const unloadTrack = (config: TrackConfig, browser: any) => {
        browser.removeTrackByName(config.name);
        //force react to update based on imperative change // i dont think we need this?
        setReloadKey(makeReloadKey());
    }; */

    const buildBrowser = useCallback((b: any) => {
       setBrowser(b);
    }, []);

    const loadTrack = async (config: TrackConfig, browser: any) => {
        setLoadingTrack(config.name);
        await browser.loadTrack(config);
        setLoadingTrack(undefined);
    };


    const parseTrackConfigServiceResponse = (response:TrackConfigServiceResponse) => {
        setTrackList(response['tracks']);
        setSelectorColumns(response['columns']);
    };

    useEffect(() => {
        if (projectId && serviceUrl) {
            let referenceTrackId = projectId === "GRCh37" ? "hg19" : "hg38";
            let referenceTrackConfig = find(_genomes, { id: referenceTrackId });
            setOptions({
                reference: {
                    id: referenceTrackId,
                    name: referenceTrackConfig.name,
                    fastaURL: referenceTrackConfig.fastaURL,
                    indexURL: referenceTrackConfig.indexURL,
                    cytobandURL: referenceTrackConfig.cytobandURL,
                    tracks: referenceTrackConfig.tracks,
                },
            });
        }
    }, [projectId, serviceUrl]);


    useWdkEffect(
        (service) => {
            options &&
                service
                    ._fetchJson<TrackConfigServiceResponse>("GET", `/track/config`)
                    .then(function (res: TrackConfigServiceResponse) {
                        return parseTrackConfigServiceResponse(res);
                    });
                  //  .then((res) => setTrackList(res.map((res) => generateTrackSummary(res))));
            //setTrackList(concat(res.map((res) => transformRawNiagadsTrack(res)),
            //merge(options.reference.tracks[0], { featureType: "Gene", source: "NCBI Gene" }))));
        },
        [serviceUrl, options]
    );

    return (
        <Box marginTop={4}>
            <Grid container item xs={12}>
                {/* 10px on lm assures flush w/ browser, which has 10px margin by default */}
                <Box m="10px">
                    <PrimaryActionButton disabled={!!!trackList} onClick={() => setListVisible(true)}>
                        <LibraryBooksIcon />
                        Browse Tracks
                    </PrimaryActionButton>
                </Box>
            </Grid>
            {projectId ? (
                <Grid>
                    {options ? (
                        <MemoBroswer
                            //locus="ABCA"
                            //disableRefTrack={true}
                            onBrowserLoad={buildBrowser}
                            searchUrl={`${serviceUrl}/track/feature?id=`}
                            serviceUrl={serviceUrl}
                            webAppUrl={webAppUrl}
                            options={options}
                        />
                    ) : (
                        <CircularProgress color="secondary"></CircularProgress>
                    )}
                </Grid>
            ) : (
                <CircularProgress color="secondary" />
            )}
            <Grid item xs={12}>
                {browser ? (
                    <TrackSelector
                        activeTracks={getLoadedTracks(browser)}
                        handleClose={setListVisible.bind(null, false)}
                        isOpen={listVisible}
                        loadingTrack={loadingTrack}
                        toggleTracks={toggleTracks}
                        tracks={tracks}
                        columns={selectorColumns}
                        browser={browser}
                    />
                ) : null}
            </Grid>
        </Box>
    );
};

export default GenomeBrowserPage;
