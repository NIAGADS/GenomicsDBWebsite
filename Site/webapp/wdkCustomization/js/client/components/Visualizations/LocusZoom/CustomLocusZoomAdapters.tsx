import * as lz from "locuszoom";
import { record } from "wdk-client/Utils/Json";
export const LocusZoom = lz.default as any;

const DEFAULT_LD_POPULATION = 'ADSP';

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
            track: this._config.track
        }, plot_state);

        return requestOptions;
    }

    _normalizeResponse(raw_response: any, request_options: RequestOptions) {
        const { chr } = request_options;

        // for some strange reason; the raw_response is a string
        // even though the service returns an object
        let response = JSON.parse(raw_response);

        // catch empty spans
        if (response.data.variant == null)
            return [];

        const records = response.data.variant.map((variant: string, index: number) => (
            {
                variant: variant,
                pvalue: response.data.pvalue[index],
                log_pvalue: response.data.log_pvalue[index],
                chromosome: chr,
                test_allele: response.data.test_allele[index],
                position: parseInt(response.data.position[index])
            }));

        return records;
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
            end: plot_state.chr ? plot_state.end : initialState.end
        }, plot_state);

        return requestOptions;
    }
}

export class CustomLDServerAdapter extends LDServer {
    constructor(config: any) {
        super(config);
    }

    // modified from https://statgen.github.io/locuszoom/docs/api/data_adapters.js.html#line478
    // added types
    __find_ld_refvar(state: any, assoc_data: any): string {
        const assoc_variant_name = this._findPrefixedKey(assoc_data[0], 'variant');
        const assoc_logp_name = this._findPrefixedKey(assoc_data[0], 'log_pvalue');

        let refvar: string = null;
        let best_hit: any = {};

        // Determine the reference variant (via user selected OR automatic-per-track)
        if (state.ldrefvar) { // passed by state
            refvar = state.ldrefvar;
            best_hit = assoc_data.find((item: string) => item[assoc_variant_name] === refvar) || {};
        }
        else {
            // find highest log-value and associated var spec
            let best_logp = 0;
            for (let item of assoc_data) {
                const { [assoc_variant_name]: variant, [assoc_logp_name]: log_pvalue } = item;
                if (item.hasOwnProperty('lz_is_ld_refvar')) {
                    delete item.lz_is_ld_refvar; // for updates based on state
                }
                if (log_pvalue > best_logp) {
                    best_logp = log_pvalue;
                    refvar = variant;
                    best_hit = item;
                }
            }
        }

        // Add a special field that is not part of the assoc or 
        // LD data from the server, but has significance for plotting.
        //  Since we already know the best hit, it's easier to do this here rather than in annotate or join phase.
        // fossilfriend: NOTE - this updates the best hit variant by reference
        best_hit.lz_is_ld_refvar = true;

        // Last step: sanity check the proposed reference variant. Is it inside the view region? If not, we're probably
        //  remembering a user choice from before user jumped to a new region. LD should be relative to something nearby.

        // NOTE: fossilfriend - removing this b/c when doing update based on table select, it's setting the refvar to null
        // if the refvar is outside the current span
        
        /* let [chrom, pos, ...rest] = refvar.split(":");
        let coord = +pos;
        if ((coord && state.ldrefvar && state.chr) && (chrom !== String(state.chr) || coord < state.start || coord > state.end)) {
            // Rerun this method, after clearing out the proposed reference variant. NOTE: Adapter call receives a
            //   *copy* of plot.state, so wiping here doesn't remove the original value.
            state.ldrefvar = null;
            return this.__find_ld_refvar(state, assoc_data);
        } */

        return refvar;
    }

    _getURL(request_options: RequestOptions) {
        const { ld_population, ld_refvar } = request_options;
        return `${this._url}/linkage?population=${ld_population}&variant=${ld_refvar}`;
    }


    _buildRequestOptions(plot_state: any, assoc_data: any) {
        if (!assoc_data) {
            throw new Error('LD request must depend on association data');
        }

        const base = super._buildRequestOptions(...arguments);
        if (!assoc_data.length) {
            // No variants, so no need to annotate association data with LD!
            // may be buggy, if allowing multiple tracks in one graphic; see original LDServer adapter
            base._skip_request = true;
            return base;
        }

        const initialState = this._config.initial_state;

        if (!plot_state.ld_refvar) { plot_state.ld_refvar = initialState.ldrefvar };
        base.ld_refvar = this.__find_ld_refvar(plot_state, assoc_data);

        const ld_population = plot_state.ld_population
            ? plot_state.ld_population
            : initialState.population
                ? initialState.population
                : DEFAULT_LD_POPULATION;

        const requestOptions = Object.assign({}, base, { ld_population });

        return requestOptions;
    }

    // GenomicsDB Webservice returns linked_variant and r_squared only to reduce repsonse
    // size; need to convert to expected response, which includes 
    // repeated chromosome (chromosome1, chromosome2), reference variant (variant1), 
    // and positional info (position1, position2)
    // and renames r_squared to correlation
    _normalizeResponse(raw_response: any, request_options: RequestOptions) {
        const { ld_refvar } = request_options;

        // ld_refvar undefined b/c no association data in span
        if (ld_refvar == null) {
            return [];
        } 

        const [chromosome, position1, ...rest] = ld_refvar.split(':');
        const ldSelf = {
            variant1: ld_refvar,
            variant2: ld_refvar,
            chromosome1: chromosome,
            chromosome2: chromosome,
            correlation: 1.0,
            position1: parseInt(position1),
            position2: parseInt(position1),
        };


        // no variants in LD, return self
        if (raw_response.data.linked_variant[0] == null) {
            return [ ldSelf ]
        }

        const records = raw_response.data.linked_variant.map((lv: string, index: number) => (
            {
                variant1: ld_refvar,
                variant2: lv,
                chromosome1: chromosome,
                chromosome2: chromosome,
                correlation: raw_response.data.r_squared[index],
                position1: parseInt(position1),
                position2: parseInt(lv.split(':')[1])
            }));

        records.push(ldSelf);

        return records;
    };

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
            end: plot_state.chr ? plot_state.end : initialState.end
        }, plot_state);

        return requestOptions;
    }
}
