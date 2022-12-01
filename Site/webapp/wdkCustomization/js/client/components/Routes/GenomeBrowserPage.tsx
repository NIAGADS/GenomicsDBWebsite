import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { get, find, concat, merge } from "lodash";

import { RootState } from "wdk-client/Core/State/Types";
import { useWdkEffect } from "wdk-client/Service/WdkService";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

import { CustomPanel } from "@components/MaterialUI";

import { GenomeBrowser, getLoadedTracks, removeTrack, trackIsLoaded } from "@viz/GenomeBrowser";

import {
    ConfigServiceResponse,
    TrackSelectorRow,
    RawTrackConfig,
    resolveSelectorData,
    TrackSelector,
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
    // [reloadKey, setReloadKey] = useState(makeReloadKey()),

    const classes = useStyles();

    const toggleTracks = (config: RawTrackConfig[], browser: any) => {
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

    const loadTrack = async (config: RawTrackConfig, browser: any) => {
        setLoadingTrack(config.name);
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
                />
            ) : null}

            <MemoBroswer
                //locus="ABCA"
                //disableRefTrack={true}
                onBrowserLoad={buildBrowser}
                searchUrl={`${serviceUrl}/track/feature?id=`}
                serviceUrl={serviceUrl}
                webAppUrl={webAppUrl}
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