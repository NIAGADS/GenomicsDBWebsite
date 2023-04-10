import {fetchJson} from "@viz/GenomeBrowser";
import igv from "igv/dist/igv.esm";
import { VcfInfo } from "@viz/GenomeBrowser/IGV/Tracks/VariantServiceTrack";

interface VariantServiceResponse {
   chrom: string;
   pos: number;
   ref: string;
   alt: string;
   qual: string;
   filter: number;
   info: VcfInfo;
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
            return response.data.map((entry: VariantServiceResponse) => {
                const start = entry.info.location.includes("-") ? parseInt(entry.info.location.split(" - ")[0]): entry.pos;
                const end = entry.info.location.includes("-") ? parseInt(entry.info.location.split(" - ")[1]) - 1: entry.pos;
                
            return {
                ...entry,
                start: start - 1, // IGV is zero-based
                end: end,
                chr: entry.chrom // needed by cache
            }}
            );
        } else {
            return undefined;
        }
    }
}
