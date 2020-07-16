import React, { useLayoutEffect } from "react";
import igv from "igv/dist/igv.esm";

interface IgvBrowser {
    defaultSpan: string;
}

const IgvBrowser: React.FC<IgvBrowser> = ({ defaultSpan }) => {
    useLayoutEffect(() => {
        //https://github.com/igvteam/igv.js/wiki/Browser-Creation
        const igvDiv = document.getElementById("igv-div"),
            options = {
                genome: "hg19",
                locus: defaultSpan,
                tracks: [
                    {
                        type: "annotation",
                        name: "FILER: Expressed enhancer sites",
                        url:
                            "https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/ChIP-seq/broadpeak/hg19/ENCFF000AIA.bed.gz",
                    },
                ],
            };

        igv.createBrowser(igvDiv, options).then((browser: any) => {
            browser.on("trackclick", (track: any, popoverData: any) => {
                let markup = '<table class="igv-popover-table">';

                // Don't show a pop-over when there's no data.
                if (!popoverData || !popoverData.length) {
                    return false;
                }

                popoverData.forEach((nameValue: { name: string; value: string }) => {
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
            //setBrowser(browser);
        });
    }, [defaultSpan]);

    return <span style={{ width: "100%" }} id="igv-div" />;
};

export default IgvBrowser;
