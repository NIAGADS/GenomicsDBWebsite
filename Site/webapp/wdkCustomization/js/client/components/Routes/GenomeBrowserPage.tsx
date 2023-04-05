import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { find } from "lodash";
//import clsx from "clsx";

import { RootState } from "wdk-client/Core/State/Types";
import { useWdkEffect } from "wdk-client/Service/WdkService";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
//import IconButton from "@material-ui/core/IconButton";
//import Collapse from "@material-ui/core/Collapse";
//import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { CustomPanel } from "@components/MaterialUI";

import {
    IGVBrowser as GenomeBrowser,
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
const DEFAULT_ADSP_TRACK = 'ADSP_17K';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: theme.spacing(3),
            //paddingLeft: "50px",
        },
        selectorHeader: {
            backgroundColor: theme.palette.primary.main,
            //backgroundColor: "#f0f1f2",
            // borderRadius: "4px",
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

    const setUrls = useCallback((track: any) => {
        if (webAppUrl) {
            track.url = track.url.replace('@WEBAPP_URL@', webAppUrl);
            track.indexURL = track.indexURL.replace('@WEBAPP_URL@', webAppUrl);
        }
        return track;
    }, [webAppUrl]);

    const resolvedSelectorData: TrackSelectorRow[] = useMemo(
        () => serviceTrackConfig && resolveSelectorData(serviceTrackConfig),
        [serviceTrackConfig]
    );

    const browserTrackConfig: any = useMemo(
        () => serviceTrackConfig && convertRawToIgvTrack([...serviceTrackConfig.tracks]),
        [serviceTrackConfig]
    );


    useEffect(() => {
        if (projectId && browserTrackConfig) {
            const referenceTrackId = projectId === "GRCh37" ? "hg19" : "hg38";
            let referenceTrackConfig = find(_genomes, { id: referenceTrackId });

            // set gene track urls
            referenceTrackConfig.tracks[0] = setUrls(referenceTrackConfig.tracks[0]);

            //const adspTrack = browserTrackConfig.filter((tc:any) => tc.id == DEFAULT_ADSP_TRACK)[0];
            //referenceTrackConfig.tracks.push(adspTrack);

            setBrowserOptions({
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
            });
        }
    }, [projectId, webAppUrl, browserTrackConfig]);

    useWdkEffect((service) => {
        service._fetchJson<ConfigServiceResponse>("GET", `/track/config`).then(function (res: ConfigServiceResponse) {
            return parseTrackConfigServiceResponse(res);
        });
    }, []);

    return browserOptions && serviceUrl && webAppUrl && resolvedSelectorData ? (
        <CustomPanel
            hasBaseArrow={false}
            className={classes.panel}
            alignItems="flex-start"
            justifyContent="space-between"
        >
            <MemoBroswer
                //locus="ABCA"
                //disableRefTrack={true}
                webAppUrl={webAppUrl}
                onBrowserLoad={buildBrowser}
                searchUrl={`${serviceUrl}/track/feature?id=`}
                options={browserOptions}
            />

            <Box className={classes.selectorHeader}>
                <Typography variant="h3" className={classes.selectorHeaderText}>
                    Select Tracks
                </Typography>
                {/*<IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: trackSelectorIsOpen,
                    })}
                    onClick={() => {setTrackSelectorIsOpen(!trackSelectorIsOpen)}}
                    aria-expanded={trackSelectorIsOpen}
                    size="small"
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>*/}
            </Box>

            <TrackSelector
                properties={properties}
                columnConfig={serviceTrackConfig.columns}
                data={resolvedSelectorData}
                loadedTracks={loadedTracks}
                handleTrackSelect={toggleTracks}
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
