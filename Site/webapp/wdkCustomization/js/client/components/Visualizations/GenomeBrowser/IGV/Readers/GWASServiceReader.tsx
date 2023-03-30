import {fetchJson} from "@viz/GenomeBrowser";
import igv from "igv/dist/igv.esm";

interface GWASServiceResponse {
    record_pk: string;
    variant: string;
    neg_log10_pvalue: string;
    pvalue: number;
}

export class GWASServiceReader {
    config: any;
    endpoint: string;
    indexed: boolean;
    track: any;

    constructor(config: any) {
        this.config = config;
        this.endpoint = config.endpoint;
        this.indexed = false;
        this.track = config.track;
    }

    async readFeatures(chr: string, start: number, end: number) {
        const queryChrm = "&chromosome=" + (chr.startsWith("chr") ? chr : "chr" + chr);
        const queryStart = "&start=" + Math.floor(start);
        const queryEnd = "&end=" + Math.floor(end);
        const queryTrack = "track=" + this.track;
        const queryString = queryTrack + queryChrm + queryStart + queryEnd;

        const response = await igv.igvxhr.loadJson(this.endpoint + "?" + queryString, {
            withCredentials: this.config.withCredentials,
        }); 

        //const response = await fetchJson(this.endpoint + '?' + queryString);
        if (response && response.data) {
            return response.data.map((entry: GWASServiceResponse) => {
                const position = parseInt(entry.record_pk.split(":")[1]);
                return {
                    ...entry,
                    start: position - 1, // IGV is zero-based
                    end: position,
                    //value: entry.pvalue,
                    chr: chr // needed by cache
                };
            });
        } else {
            return undefined;
        }
    }
}
