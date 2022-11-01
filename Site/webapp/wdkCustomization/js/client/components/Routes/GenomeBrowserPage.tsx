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

import { GenomeBrowser, TrackConfig, ServiceTrack, generateTrackConfig } from "@viz/GenomeBrowser";

import { _genomes } from "../../data/_igvGenomes";

const makeReloadKey = () => Math.random().toString(36).slice(2);

const MemoBroswer = React.memo(GenomeBrowser);

interface GenomeBrowserPage {}

const GenomeBrowserPage: React.FC<GenomeBrowserPage> = ({}) => {
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const serviceUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    const [Browser, setBrowser] = useState<any>(),
        [listVisible, setListVisible] = useState(false),
        [loadingTrack, setLoadingTrack] = useState<string>(),
        [reloadKey, setReloadKey] = useState(makeReloadKey()),
        [trackList, setTrackList] = useState<TrackConfig[]>(),
        [options, setOptions] = useState(null),
        [test, setTest] = useState(false);

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
                    ._fetchJson<ServiceTrack[]>("GET", `/track/config`)
                    .then((res) => setTrackList(res.map((res) => generateTrackConfig(res))));
            //setTrackList(concat(res.map((res) => transformRawNiagadsTrack(res)),
            //merge(options.reference.tracks[0], { featureType: "Gene", source: "NCBI Gene" }))));
        },
        [serviceUrl, options]
    );
    return (
        <Box marginTop={4}>
            {projectId ? (
                <Grid>
                    {options ? (
                        <MemoBroswer
                            //locus="ABCA"
                            //disableRefTrack={true}
                            //onBrowserLoad={buildBrowser}
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
        </Box>
    );
};

export default GenomeBrowserPage;
