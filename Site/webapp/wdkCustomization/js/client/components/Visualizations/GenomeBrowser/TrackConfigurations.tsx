export interface NiagadsBaseTrackConfig {
    description?: string; //for browser
    format?: string; //bed, etc
    label: string; // for track popover
    name: string; //for display in track browser
    source: string; //for display in track browser
}

export interface NiagadsRawTrackConfig extends NiagadsBaseTrackConfig {
    endpoint?: string; //for async tracks only
    feature_type: string; //gene, variant, enhancer, etc., for categorizing
    path?: string; //for filer -- can pass in as url
    phenotypes: { [key: string]: string }[]; //for browser filter
    track: string; //unique id (pass to backend for async), for instance
    track_type: string; //igv track type
    track_type_display: string; //niagads track type
}

export interface NiagadsBrowserTrackConfig extends NiagadsBaseTrackConfig {
    featureType: string;
    phenotypes: string;
    reader?: any;
    track: string;
    trackType: string;
    trackTypeDisplay: string;
    url: string;
}

export interface IgvTrackConfig {
    name: string;
    format?: string;
    displayMode: string;
    height?: number;
    id: string;
    indexURL?: string;
    reader?: any;
    type: string;
    url: string;
    visibilityWindow: number;
}