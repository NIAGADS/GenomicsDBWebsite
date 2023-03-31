import React, { useLayoutEffect } from "react";
import igv from "igv/dist/igv.esm";
import { noop, merge, get } from "lodash";
import { GWASTrack } from "@viz/GenomeBrowser";


const HASH_PREFIX = "#/locus/";
const ALWAYS_ON_TRACKS = ["ideogram", "ruler", "sequence", "REFSEQ_GENE"];

interface IGVBrowser {
    searchUrl: string;
    options: any;
    locus?: string;
    onTrackRemoved?: (tracks: any) => void;
    onBrowserLoad?: (Browser: any) => void;
}

//loadedTracks.filter((track) => !selectedTracks.includes(track));


const getTrackID = (trackView: any) => {
    const track = trackView.track;
    return 'id' in track ? track.id : track.config.id
}

export const getLoadedTracks = (browser: any): string[] =>
    get(browser, "trackViews", []).map((view: any) => getTrackID(view)).filter((track: string) => !ALWAYS_ON_TRACKS.includes(track));

export const trackIsLoaded = (config: any, browser: any) => getLoadedTracks(browser).includes(config.id);

// we want to find track by ID b/c some names may be duplicated; so modeled after:
// https://github.com/igvteam/igv.js/blob/0dfb1f7b02d9660ff1ef0169899c4711496158e8/js/browser.js#L1104
export const removeTrackById = (trackId: string, browser: any) => {
    const trackViews = get(browser, "trackViews", []);
    const trackView = trackViews.filter((view: any) => getTrackID(view) === trackId);
    browser.removeTrack(trackView[0].track);
};

export const IGVBrowser: React.FC<IGVBrowser> = ({ locus, searchUrl, options, onBrowserLoad, onTrackRemoved }) => {

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
            },
        });

        const targetDiv = document.getElementById("genome-browser");
        igv.createBrowser(targetDiv, options).then(function (browser: any) {
            // browser is initialized and can now be used
            browser.on("locuschange", function (referenceFrameList: any) {
                let loc = referenceFrameList.map((rf: any) => rf.getLocusString()).join("%20");
                window.location.replace(HASH_PREFIX + loc);
            });

            // perform action in encapsulating component if track is removed
            browser.on('trackremoved', function (removedTracks: any) {
                alert('tracks removed');
                console.log(removedTracks);
                onTrackRemoved && onTrackRemoved(removedTracks);
            });

            browser.addTrackToFactory("gwas_service", (config: any, browser: any) => new GWASTrack(config, browser));

           /* browser.addTrackToFactory(
                "variant_service",
                (config: any, browser: any) => new VariantTrack(config, browser)
            ); */

            onBrowserLoad ? onBrowserLoad(browser) : noop();
        });
    }, [locus, onBrowserLoad]);

    return <span style={{ width: "100%" }} id="genome-browser" />;
};

export default IGVBrowser;
