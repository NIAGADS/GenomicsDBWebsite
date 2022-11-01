import React, { useLayoutEffect, useState, useEffect } from "react";
import igv from "igv/dist/igv.esm";
import { noop, merge } from "lodash";
import { GWASTrack, VariantTrack, GWASServiceReader } from "../../../../lib/igv/CustomTracks";


const HASH_PREFIX = "#/locus/";

interface GenomeBrowser {
    searchUrl: string;
    options: any;
    webAppUrl: string;
    serviceUrl: string;
    locus?: string;
    onBrowserLoad?: (Browser: any) => void;
}

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

        });
       
      
    },[locus, onBrowserLoad]);

    return <span style={{ width: "100%" }} id="genome-browser" />;
}

export default GenomeBrowser;




