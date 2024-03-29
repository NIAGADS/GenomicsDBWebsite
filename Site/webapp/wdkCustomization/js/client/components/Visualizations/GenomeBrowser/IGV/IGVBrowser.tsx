import React, { useLayoutEffect, useRef } from "react";
import igv from "igv/dist/igv.esm";
import { noop, merge, get } from "lodash";
import { VariantPValueTrack, VariantServiceTrack as VariantTrack } from "@viz/GenomeBrowser";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

const HASH_PREFIX = "#/locus/";
const ALWAYS_ON_TRACKS = ["ideogram", "ruler", "sequence", "ENSEMBL_GENE"];
export const DEFAULT_FLANK = 1000;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popupTable: {
            background: "transparent",
            position: "relative",
        },
    })
);

interface IGVBrowser {
    searchUrl: string;
    options: any;
    locus?: string;
    webAppUrl: string;
    onTrackRemoved?: (track: string) => void;
    onBrowserLoad?: (Browser: any) => void;
    onLocusChanged?: (Browser: any) => void;
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

export const IGVBrowser: React.FC<IGVBrowser> = ({
    webAppUrl,
    searchUrl,
    options,
    onBrowserLoad,
    onTrackRemoved,
    onLocusChanged,
}) => {
    const isDragging = useRef(false);

    const classes = useStyles();
    const tableClass = classes.popupTable.toString();

    const _geneComponentFeaturePopoverData = (fields: string[], info: any, pData: any[]) => {
        // type
        // name
        // biotype - most
        // ends with _id    / some may have transcript or exon id plus another id
        // location
        // number -- catch outside
        pData.push({ name: "Feature Type:", value: info[fields.indexOf("type")].value.replace(/_/g, " ") });
        if (fields.includes("name")) {
            pData.push({ name: "Name:", value: info[fields.indexOf("name")].value });
        }
        if (fields.includes("biotype")) {
            pData.push({ name: "Biotype:", value: info[fields.indexOf("biotype")].value.replace(/_/g, " ") });
        }

        // find IDs for this feature
        // next feature starts at the next <hr>
        // so stop looking when field === "hr"
        const idIndices = fields
            .slice(0, fields.indexOf("hr"))
            .map((elem: string, index: number) => (elem.endsWith("id") ? index : ""))
            .filter(String);

        idIndices.forEach((index: any) => {
            let idName = info[index].name.replace(":", "");
            idName = idName.includes("_")
                ? idName.charAt(0).toUpperCase() + idName.slice(1).replace("_id", " ID:")
                : idName.toUpperCase().replace("ID", " ID:");

            pData.push({ name: idName, value: info[index].value });
        });

        pData.push({ name: "Location: ", value: info[fields.indexOf("location")].value });

        return pData;
    };

    const _geneTrackPopoverData = (info: any) => {
        const regexp = / \[.+\]/i;

        let fields = info.map((elem: any) => {
            return elem.hasOwnProperty("name") ? elem.name.toLowerCase().replace(":", "").replace(" ", "_") : "hr";
        });
        let pData: any = [];

        const featureType = info[fields.indexOf("type")].value.replace("_", " ");
        if (featureType === "gene" || featureType.endsWith("gene")) {
            const geneSymbol = info[fields.indexOf("name")].value;
            pData.push({ name: "Feature Type:", value: featureType });
            pData.push({ name: "Name:", value: geneSymbol });

            if (fields.includes("gene_id")) {
                const geneId = info[fields.indexOf("gene_id")].value;
                const recHref = webAppUrl + "/app/record/gene/" + geneId;

                pData.push({
                    name: "More Info:",
                    html: '<a target="_blank" href="' + recHref + '" title="">' + geneId + "</a>",
                    title: "View GenomicsDB report for gene " + geneSymbol,
                });
            }

            if (fields.includes("description")) {
                const product = info[fields.indexOf("description")].value.replace(regexp, "");
                pData.push({ name: "Product:", value: product });
            }

            const biotype = info[fields.indexOf("biotype")];
            if (biotype.hasOwnProperty("color")) {
                pData.push({ name: "Biotype:", value: biotype.value.replace(/_/g, " "), color: biotype.color });
            } else {
                pData.push({ name: "Biotype:", value: biotype.value.replace(/_/g, " ") });
            }

            pData.push({ name: "Location:", value: info[fields.indexOf("location")].value });
        } else {
            pData = _geneComponentFeaturePopoverData(fields, info, pData); // floating transcript
        }

        // find first divider and take everything from that point as a component feature of the gene
        let infoSlice = info;
        while (fields.includes("hr")) {
            const dividerIndex = fields.indexOf("hr"); // find next divider
            pData.push("<hr>"); // push the divider
            fields = fields.splice(dividerIndex + 1);
            infoSlice = infoSlice.splice(dividerIndex + 1);
            if (fields.length > 1) {
                pData = _geneComponentFeaturePopoverData(fields, infoSlice, pData);
            } else {
                // should be Exon Number
                if (fields[0] === "exon_number") {
                    pData.push({ name: "Exon Number:", value: infoSlice[0].value });
                }
            }
        }
        return pData;
    };

    const _customTrackPopup = (track: any, popoverData: any) => {
        // Don't show a pop-over when there's no data.
        if (!popoverData || !popoverData.length) {
            return false;
        }

        popoverData = track.id === "ENSEMBL_GENE" ? _geneTrackPopoverData(popoverData) : popoverData;

        const tableStartMarkup = '<table class="' + tableClass + '">';
        let markup = tableStartMarkup;

        popoverData.forEach(function (item: any) {
            if (item === "<hr>" || item === "<hr/>" || item === "<HR>" || item === "<HR/>") {
                markup += "</table>" + " <hr> " + tableStartMarkup;
            } else {
                let value = item.html ? item.html : item.value ? item.value : item.toString();
                let color = item.color ? item.color : null;

                if (color !== null) {
                    value =
                        '<span style="padding-left: 8px; border-left: 4px solid ' + color + '">' + value + "</span>";
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
            locus: options.locus || "ABCA7",
            showAllChromosomes: false,
            flanking: DEFAULT_FLANK,
            minimumBases: 40,
            search: {
                url: `${searchUrl}$FEATURE$&flank=${DEFAULT_FLANK}`,
            },
        });

        if (!options.hasOwnProperty("tracks")) {
            options = merge(options, { tracks: [] });
        }

        const targetDiv = document.getElementById("genome-browser");
        igv.createBrowser(targetDiv, options).then(function (browser: any) {
            // browser is initialized and can now be used
            browser.on("locuschange", function (referenceFrameList: any) {
                if (!isDragging.current) {
                    let loc = referenceFrameList.map((rf: any) => rf.getLocusString()).join("%20");
                    onLocusChanged && onLocusChanged(loc);
               }
            });

            browser.on("trackclick", _customTrackPopup);

            // perform action in encapsulating component if track is removed
            browser.on("trackremoved", function (track: any) {
                onTrackRemoved && onTrackRemoved(track.config.id);
            });

            browser.on("trackdrag", () => {
                isDragging.current = true
            })

            browser.on("trackdragend", () => {
                isDragging.current = false
                let loc = browser.referenceFrameList.map((rf: any) => rf.getLocusString()).join("%20");
                onLocusChanged && onLocusChanged(loc);
            })

            browser.addTrackToFactory(
                "gwas_service",
                (config: any, browser: any) => new VariantPValueTrack(config, browser)
            );
            browser.addTrackToFactory("qtl", (config: any, browser: any) => new VariantPValueTrack(config, browser));

            browser.addTrackToFactory(
                "variant_service",
                (config: any, browser: any) => new VariantTrack(config, browser)
            );

            onBrowserLoad ? onBrowserLoad(browser) : noop();
        });
    }, [onBrowserLoad]);

    return <span style={{ width: "100%" }} id="genome-browser" />;
};

export default IGVBrowser;
