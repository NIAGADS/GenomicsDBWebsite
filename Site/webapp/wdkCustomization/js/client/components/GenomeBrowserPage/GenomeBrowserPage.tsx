import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import qs from "qs";
import Container from "@material-ui/core/Container";
import theme from "./../../theme";
import TrackBrowser from "./../Visualizations/Igv/IgvTrackBrowser";
import IGVBrowser from "./../Visualizations/Igv/IgvBrowser";
import { NiagadsGwasTrack } from "./../../../lib/igv/NiagadsTracks";
import { ThemeProvider, makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import LinearProgress from "@material-ui/core/LinearProgress";
import Close from "@material-ui/icons/Close";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { get, flow } from "lodash";
import { WdkServiceContext } from "wdk-client/Service/WdkService";

const useBrowserStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        AppBar: {
            padding: "0px 10px",
        },
        Accordion: {
            flexGrow: 1,
        },
        AccordionDetails: {
            flexDirection: "column",
        },
        BrowseButton: {
            marginTop: "5px",
        },
        Container: {
            marginTop: "5px",
        },
        Drawer: {
            position: "relative",
            right: "auto",
            bottom: "auto",
            top: "auto",
            left: "auto",
        },
        FormControl: {
            flexGrow: 1,
        },
        IconButton: {
            justifyContent: "flex-start",
            marginLeft: theme.spacing(2),
        },
    })
);

const makeReloadKey = () => Math.random().toString(36).slice(2);

const MemoBroswer = React.memo(IGVBrowser);

interface GenomeBrowserPage {
    //connected
    webAppUrl: string;
    serviceUrl: string;
}

const GenomeBrowserPage: React.FC<GenomeBrowserPage> = ({ serviceUrl, webAppUrl }) => {
    const wdkService = useContext(WdkServiceContext);

    useEffect(() => {
        wdkService
            ._fetchJson<NiagadsRawTrackConfig[]>("GET", `/track/config`)
            .then((res) =>
                setTrackList(res.map((res) => transformRawNiagadsTrack(res, serviceUrl)).concat(_getFilerTracks()))
            );
    }, [wdkService, serviceUrl]);

    const classes = useBrowserStyles(),
        [Browser, setBrowser] = useState<any>(),
        [drawerOpen, setDrawerOpen] = useState(false),
        [listVisible, setListVisible] = useState(false),
        [loadingTrack, setLoadingTrack] = useState<string>(),
        [reloadKey, setReloadKey] = useState(makeReloadKey()),
        [trackList, setTrackList] = useState<NiagadsBrowserTrackConfig[]>();

    const location = useLocation();

    const defaultSpan = useMemo(() => {
        return get(qs.parse(location.search), "locus") as string;
    }, [location.search]);

    const loadTrack = async (config: TrackConfig) => {
            setLoadingTrack(config.name);
            await Browser.loadTrack(config);
            setLoadingTrack(undefined);
        },
        getTrackIsLoaded = (config: TrackConfig) => getLoadedTracks(Browser).includes(config.name),
        toggleTracks = (config: TrackConfig[]) => {
            config.forEach((c) => {
                getTrackIsLoaded(c) ? unloadTrack(c) : loadTrack(c);
            });
        },
        unloadTrack = (config: TrackConfig) => {
            Browser.removeTrackByName(config.name);
            //force react to update based on imperative change
            setReloadKey(makeReloadKey());
        },
        getTrackIsLoading = (name: string) => loadingTrack === name,
        buildBrowser = useCallback((b: any) => {
            b.addTrackToFactory("niagadsgwas", (config: any, browser: any) => new NiagadsGwasTrack(config, browser));
            setBrowser(b);
        }, []);

    return (
        <Container maxWidth="xl">
            <ThemeProvider theme={theme}>
                <Button
                    className={classes.BrowseButton}
                    color="primary"
                    disabled={!!!trackList}
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    variant="outlined"
                >
                    <LibraryBooksIcon />
                    Browse Tracks
                </Button>
                <Grid container>
                    <Drawer
                        /* className={classes.Drawer} */ style={{
                            position: "relative",
                            right: "auto",
                            bottom: "auto",
                            top: "auto",
                            left: "auto",
                            zIndex: 1299,
                        }}
                        open={drawerOpen}
                        ModalProps={{ hideBackdrop: true }}
                    >
                        <Box style={{ maxWidth: "500px", padding: "15px" }}>
                            <Grid container direction="column">
                                <Grid
                                    item
                                    container
                                    direction="row"
                                    alignItems="center"
                                    justify="space-between"
                                    xs={12}
                                >
                                    <Typography>Available Tracks</Typography>
                                    <IconButton onClick={() => setDrawerOpen(false)}>
                                        <Close />
                                    </IconButton>
                                </Grid>
                                <Divider />
                                <Grid container item xs={12}>
                                    <Accordion className={classes.Accordion}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Gene</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className={classes.AccordionDetails} key={reloadKey}>
                                            {!!Browser &&
                                                getGeneTrackChoices().map((config) => (
                                                    <FormControlLabel
                                                        key={config.name}
                                                        control={
                                                            <Checkbox
                                                                checked={getTrackIsLoaded(config)}
                                                                onChange={() => toggleTracks([config])}
                                                                color="primary"
                                                                disabled={!!loadingTrack}
                                                            />
                                                        }
                                                        label={
                                                            <span>
                                                                {config.name}
                                                                {getTrackIsLoading(config.name) && <LinearProgress />}
                                                            </span>
                                                        }
                                                    />
                                                ))}
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                                <Grid>
                                    <Accordion className={classes.Accordion}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography>Genetic Variation</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className={classes.AccordionDetails}>
                                            <Accordion className={classes.Accordion}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography>ADSP</Typography>
                                                </AccordionSummary>
                                            </Accordion>
                                            <Accordion className={classes.Accordion}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography>dbSNP</Typography>
                                                </AccordionSummary>
                                            </Accordion>
                                            <Accordion className={classes.Accordion}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography>NHGRI</Typography>
                                                </AccordionSummary>
                                            </Accordion>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Grid>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Genome Reference</Typography>
                                            </AccordionSummary>
                                        </Accordion>
                                    </Grid>
                                    <Grid>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Niagads GWAS</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails className={classes.AccordionDetails} key={reloadKey}>
                                                {!!Browser &&
                                                    getNiagadsGwasChoices().map((config) => (
                                                        <FormControlLabel
                                                            key={config.name}
                                                            control={
                                                                <Checkbox
                                                                    checked={getTrackIsLoaded(config)}
                                                                    onChange={() => toggleTracks([config])}
                                                                    color="primary"
                                                                    disabled={!!loadingTrack}
                                                                />
                                                            }
                                                            label={
                                                                <span>
                                                                    {config.name}
                                                                    {getTrackIsLoading(config.name) && (
                                                                        <LinearProgress />
                                                                    )}
                                                                </span>
                                                            }
                                                        />
                                                    ))}
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                                <Button variant="outlined" color="primary" onClick={() => setListVisible(true)}>
                                    Functional Genomics&nbsp;
                                    <ArrowForward />
                                </Button>
                            </Grid>
                        </Box>
                    </Drawer>
                    <MemoBroswer
                        defaultSpan={defaultSpan}
                        onBrowserLoad={buildBrowser}
                        searchUrl={`${window.location.origin}${webAppUrl}/service/track/feature?id=`}
                        serviceUrl={serviceUrl}
                    />
                </Grid>
                <TrackBrowser
                    activeTracks={getLoadedTracks(Browser)}
                    handleClose={flow(
                        () => setListVisible(false),
                        () => setDrawerOpen(false)
                    )}
                    isOpen={listVisible}
                    loadingTrack={loadingTrack}
                    toggleTracks={toggleTracks}
                    trackList={trackList}
                />
            </ThemeProvider>
        </Container>
    );
};

export default connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
    serviceUrl: `${window.location.origin}${state.globalData.siteConfig.endpoint}`,
}))(GenomeBrowserPage);

export interface TrackConfig {
    name: string;
    format?: string;
    displayMode: string;
    height?: number;
    url: string;
    indexURL?: string;
    visibilityWindow: number;
}

const getGeneTrackChoices = (): TrackConfig[] => [
    {
        name: "Refseq Genes",
        displayMode: "expanded",
        url: "https://s3.amazonaws.com/igv.org.genomes/hg19/refGene.sorted.txt.gz",
        visibilityWindow: -1,
    },
];

const getNiagadsGwasChoices = () => [
    {
        name: "NG00027 stage 1",
        type: "niagadsgwas",
        url: "http://localhost:8080/genomics_gus_4/service/track/gwas?track=NG00027_STAGE1",
        maxLogP: 25,
        autoscale: false,
        displayMode: "EXPANDED",
        visibilityWindow: 100000,
        snpField: "record_pk",
    },
];

/* note that id is unreliable, not necessarily passed from config to trackView.track, at least */
const getLoadedTracks = (browser: any): string[] =>
    get(browser, "trackViews", []).map((view: any) => view.track.name || view.track.id);

const transformRawNiagadsTrack = (track: NiagadsRawTrackConfig, serviceUrl: string): NiagadsBrowserTrackConfig => {
    const { phenotypes, ...rest } = track,
        ret = { url: "unknown", trackType: "unknown", ...rest } as NiagadsBrowserTrackConfig;
    if (track.source === "NIAGADS" && track.type.includes("gwas")) {
        ret.trackType = "niagadsgwas";
        ret.url = `${serviceUrl}/track/gwas?track=${ret.track}`;
    }

    ret.phenotypes = (phenotypes || []).reduce(
        (a, c) => a + "\n" + Object.keys(c)[0].toUpperCase() + " : " + Object.values(c)[0],
        ""
    );

    return ret;
};

interface NiagadsBaseTrackConfig {
    description: string;
    label: string;
    name: string;
    record: string;
    source: string;
    track: string;
    type: string;
}

interface NiagadsRawTrackConfig extends NiagadsBaseTrackConfig {
    phenotypes: { [key: string]: string }[];
}

export interface NiagadsBrowserTrackConfig extends NiagadsBaseTrackConfig {
    format?: string;
    phenotypes: string;
    trackType: string;
    url: string;
}

/* 

    temp, for screenshots only

*/

const _getFilerTracks = (): NiagadsBrowserTrackConfig[] => [
    /* {
        label: "DNase-seq on human HA-h",
        description: "foo",
        name: "DNase-seq on human HA-h",
        record: "foo",
        source: "FILER",
        track: "ENCFF835DIK",
        phenotypes: "foo",
        trackType: "bed",
        type: "bed",
        url:
            "https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/ChIP-seq/narrowpeak/hg19/1/ENCFF835DIK.bed.gz",
    } ,*/
    {
        label: "DNase-seq on human HA-h",
        description: "foo",
        name: "DNase-seq on human HA-h",
        record: "foo",
        source: "FILER",
        track: "ENCFF316JVA",
        phenotypes: "foo",
        trackType: "bed",
        type: "bed",
        url:
            "https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/ChIP-seq/narrowpeak/hg19/1/ENCFF316JVA.bed.gz",
    },
];
