import React, { useLayoutEffect } from "react";
import igv from "igv/dist/igv.esm";
import { noop, merge, get } from "lodash";
import { GWASServiceTrack as GWASTrack, VariantServiceTrack as VariantTrack } from "@viz/GenomeBrowser";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

const HASH_PREFIX = "#/locus/";
const ALWAYS_ON_TRACKS = ["ideogram", "ruler", "sequence", "REFSEQ_GENE"];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popupTable: {
            background: "transparent",
            position: "relative",
            top: theme.spacing(3),
        },
    })
);

interface IGVBrowser {
    searchUrl: string;
    options: any;
    locus?: string;
    onTrackRemoved?: (track: string) => void;
    onBrowserLoad?: (Browser: any) => void;
}

//loadedTracks.filter((track) => !selectedTracks.includes(track));

const getTrackID = (trackView: any) => {
    const track = trackView.track;
    return "id" in track ? track.id : track.config.id;
};

export const getLoadedTracks = (browser: any): string[] =>
    get(browser, "trackViews", [])
        .map((view: any) => getTrackID(view))
        .filter((track: string) => !ALWAYS_ON_TRACKS.includes(track));

export const trackIsLoaded = (config: any, browser: any) => getLoadedTracks(browser).includes(config.id);

// we want to find track by ID b/c some names may be duplicated; so modeled after:
// https://github.com/igvteam/igv.js/blob/0dfb1f7b02d9660ff1ef0169899c4711496158e8/js/browser.js#L1104
export const removeTrackById = (trackId: string, browser: any) => {
    const trackViews = get(browser, "trackViews", []);
    const trackView = trackViews.filter((view: any) => getTrackID(view) === trackId);
    browser.removeTrack(trackView[0].track);
};

export const IGVBrowser: React.FC<IGVBrowser> = ({ locus, searchUrl, options, onBrowserLoad, onTrackRemoved }) => {
    const classes = useStyles();
    const tableClass = classes.popupTable.toString();

    const _geneTrackPopoverData = (info: any) => {
        let pData = [];
        let fields = info.map((elem: any, index: number) => elem.name.toLowerCase().replace(':', '').replace(' ', '_'));
        let index = fields.indexOf('gene_id');
        // find first location and after that, take everything in a list of selected fields
        return info;
    }

    const _customTrackPopup = (track: any, popoverData: any) => {
        // Don't show a pop-over when there's no data.
        if (!popoverData || !popoverData.length) {
            return false;
        }

        popoverData = (track.id === "ENSEMBL_GENE" ? _geneTrackPopoverData(popoverData) : popoverData);

        const tableStartMarkup = '<table class="' + tableClass + '">';
        let markup = tableStartMarkup;

        popoverData.forEach(function (item: any) {
            if (item === "<hr>" || item === "<HR>") {
                markup += "</table> " + item + " " + tableStartMarkup;
            }

            let value = item.html ? item.html : item.value ? item.value : item.toString();
            let color = item.color ? item.color : null;

            if (color !== null) {
                value = '<span style="padding-left: 8px; border-left: 4px solid ' + color + '">' + value + "</span>";
            }

            const title = item.title ? item.title : null;
            const label = item.name ? item.name : null;

            if (title) {
                value = `<div title="${title}">${value}</div>`;
            }

            if (label) {
                markup += "<tr><td>" + label + "</td><td>" + value + "</td></tr>";
            } else {
                // not a name/value pair
                markup += "<tr><td>" + value + "</td></tr>";
            }
        });

        markup += "</table>";

        // By returning a string from the trackclick handler we're asking IGV to use our custom HTML in its pop-over.
        return markup;
    };

    useLayoutEffect(() => {
        window.addEventListener("ERROR: Genome Browser - ", (event) => {
            console.log(event);
        });

        options = merge(options, {
            locus: locus || "ABCA7",
            supportQueryParameters: true,
            flanking: 1000,
            minimumBases: 40,
            search: {
                url: `${searchUrl}$FEATURE$`,
            },
        });

        if (!options.hasOwnProperty("tracks")) {
            options = merge(options, { tracks: [] });
        }

        const targetDiv = document.getElementById("genome-browser");
        igv.createBrowser(targetDiv, options).then(function (browser: any) {
            // browser is initialized and can now be used
            browser.on("locuschange", function (referenceFrameList: any) {
                let loc = referenceFrameList.map((rf: any) => rf.getLocusString()).join("%20");
                window.location.replace(HASH_PREFIX + loc);
            });

            browser.on("trackclick", _customTrackPopup);

            // perform action in encapsulating component if track is removed
            browser.on("trackremoved", function (track: any) {
                onTrackRemoved && onTrackRemoved(track.config.id);
            });

            browser.addTrackToFactory("gwas_service", (config: any, browser: any) => new GWASTrack(config, browser));

            browser.addTrackToFactory(
                "variant_service",
                (config: any, browser: any) => new VariantTrack(config, browser)
            );

            onBrowserLoad ? onBrowserLoad(browser) : noop();
        });
    }, [locus, onBrowserLoad]);

    return <span style={{ width: "100%" }} id="genome-browser" />;
};

export default IGVBrowser;
