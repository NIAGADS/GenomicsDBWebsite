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

export interface IgvTrackConfig extends BaseTrackConfig {
    reader?: any;
    supportsWholeGenome: boolean;
    removable?: boolean;
    displayMode: string;
    height?: string;
    visibilityWindow: number;
}
