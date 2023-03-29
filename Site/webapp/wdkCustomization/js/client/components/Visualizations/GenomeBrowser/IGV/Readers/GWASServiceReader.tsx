import igv from "igv/dist/igv.esm";
import { json } from "d3";

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
        const queryChrm = "&chromosome=" + chr.startsWith("chr") ? chr : "chr" + chr;
        const queryStart = "&start=" + Math.floor(start);
        const queryEnd = "&end=" + Math.floor(end);
        const queryTrack = "track=" + this.track;
        const queryString = queryTrack + queryChrm + queryStart + queryEnd;

        const response = await igv.loadJson(this.endpoint + "?" + queryString, {
            withCredentials: this.config.withCredentials,
        });
        if (response && response.data) {
            return response.data.map((entry: GWASServiceResponse) => {
                const position = parseInt(entry.variant.split(":")[1]);
                return {
                    ...entry,
                    position: position,
                    //value: entry.pvalue,
                    chromosome: chr // needed by cache
                };
            });
        } else {
            return undefined;
        }
    }
}

