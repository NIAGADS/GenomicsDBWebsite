import React, { useLayoutEffect } from "react";
import igv from "../../../../lib/igv/igv";
import { noop } from "lodash";

interface IgvBrowser {
    defaultSpan: string;
    defaultTracks?: TrackConfig[];
    onBrowserLoad?: (Browser: any) => void;
}

export interface TrackConfig {
    name: string;
    format?: string;
    displayMode: string;
    height?: number;
    url: string;
    indexURL?: string;
    visibilityWindow: number;
}

const IgvBrowser: React.FC<IgvBrowser> = ({ defaultSpan, defaultTracks, onBrowserLoad }) => {
    useLayoutEffect(() => {
        //https://github.com/igvteam/igv.js/wiki/Browser-Creation
        const igvDiv = document.getElementById("igv-div"),
            options = {
                genome: "hg19",
                locus: defaultSpan,
                tracks: defaultTracks || [],
            };

        igv.createBrowser(igvDiv, options).then((browser: any) => {
            browser.on("trackclick", (track: any, popoverData: any) => {
                let markup = '<table class="igv-popover-table">';

                // Don't show a pop-over when there's no data.
                if (!popoverData || !popoverData.length) {
                    return false;
                }

                //if we're on a niagads gwas track, transform
                const ppd =
                    track.config.name === "NG00027 stage 12"
                        ? [
                              {
                                  name: "variant",
                                  value:
                                      "<a href='https://beta.niagads.org/genomics/app/record/variant/" +
                                      popoverData.find((pd: any) => pd.name === "strand").value.split("//")[0] +
                                      "'>" +
                                      popoverData.find((pd: any) => pd.name === "name").value +
                                      "</a>",
                              },
                              {
                                  name: "p-value",
                                  value: popoverData.find((pd: any) => pd.name === "strand").value.split("//")[1],
                              },
                          ]
                        : popoverData;

                ppd.forEach((nameValue: { name: string; value: string }) => {
                    if (nameValue.name) {
                        const value =
                            nameValue.name.toLowerCase() === "gene_id"
                                ? '<a href="https://beta.niagads.org/genomics/app/record/gene/' +
                                  //ens ids have dot incrememnts, stripping for now
                                  nameValue.value.replace(/\..+/, "") +
                                  '">' +
                                  nameValue.value +
                                  "</a>"
                                : nameValue.value;

                        markup +=
                            '<tr><td class="igv-popover-td">' +
                            '<div class="igv-popover-name-value">' +
                            '<span class="igv-popover-name">' +
                            nameValue.name +
                            "</span>" +
                            '<span class="igv-popover-value">' +
                            value +
                            "</span>" +
                            "</div>" +
                            "</td></tr>";
                    } else {
                        // not a name/value pair
                        markup += "<tr><td>" + nameValue.toString() + "</td></tr>";
                    }
                });

                markup += "</table>";

                return markup;
            });

            onBrowserLoad ? onBrowserLoad(browser) : noop();
        });
    }, [defaultSpan, defaultTracks, onBrowserLoad]);

    return <span style={{ width: "100%" }} id="igv-div" />;
};

export default IgvBrowser;
