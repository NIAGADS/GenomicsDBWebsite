import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { find } from "lodash";

import { RootState } from "wdk-client/Core/State/Types";
import { useWdkEffect } from "wdk-client/Service/WdkService";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { CustomPanel } from "@components/MaterialUI";

import { GenomeBrowser, getLoadedTracks, removeTrackById } from "@viz/GenomeBrowser";

import {
    ConfigServiceResponse,
    TrackSelectorRow,
    resolveSelectorData,
    TrackSelector,
    convertRawToIgvTrack,
} from "@viz/GenomeBrowser/TrackSelector";

import { _genomes } from "genomics-client/data/genome_browser/_igvGenomes";

const makeReloadKey = () => Math.random().toString(36).slice(2);
const MemoBroswer = React.memo(GenomeBrowser);

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: theme.spacing(3),
            //paddingLeft: "50px",
        },
    })
);

const GenomeBrowserPage: React.FC<{}> = () => {
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const serviceUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    const [browser, setBrowser] = useState<any>();
    const [trackSelectorIsOpen, setTrackSelectorIsOpen] = useState<boolean>(false);
    const [loadingTrack, setLoadingTrack] = useState<string>(null);
    const [serviceTrackConfig, setServiceTrackConfig] = useState<ConfigServiceResponse>(null);
    const [browserOptions, setBrowserOptions] = useState<any>(null);
    const [loadedTracks, setLoadedTracks] = useState<any>(null);

    // [reloadKey, setReloadKey] = useState(makeReloadKey()),

    const classes = useStyles();

    

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

    const toggleTracks = (selectedTracks: string[]) => {
        if (browser && browserTrackConfig) {
            const loadedTracks = getLoadedTracks(browser);
            loadTracks(selectedTracks, loadedTracks);
            unloadTracks(selectedTracks, loadedTracks);
            setLoadedTracks(selectedTracks);
        }
    };



    /* const unloadTrack = (config: TrackConfig, browser: any) => {
        browser.removeTrackByName(config.name);
        //force react to update based on imperative change // i dont think we need this?
        setReloadKey(makeReloadKey());
    }; */

    const buildBrowser = useCallback((b: any) => {
        setBrowser(b);
    }, []);

    const loadTrack = async (config: any, browser: any) => {
        setLoadingTrack(config.id);
        await browser.loadTrack(config);
        setLoadingTrack(undefined);
    };

    const parseTrackConfigServiceResponse = (response: ConfigServiceResponse) => {
        setServiceTrackConfig(response);
    };

    useEffect(() => {
        if (projectId) {
            const referenceTrackId = projectId === "GRCh37" ? "hg19" : "hg38";
            const referenceTrackConfig = find(_genomes, { id: referenceTrackId });
            setBrowserOptions({
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
    }, [projectId]);

    useWdkEffect((service) => {
        service._fetchJson<ConfigServiceResponse>("GET", `/track/config`).then(function (res: ConfigServiceResponse) {
            return parseTrackConfigServiceResponse(res);
        });
    }, []);

    const resolvedSelectorData: TrackSelectorRow[] = useMemo(
        () => serviceTrackConfig && resolveSelectorData(serviceTrackConfig),
        [serviceTrackConfig]
    );

    const browserTrackConfig: any = useMemo(
        () => serviceTrackConfig && convertRawToIgvTrack([...serviceTrackConfig.tracks]),
        [serviceTrackConfig]
    );

    return browserOptions && serviceUrl && webAppUrl && resolvedSelectorData ? (
        <CustomPanel
            hasBaseArrow={false}
            className={classes.panel}
            alignItems="flex-start"
            justifyContent="space-between"
        >
            {browser ? (
                <TrackSelector
                    browser={browser}
                    isOpen={trackSelectorIsOpen}
                    handleClose={setTrackSelectorIsOpen.bind(null, false)}
                    columnConfig={serviceTrackConfig.columns}
                    data={resolvedSelectorData}
                    loadedTracks={loadedTracks}
                    handleTrackSelect={toggleTracks}
                />
            ) : null}

            <MemoBroswer
                //locus="ABCA"
                //disableRefTrack={true}
                onBrowserLoad={buildBrowser}
                searchUrl={`${serviceUrl}/track/feature?id=`}
                options={browserOptions}
            />
        </CustomPanel>
    ) : (
        <CustomPanel>
            <Typography component="span">
                Loading...
                <CircularProgress size="small" color="secondary" />
            </Typography>
        </CustomPanel>
    );
};

export default GenomeBrowserPage;
