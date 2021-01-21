import React, { useLayoutEffect } from "react";
import igv from "igv/dist/igv.min";
import { noop } from "lodash";
import { NiagadsGeneReader } from "../../../../lib/igv/NiagadsTracks";

interface IgvBrowser {
    defaultSpan: string;
    defaultTracks?: TrackConfig[];
    onBrowserLoad?: (Browser: any) => void;
    searchUrl: string;
    serviceUrl: string;
}

export interface TrackConfig {
    autoscale?: boolean;
    displayMode?: string;
    filename?: string;
    filterTypes?: string[];
    format?: string;
    height?: number;
    indexURL?: string;
    maxLogP?: number;
    maxRows?: number;
    name: string;
    order?: string;
    snpField?: string;
    sourceType?: string;
    type?: string;
    url: string;
    visibilityWindow?: number;
}

const IgvBrowser: React.FC<IgvBrowser> = ({ defaultSpan, defaultTracks, onBrowserLoad, searchUrl, serviceUrl }) => {
    useLayoutEffect(() => {
        //https://github.com/igvteam/igv.js/wiki/Browser-Creation
        const igvDiv = document.getElementById("igv-div"),
            options = {
                reference: {
                    id: "hg19",
                    name: "Human (GRCh37/hg19)",
                    fastaURL:
                        "https://s3.dualstack.us-east-1.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta",
                    indexURL:
                        "https://s3.dualstack.us-east-1.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/hg19.fasta.fai",
                    cytobandURL:
                        "https://s3.dualstack.us-east-1.amazonaws.com/igv.broadinstitute.org/genomes/seq/hg19/cytoBand.txt",
                    tracks: [
                        {
                            name: "Niagads gene track",
                            displayMode: "expanded",
                            visibilityWindow: 100000000,
                            format: "refgene",
                            //queryable: true,
                            reader: new NiagadsGeneReader(`${serviceUrl}/track/gene`),
                            url: `${serviceUrl}/track/gene`,
                        },
                    ],
                },
                locus: defaultSpan,
                tracks: defaultTracks || [],
                search: {
                    url: `${searchUrl}$FEATURE$`,
                },
            };

        igv.createBrowser(igvDiv, options).then((browser: any) => {
            browser.on("trackclick", (track: any, popoverData: any) => {
                let markup = '<table class="igv-popover-table">';

                // Don't show a pop-over when there's no data.
                if (!popoverData || !popoverData.length) {
                    return false;
                }
                //todo: abstract this away, and use type, not name
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
