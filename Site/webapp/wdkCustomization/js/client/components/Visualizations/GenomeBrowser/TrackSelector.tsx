import React, { useEffect, useMemo, useState } from "react";
import { groupBy, uniq as unique } from "lodash";

import Slide from "@material-ui/core/Slide";
import DialogContent from "@material-ui/core/DialogContent";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import WarningIcon from "@material-ui/icons/Warning";

import { TransitionProps } from "@material-ui/core/transitions";
import { makeStyles, createStyles, withStyles, Theme } from "@material-ui/core/styles";

import { BaseIconButton, UnlabeledTextField } from "@components/MaterialUI";

import { TrackTable, tracksToTrackConfigs, TrackSummary, IgvTrackConfig } from "@viz/GenomeBrowser";


const useBrowserStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexRight: {
            marginLeft: "auto",
        },
        accordion: {
            flexGrow: 1,
            padding: "0px",
        },
        accordionDetails: {
            padding: "0px",
            flexDirection: "column",
        },
        dialogContent: {
            display: "flex",
        },
        formControl: {
            margin: theme.spacing(3),
        },
        formLabel: {
            fontSize: "0.8rem",
            // marginTop: "-150px",
            marginBottom: "10px",
        },
        formControlLabel: {
            fontSize: "0.85rem",
        },
    })
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="right" ref={ref} {...props} />;
});

interface TrackSelectorProps {
    activeTracks: string[];
    handleClose: () => void;
    loadingTrack: string;
    isOpen: boolean;
    toggleTracks: (t: IgvTrackConfig[], b:any) => void;
    trackList: TrackSummary[];
    browser: any;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
    activeTracks,
    handleClose,
    isOpen,
    loadingTrack,
    toggleTracks,
    trackList: _trackList,
    browser
}) => {
    const [searchTerm, setSearchTerm] = useState(""),
        [dataSources, setDataSources] = useState<string[]>([]),
        [sequenceFeatureTypes, setSequenceFeatureTypes] = useState<string[]>([]),
        [trackTypes, setTrackTypes] = useState<string[]>([]),
        [trackList, setTrackList] = useState<TrackSummary[]>([]),
        classes = useBrowserStyles(),
        dataSourceList = useMemo(() => unique((_trackList || []).map((t) => t.source)), [_trackList]),
        sequenceFeatureTypeList = useMemo(() => unique((_trackList || []).map((t) => t.featureType)), [_trackList]),
        trackTypeList = useMemo(() => unique((_trackList || []).map((t) => t.trackTypeDisplay)), [_trackList]),
        dataSourceCounts = useMemo(() => groupBy(_trackList || [], (t) => t.source), [_trackList]),
        sequenceFeatureTypeCounts = useMemo(() => groupBy(_trackList || [], (t) => t.featureType), [_trackList]),
        trackTypeCounts = useMemo(() => groupBy(_trackList || [], (t) => t.trackTypeDisplay), [_trackList]);

    useEffect(() => {
        const st = searchTerm.toLowerCase();
        if (_trackList) {
            setTrackList(
                _trackList
                    .filter(
                        (t) =>
                            t.url.toLowerCase().includes(st) ||
                            (t.description || "").toLowerCase().includes(st) ||
                            (t.name || "").toLowerCase().includes(st) ||
                            (t.source || "").toLowerCase().includes(st)
                    )
                    .filter(
                        (t) =>
                            !!(
                                dataSources.includes(t.source) ||
                                sequenceFeatureTypes.includes(t.featureType) ||
                                trackTypes.includes(t.trackTypeDisplay) ||
                                (!dataSources.length && !sequenceFeatureTypes.length && !trackTypes.length)
                            )
                    )
            );
        }
    }, [searchTerm, _trackList, dataSources, sequenceFeatureTypes, trackTypes]);

    const closeSelf = () => {
            setSearchTerm("");
            setDataSources([]);
            setSequenceFeatureTypes([]);
            handleClose();
        },
        toggleDataSource = (source: string) => {
            if (dataSources.includes(source)) {
                setDataSources(dataSources.filter((s) => s != source));
            } else {
                setDataSources(dataSources.concat([source]));
            }
        },
        toggleSequenceFeatureType = (type: string) => {
            if (sequenceFeatureTypes.includes(type)) {
                setSequenceFeatureTypes(sequenceFeatureTypes.filter((s) => s != type));
            } else {
                setSequenceFeatureTypes(sequenceFeatureTypes.concat([type]));
            }
        },
        toggleTrackType = (type: string) => {
            if (trackTypes.includes(type)) {
                setTrackTypes(trackTypes.filter((s) => s != type));
            } else {
                setTrackTypes(trackTypes.concat([type]));
            }
        };

    const renderActiveTrackChoices = (
            <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Loaded Tracks</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend" className={classes.formLabel}>
                            Tracks currently loaded on the browser
                        </FormLabel>

                        <FormGroup>
                            {activeTracks.length > 0 &&
                                activeTracks
                                    .filter((t) => !["ideogram", "ruler", "Sequence", "Genes (RefSeq)"].includes(t))
                                    .map((t) => (
                                        <FormControlLabel
                                            classes={{ label: classes.formControlLabel }}
                                            key={t}
                                            color="primary"
                                            control={
                                                t === "Genes (RefSeq)" ? (
                                                    <Checkbox checked={true} name={t} disabled={true}></Checkbox>
                                                ) : (
                                                    <Checkbox
                                                        checked={true}
                                                        onChange={toggleTracks.bind(
                                                            null,
                                                            tracksToTrackConfigs([
                                                                _trackList.find((track) => track.name === t),
                                                            ]), browser
                                                        )}
                                                        name={t}
                                                    />
                                                )
                                            }
                                            label={t}
                                        />
                                    ))}
                        </FormGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        ),
        renderDataSourceChoices = (
            <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Source</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend" className={classes.formLabel}>
                            Filter tracks by original data source
                        </FormLabel>
                        <FormGroup>
                            {dataSourceList.map((a: string) => (
                                <FormControlLabel
                                    classes={{ label: classes.formControlLabel }}
                                    key={a}
                                    color="primary"
                                    control={
                                        <Checkbox
                                            checked={dataSources.includes(a)}
                                            onChange={toggleDataSource.bind(null, a)}
                                            name={a}
                                        />
                                    }
                                    label={`${a} (${dataSourceCounts[a].length})`}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        ),
        renderSequenceFeatureTypeChoices = (
            <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Sequence Feature</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend" className={classes.formLabel}>
                            Filter tracks by type of sequence feature annotated
                        </FormLabel>
                        <FormGroup>
                            {sequenceFeatureTypeList.map((a: string) => (
                                <FormControlLabel
                                    classes={{ label: classes.formControlLabel }}
                                    key={a}
                                    color="primary"
                                    control={
                                        <Checkbox
                                            checked={sequenceFeatureTypes.includes(a)}
                                            onChange={toggleSequenceFeatureType.bind(null, a)}
                                            name={a}
                                        />
                                    }
                                    label={`${a} (${sequenceFeatureTypeCounts[a].length})`}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        ),
        renderTrackTypeChoices = (
            <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Track Type</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend" className={classes.formLabel}>
                            Filter tracks by type
                        </FormLabel>

                        <FormGroup>
                            {trackTypeList.map((a: string) => (
                                <FormControlLabel
                                    classes={{ label: classes.formControlLabel }}
                                    key={a}
                                    color="primary"
                                    control={
                                        <Checkbox
                                            checked={trackTypes.includes(a)}
                                            onChange={toggleTrackType.bind(null, a)}
                                            name={a}
                                        />
                                    }
                                    label={`${a} (${trackTypeCounts[a].length})`}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        );

    return trackList ? (
        <Dialog
            onBackdropClick={closeSelf}
            onEscapeKeyDown={closeSelf}
            maxWidth={false}
            fullWidth={true}
            open={isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeSelf}
        >
            <DialogContent className={classes.dialogContent}>
                <Grid container alignItems="flex-start" direction="row" spacing={3}>
                    <Grid item container>
                        <Grid item>
                           <Chip color="secondary" icon={<WarningIcon/>} 
                           label="Please pardon our dust; in the table below, tracks will load when selected, even though toggled state(checkboxes) will not change"/>
                            <Typography variant="h4">Select Tracks</Typography>
                        </Grid>
                        <Grid item className={classes.flexRight}>
                            <BaseIconButton onClick={closeSelf} size={"small"}>
                                <CloseIcon />
                            </BaseIconButton>
                        </Grid>
                    </Grid>
                    <Grid item container spacing={2} justifyContent="flex-start" alignItems="flex-start">
                        <Grid item xs={2}>
                            {renderActiveTrackChoices}
                            {renderDataSourceChoices}
                            {renderSequenceFeatureTypeChoices}
                            {renderTrackTypeChoices}
                        </Grid>

                        <Grid item xs={6} lg={10}>
                            <TrackTable
                                data={trackList}
                                activeTracks={activeTracks}
                                toggleTracks={toggleTracks}
                                browser={browser}
                                loadingTrack={loadingTrack}
                            ></TrackTable>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    ) : null;
};

//typescript flaw in material ui prevents this from working
//const UnpaddedListItem = stripPadding(ListItem);
// @ts-ignore
