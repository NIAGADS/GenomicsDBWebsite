export interface Track {
    description?: string; //for browser
    format?: string; //bed, etc
    label: string; // for track popover
    name: string; //for display in track browser
    source: string; //for display in track browser
}

export interface ServiceTrack extends Track {
    endpoint?: string; //for async tracks only
    feature_type: string; //gene, variant, enhancer, etc., for categorizing
    path?: string; //for filer -- can pass in as url
    phenotypes: { [key: string]: string }[]; //for browser filter
    track: string; //unique id (pass to backend for async), for instance
    track_type: string; //igv track type
    track_type_display: string; //niagads track type
    visibilityWindow?: number;
}

export interface TrackConfig extends Track {
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
    description?: string;
    track?:string;
    id: string;
    indexURL?: string;
    reader?: any;
    type: string;
    url: string;
    visibilityWindow: number;
    supportsWholeGenome: boolean;
    removable?: boolean;
}

export const generateTrackConfig = (track: ServiceTrack): TrackConfig => {
    const { endpoint, feature_type, path, phenotypes, track_type, track_type_display, ...rest } = track,
        config = rest as unknown as TrackConfig;

    if (track.endpoint) {
        config.url = `${track.endpoint}?track=${track.track}`;
    }

    if (track.path) {
        config.url = track.path;
    }

    config.trackType = track.track_type;
    config.trackTypeDisplay = track.track_type_display;
    config.featureType = track.feature_type;

    config.phenotypes = (phenotypes || []).reduce(
        (a, c) => a + "\n" + Object.keys(c)[0].toUpperCase() + " : " + Object.values(c)[0],
        ""
    );

    return config;
};