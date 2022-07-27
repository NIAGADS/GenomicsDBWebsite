import * as lz from "locuszoom";
export const LocusZoom = lz.default as any;

const DEFAULT_LD_POPULATION = 'EUR';

export interface RequestOptions {
    chr?: string;
    start?: number;
    end?: number;
    ld_population?: string;
    ld_refvar?: string;
    track?: string;
}

const AssociationLZ = LocusZoom.Adapters.get("AssociationLZ"),
    LDServer = LocusZoom.Adapters.get("LDServer"),
    GeneLZ = LocusZoom.Adapters.get("GeneLZ"),
    RecombLZ = LocusZoom.Adapters.get("RecombLZ");

export class CustomAssociationAdapter extends AssociationLZ {
    /*constructor(config: any) {
        config.prefix_namespace = false;
        super(config);
    }*/

    _getURL(request_options: RequestOptions) {
        // Every adapter receives the info from plot.state, plus any additional request options calculated/added in the function `_buildrequest_options`
        // The inputs to the function can be used to influence what query is constructed. Eg, since the current view region is stored in `plot.state`:
        let { chr, start, end, track } = request_options;
        // Fetch the region of interest from a hypothetical REST API that uses query parameters to define the region query, for a given study URL such as `data.example/gwas/<id>/?chr=_&start=_&end=_`
        return `${this._url}/gwas?track=${track}&chromosome=${chr}&start=${Math.trunc(start)}&end=${Math.trunc(end)}`;
    }

    _buildRequestOptions(plot_state: any, ...dependent_data: any) {
        const initialState = this._config.initial_state;
        const requestOptions = Object.assign({
            chr: plot_state.chr ? plot_state.chr : initialState.chr,
            start: plot_state.chr ? plot_state.start : initialState.start,
            end: plot_state.chr ? plot_state.end : initialState.end,
            track: this._config.track }, plot_state);

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
        const requestOptions = Object.assign({
            chr: plot_state.chr ? plot_state.chr : initialState.chr,
            start: plot_state.chr ? plot_state.start : initialState.start,
            end: plot_state.chr ? plot_state.end : initialState.end}, plot_state);

        return requestOptions;
    }
}

export class CustomLDServerAdapter extends LDServer {
    /*constructor(config: any) {
        config.prefix_namespace = false;
        super(config);
    }*/

    _getURL(request_options: RequestOptions) {
        const { ld_population, ld_refvar } = request_options;
        return `${this._url}/linkage?population=${ld_population}&variant=${ld_refvar}`;
    }

    _buildRequestOptions(plot_state: any, ...dependent_data: any) {
        const initialState = this._config.initial_state;
        const requestOptions = Object.assign({
            ld_refvar: plot_state.ld_refvar ? plot_state.ld_refvar : initialState.ldrefvar,
            ld_population: plot_state.ld_population ? plot_state.ld_population : DEFAULT_LD_POPULATION}, plot_state);
       
        return requestOptions;
    }

    /*_normalizeResponse(data: any) {
        const position = data.id2.map((datum:any) => +/\:(\d+):/.exec(datum)[1]),
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
}

//note that other sources have to be transformed into array of objects, but not LD source....
/*LDLZSource.prototype.*/

export class CustomGeneAdapter extends GeneLZ {
    _getURL(request_options: RequestOptions) {
        const { chr, start, end } = request_options;
        return `${this._url}/gene?chromosome=${chr}&start=${Math.trunc(start)}&end=${Math.trunc(end)}`;
    }

    _buildRequestOptions(plot_state: any, ...dependent_data: any) {
        const initialState = this._config.initial_state;
        const requestOptions = Object.assign({
            chr: plot_state.chr ? plot_state.chr : initialState.chr,
            start: plot_state.chr ? plot_state.start : initialState.start,
            end: plot_state.chr ? plot_state.end : initialState.end}, plot_state);
        return requestOptions;
    }
}