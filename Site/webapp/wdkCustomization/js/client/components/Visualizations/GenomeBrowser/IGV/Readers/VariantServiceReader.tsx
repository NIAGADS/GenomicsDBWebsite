import {fetchJson} from "@viz/GenomeBrowser";
import igv from "igv/dist/igv.esm";

interface VariantServiceResponse {
    chr: string;
    start: number;
    end: number;
    info: any;
    record_pk: string;
    variant: string;
}

export class VariantServiceReader {
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
            return response.data;
        } else {
            return undefined;
        }
    }
}
