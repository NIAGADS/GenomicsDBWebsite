import { RawTrackConfig } from "@viz/GenomeBrowser"

/*
export const generateTrackSummary = (track: RawTrackConfig): RawTrackConfig => {
    const { endpoint, feature_type, path, phenotypes, track_type, track_type_display, ...rest } = track,
        config = rest as unknown as RawTrackConfig;

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
}; */