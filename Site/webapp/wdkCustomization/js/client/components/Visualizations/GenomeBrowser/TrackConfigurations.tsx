export interface BaseTrackConfig {
    name: string;
    description: string;
    label:string;
    type: string;
    track?: string;
    id?:string;
}

export interface RawTrackConfig extends BaseTrackConfig {
    source:string;
    feature_type: string;
    endpoint?: string;
    url?:string;
    track_type_display: string;
    biosample_characteristics:{ [key: string]: string};
    experimental_design:{ [key: string]: string};
}



export interface IgvTrackConfig extends BaseTrackConfig {
    reader?: any;
    supportsWholeGenome: boolean;
    removable?: boolean;
    url?: string;
    indexURL?: string;
    format?:string;
    displayMode: string;
    height?:string;
    visibilityWindow: number;
}


export interface TrackSelectorColumnConfig {
    header: string;
    id: string;
}
