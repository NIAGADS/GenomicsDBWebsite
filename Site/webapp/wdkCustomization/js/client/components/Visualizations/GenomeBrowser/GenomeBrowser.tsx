import React, { useLayoutEffect, useState, useEffect } from "react";
import igv from "igv/dist/igv.esm";
import { noop, merge, get } from "lodash";
import { GWASTrack, VariantTrack, GWASServiceReader } from "../../../../lib/igv/CustomTracks";
import { RawTrackConfig } from "@viz/GenomeBrowser/TrackSelector";

const HASH_PREFIX = "#/locus/";

interface GenomeBrowser {
    searchUrl: string;
    options: any;
    webAppUrl: string;
    serviceUrl: string;
    locus?: string;
    onBrowserLoad?: (Browser: any) => void;
}

/* note that id is unreliable, not necessarily passed from config to trackView.track, at least
 --> todo: make sure to pass into config during conversion */
export const getLoadedTracks = (browser: any): string[] =>
    get(browser, "trackViews", []).map((view: any) => view.track.name || view.track.id);

export const trackIsLoaded = (config: RawTrackConfig, browser: any) => getLoadedTracks(browser).includes(config.name);

export const removeTrack = (config: RawTrackConfig, browser: any) => {
    browser.removeTrackByName(config.name);
};


export const GenomeBrowser: React.FC<GenomeBrowser> = ({
    locus,
    searchUrl,
    webAppUrl,
    options,
    serviceUrl,
    onBrowserLoad
}) => {
    useLayoutEffect(() => {
        window.addEventListener("ERROR: Genome Browser - ", (event) => {
            console.log(event);
        });

        options = merge(options, {
            locus: locus || "ABCA7",                
            tracks: [],
            flanking: 1000,
            minimumBases: 40,
            search: {
                url: `${searchUrl}$FEATURE$`,
            }
        });

        const targetDiv = document.getElementById("genome-browser");
        igv.createBrowser(targetDiv, options).then(function (browser:any) {
            // browser is initialized and can now be used
            browser.on('locuschange', function (referenceFrameList: any) {
                let loc = referenceFrameList.map((rf:any) => rf.getLocusString()).join('%20');
                window.location.replace(HASH_PREFIX + loc);
            }); 

            browser.addTrackToFactory(
                "gwas_service",
                (config: any, browser: any) => new GWASTrack(config, browser)
            );

            browser.addTrackToFactory(
                "variant_service",
                (config: any, browser: any) => new VariantTrack(config, browser)
            );

            onBrowserLoad ? onBrowserLoad(browser) : noop();
        });
       
        
    },[locus, onBrowserLoad]);

    return <span style={{ width: "100%" }} id="genome-browser" />;
}

export default GenomeBrowser;




