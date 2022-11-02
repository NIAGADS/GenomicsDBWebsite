

export interface TrackConfig {
    name: string;
    format?: string;
    displayMode: string;
    height?: number;
    url: string;
    indexURL?: string;
    visibilityWindow: number;
}


export interface IgvTrackConfig extends TrackConfig {
    description?: string;
    track?:string;
    id: string;
    reader?: any;
    type: string;
    supportsWholeGenome: boolean;
    removable?: boolean;
}

