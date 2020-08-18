import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import Container from "@material-ui/core/Container";
import { theme } from "./../Visualizations/Igv/mui-theme";
import tempTrackList from "./../Visualizations/Igv/tempTracklist";
import TrackBrowser from "./../Visualizations/Igv/IgvTrackBrowser";
import IGVBrowser from "./../Visualizations/Igv/IgvBrowser";
import NiagadsGWASTrack from "./../../../lib/igv/niagadsTrack";
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

const useDemoStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        AppBar: {
            padding: "0px 10px",
        },
        Drawer: {
            position: "relative",
            right: "auto",
            bottom: "auto",
            top: "auto",
            left: "auto",
        },
        Accordion: {
            flexGrow: 1,
        },
        AccordionDetails: {
            flexDirection: "column",
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

export default () => {
    const classes = useDemoStyles(),
        [Browser, setBrowser] = useState<any>(),
        [loadingTrack, setLoadingTrack] = useState<string>(),
        [drawerOpen, setDrawerOpen] = useState(false),
        [listVisible, setListVisible] = useState(false),
        [reloadKey, setReloadKey] = useState(makeReloadKey());

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
            b.addTrackToFactory("niagadsgwas", (config: any, browser: any) => new NiagadsGWASTrack(config, browser));
            setBrowser(b);
        }, []);

    return (
        <Container maxWidth="xl">
            <ThemeProvider theme={theme}>
                <Button variant="outlined" color="primary" onClick={() => setDrawerOpen(!drawerOpen)}>
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
                    <MemoBroswer onBrowserLoad={buildBrowser} defaultSpan={defaultSpan} />
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
                    tracks={tempTrackList}
                />
            </ThemeProvider>
        </Container>
    );
};

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
    /* {
        name: "NG00027 stage 12",
        displayMode: "EXPANDED",
        url: "http://localhost:3009/NG00027_STAGE12.bed.gz",
        indexURL: "http://localhost:3009/NG00027_STAGE12.bed.gz.tbi",
        visibilityWindow: 1000000,
    }, */
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
