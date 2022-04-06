import * as lz from "locuszoom";
export const LocusZoom = lz.default as any;


export interface RequestOptions {
    chr?: string;
    start?: number;
    end?: number;
    population?: string;
    ldrefvar?: string;
    track?: string;
}

const AssociationLZ = LocusZoom.Adapters.get("AssociationLZ"),
    LDServer = LocusZoom.Adapters.get("LDServer"),
    GeneLZ = LocusZoom.Adapters.get("GeneLZ"),
    RecombLZ = LocusZoom.Adapters.get("RecombLZ");

export class CustomAssociationAdapter extends AssociationLZ {
    _getURL(request_options: RequestOptions) {
        // Every adapter receives the info from plot.state, plus any additional request options calculated/added in the function `_buildrequest_options`
        // The inputs to the function can be used to influence what query is constructed. Eg, since the current view region is stored in `plot.state`:
        let { chr, start, end, track } = request_options;
        // Fetch the region of interest from a hypothetical REST API that uses query parameters to define the region query, for a given study URL such as `data.example/gwas/<id>/?chr=_&start=_&end=_`
        return `${this._url}/gwas?track=${track}&chromosome=${chr}&start=${Math.trunc(start)}&end=${Math.trunc(end)}`;
    }

    _buildRequestOptions(plot_state: any, ...dependent_data: any) {
        const initialState = this._config.initial_state;
        const requestOptions = { 
            'chr' : plot_state.chr ? plot_state.chr : initialState.chr,
            'start' : plot_state.start ? plot_state.start : initialState.start,
            'end' : plot_state.end ? plot_state.end : initialState.end,
            'track' : this._config.track
        }
        return requestOptions;
    }
}

export class CustomRecombAdapter extends RecombLZ {
    _getURL(request_options: RequestOptions) {
        const { chr, start, end } = request_options;
        return `${this._url}/recomb?chromosome=${chr}&start=${Math.trunc(start)}&end=${Math.trunc(end)}`;
    }

    _buildRequestOptions(plot_state: any, ...dependent_data: any) {
        const initialState = this._config.initial_state;
        const requestOptions = { 
            'chr' : plot_state.chr ? plot_state.chr : initialState.chr,
            'start' : plot_state.start ? plot_state.start : initialState.start,
            'end' : plot_state.end ? plot_state.end : initialState.end,
        }
        return requestOptions;
    }
}

export class CustomLZServerAdapter extends LDServer {
    _getURL(request_options: RequestOptions) {
        const { population, ldrefvar } = request_options;
        return `${this._url}/locuszoom/linkage?population=${population}&variant=${ldrefvar}`;
    }

    // _normalizeResponse 
}

//note that other sources have to be transformed into array of objects, but not LD source....
/*LDLZSource.prototype.normalizeResponse = function (data: ) {
    const position = data.id2.map((datum) => +/\:(\d+):/.exec(datum)[1]),
        chr = lzState.chromosome.replace("chr", ""),
        chromosome = data.id2.map(() => chr);
    return {
        variant1: data.id2.map(() => lzState.ldrefvar),
        variant2: data.id2,
        chromosome1: chromosome,
        chromosome2: chromosome,
        correlation: data.value,
        position1: position,
        position2: position,
    };
};*/

export class CustomGeneAdapter extends GeneLZ {
    _getURL(request_options: RequestOptions) {
        const { chr, start, end } = request_options;
        return `${this._url}/gene?chromosome=${chr}&start=${Math.trunc(start)}&end=${Math.trunc(end)}`;
    }
}
