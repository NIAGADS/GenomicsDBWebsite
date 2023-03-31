import { merge } from "lodash";
import { GWASServiceReader } from "@viz/GenomeBrowser";
import { configLoaded } from "wdk-client/Actions/StaticDataActions";

export interface BaseTrackConfig {
    name: string;
    description: string;
    label?: string;
    id?: string;
    format?: string;
    url?: string;
    indexURL?: string;
}

export interface RawTrackConfig extends BaseTrackConfig {
    source: string;
    feature_type: string;
    endpoint?: string;
    track: string;
    track_type: string;
    track_type_display: string;
    biosample_characteristics: { [key: string]: string };
    experimental_design: { [key: string]: string };
}

export interface TrackSelectorRow extends Omit<RawTrackConfig, "biomsample_characteristics" | "experimental_design"> {
    // remove experimental_design & biosample_characteristics
    // & allow other key value pairs b/c will not know columns
    // this will allow us to check that required columns are present
    [additionalFields: string]: unknown;
}

export interface TrackColumnConfig {
    columns: { [key: string]: string };
    order: string[];
}

export interface ConfigServiceResponse {
    columns: TrackColumnConfig;
    tracks: RawTrackConfig[];
}

export interface IgvTrackProps {
    reader?: any;
    supportsWholeGenome?: boolean;
    removable?: boolean;
    displayMode?: string;
    height?: string;
    visibilityWindow?: number;
    type: string;
    id: string;
    colorBy?: any;
    queryable?: boolean; // query webservice when scrolling
    expandQuery?: boolean; // expand the query to the whole genome & cache?
    sourceType?: string;
}

export const convertRawToIgvTrack = (trackConfigs: RawTrackConfig[]): any => {
    return trackConfigs.map((config: RawTrackConfig) => {
        const options: IgvTrackProps = {
            displayMode: "expanded",
            type: config.track_type,
            id: config.track,
            supportsWholeGenome: false,
            visibilityWindow: config.track_type.includes("_service") ? 1000000 : -1,
            removable: true,
        };
        
        if (config.track_type.includes("_service")) {
            options.reader = resolveTrackReader(config.track_type, { endpoint: config.endpoint, track: config.track });
            options.queryable = true;
            options.expandQuery = false;
            options.sourceType = "custom";
        }

        return merge(config, options);
    });
};

const resolveTrackReader = (trackType: string, config:any):any => {
    switch(trackType) {
        case "gwas_service":
            return new GWASServiceReader(config);
        case "variant_service":
        default:
            return null
    }
}

export const fetchJson = async (url: string) => {
    try {
        const response = await fetch(url);
        let responseJson = response.json();
        return responseJson;
    } catch (error) {
        return null;
    }
};
