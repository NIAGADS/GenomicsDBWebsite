import React, { useLayoutEffect, useState, useEffect } from "react";
import igv from "igv/dist/igv.esm";
import { noop, assign } from "lodash";
import { NiagadsGeneReader, NiagadsGwasTrack, NiagadsVariantTrack } from "../../../../lib/igv/NiagadsTracks";
import { PopUpData, transformConfigToHtml } from "./IgvBrowserPopUpFactory";

interface IgvBrowser {
    defaultSpan: string;
    defaultTracks?: TrackConfig[];
    disableRefTrack?: boolean;
    options: any;
    onBrowserLoad?: (Browser: any) => void;
    searchUrl: string;
    serviceUrl: string;
    webappUrl: string;
}

export interface TrackConfig {
    autoscale?: boolean;
    displayMode?: string;
    filename?: string;
    filterTypes?: string[];
    format?: string;
    height?: number;
    id?: string;
    indexURL?: string;
    maxLogP?: number;
    maxRows?: number;
    name: string;
    order?: string;
    reader?: any;
    snpField?: string;
    sourceType?: string;
    type?: string;
    url: string;
    visibilityWindow?: number;
}

export const IgvBrowser: React.FC<IgvBrowser> = ({
    defaultSpan,
    defaultTracks,
    disableRefTrack,
    onBrowserLoad,
    searchUrl,
    serviceUrl,
    webappUrl,
    options,
}) => {
    const igvDiv = document.getElementById("igv-div");

    useLayoutEffect(() => {
        window.addEventListener("error", (event) => {
            console.log(event);
        });

        assign({}, options, { locus: defaultSpan || "ABCA7" });
        assign({}, options, { tracks: defaultTracks || [] });
        assign({}, options, { url: `${searchUrl}$FEATURE$` });
        
        //https://github.com/igvteam/igv.js/wiki/Browser-Creation
        igv.createBrowser(igvDiv, options).then((browser: any) => {
            browser.addTrackToFactory(
                "niagadsgwas",
                (config: any, browser: any) => new NiagadsGwasTrack(config, browser)
            );
            browser.addTrackToFactory(
                "niagadsvariant",
                (config: any, browser: any) => new NiagadsVariantTrack(config, browser)
            );

            browser.on("trackclick", (track: any, popoverData: any) => {
                // Don't show a pop-over when there's no data.

                if (!popoverData || !popoverData.length) {
                    return false;
                }

                const customPopOverConfig = [
                    {
                        trackType: "niagadsgwas",
                        fields: [
                            {
                                name: "variant",
                                type: "link" as "link",
                                value: {
                                    name: (ppd: PopUpData[]) => ppd.find((p) => p.name === "variant").value,
                                    target: (ppd: PopUpData[]) =>
                                        `${webappUrl}/app/record/variant/${
                                            ppd.find((pd) => pd.name === "variant").value
                                        }`,
                                },
                            },
                        ],
                    },
                    {
                        trackType: "niagadsgenetrack",
                        fields: [
                            {
                                name: "Gene ID",
                                type: "link" as "link",
                                value: {
                                    name: (ppd: PopUpData[]) =>
                                        ppd
                                            .find((ppd) => ppd.name === "AttributeString")
                                            .value.split(";")
                                            .filter((p) => p.startsWith("gene_id"))[0]
                                            .split("=")[1],
                                    target: (ppd: PopUpData[]) =>
                                        `${webappUrl}/app/record/gene/${
                                            ppd
                                                .find((ppd) => ppd.name === "AttributeString")
                                                .value.split(";")
                                                .filter((p) => p.startsWith("gene_id"))[0]
                                                .split("=")[1]
                                        }`,
                                },
                            },
                        ],
                        remove: ["Delim", "AttributeString"],
                    },
                    {
                        trackType: "niagadsvariant",
                        fields: [
                            {
                                name: "Names",
                                type: "link" as "link",
                                value: {
                                    name: (ppd: PopUpData[]) => ppd.find((ppd) => ppd.name === "Names").value,
                                    target: (ppd: PopUpData[]) =>
                                        `${webappUrl}/app/record/variant/${
                                            ppd.find((ppd) => ppd.name === "Names").value
                                        }`,
                                },
                            },
                        ],
                        remove: ["record"],
                    },
                ];
                return transformConfigToHtml(customPopOverConfig, popoverData, track);
            });

            onBrowserLoad ? onBrowserLoad(browser) : noop();
        });
    }, [defaultSpan, defaultTracks, onBrowserLoad]);

    return <span style={{ width: "100%" }} id="igv-div" />;
};

export default IgvBrowser;
