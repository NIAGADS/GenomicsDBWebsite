import React, { useEffect, useMemo, useState } from "react";
import { groupBy, uniq as unique } from "lodash";

import Slide from "@material-ui/core/Slide";
import DialogContent from "@material-ui/core/DialogContent";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { TransitionProps } from "@material-ui/core/transitions";
import { makeStyles, createStyles, withStyles, Theme } from "@material-ui/core/styles";

import { BaseIconButton, UnlabeledTextField } from "@components/MaterialUI";

import { TrackTable, tracksToTrackConfigs, NiagadsBrowserTrackConfig, IgvTrackConfig } from "@viz/GenomeBrowser";

const useBrowserStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    toggleTracks: (t: IgvTrackConfig[]) => void;
    trackList: NiagadsBrowserTrackConfig[];
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
    activeTracks,
    handleClose,
    isOpen,
    loadingTrack,
    toggleTracks,
    trackList: _trackList,
}) => {
    const [searchTerm, setSearchTerm] = useState(""),
        [dataSources, setDataSources] = useState<string[]>([]),
        [sequenceFeatureTypes, setSequenceFeatureTypes] = useState<string[]>([]),
        [trackTypes, setTrackTypes] = useState<string[]>([]),
        [trackList, setTrackList] = useState<NiagadsBrowserTrackConfig[]>([]),
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
                    <Grid item container direction="column" spacing={2} xs={4} lg={2}>
                        <Grid container>
                            <Typography variant="h4">Select Tracks</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">Filters</Typography>
                        </Grid>
                        <Grid item>
                            <Accordion className={classes.accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Loaded Tracks</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.accordionDetails}>
                                    <FormControl component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend">
                                            Tracks currently displayed on the genome browser
                                        </FormLabel>
                                        <FormGroup>
                                            {activeTracks.length > 0 &&
                                                activeTracks
                                                    .filter((t) => !["ideogram", "ruler", "sequence"].includes(t))
                                                    .map((t) => (
                                                        <FormControlLabel
                                                            key={t}
                                                            color="primary"
                                                            control={
                                                                <Checkbox
                                                                    checked={true}
                                                                    onChange={toggleTracks.bind(
                                                                        null,
                                                                        tracksToTrackConfigs([
                                                                            _trackList.find(
                                                                                (track) => track.name === t
                                                                            ),
                                                                        ])
                                                                    )}
                                                                    name={t}
                                                                />
                                                            }
                                                            label={t}
                                                        />
                                                    ))}
                                        </FormGroup>
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Source</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.accordionDetails}>
                                    <FormControl component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend">Filter tracks by original data source</FormLabel>
                                        <FormGroup>
                                            {dataSourceList.map((a: string) => (
                                                <FormControlLabel
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
                            <Accordion className={classes.accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Sequence Feature</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.accordionDetails}>
                                    <FormControl component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend">Filter tracks by type of sequence feature annotated</FormLabel>
                                        <FormGroup>
                                        {sequenceFeatureTypeList.map((a: string) => (
                                             <FormControlLabel
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
                            <Accordion className={classes.accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Track Type</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.accordionDetails}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend">Filter tracks by type</FormLabel>
                                        <FormGroup>
                                        {trackTypeList.map((a: string) => (
                                              <FormControlLabel
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
                        </Grid>
                    </Grid>
                    <Grid item container direction="column" xs={8} lg={10} spacing={2}>
                        <Grid item container direction="row" wrap="nowrap" alignItems="center">
                            <UnlabeledTextField
                                fullWidth={false}
                                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                placeholder="Search for a track"
                                startAdornment={<SearchIcon />}
                                value={searchTerm}
                            />
                            <Grid container item justify="flex-end">
                                <BaseIconButton onClick={closeSelf} size={"small"}>
                                    <CloseIcon />
                                </BaseIconButton>
                            </Grid>
                        </Grid>

                        <TrackTable
                            data={trackList}
                            activeTracks={activeTracks}
                            toggleTracks={toggleTracks}
                            loadingTrack={loadingTrack}
                        ></TrackTable>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    ) : null;
};

//typescript flaw in material ui prevents this from working
//const UnpaddedListItem = stripPadding(ListItem);
// @ts-ignore

const FilterAccordionSummary = withStyles(() => ({
    root: {
        "&$expanded": {
            minHeight: "50px",
        },
    },
    content: {
        "&$expanded": {
            paddingTop: "0px",
            paddingBottom: "0px",
            marginTop: "0px",
            marginBottom: "0px",
        },
    },
    expanded: {
        paddingTop: "0px",
        paddingBottom: "0px",
        marginTop: "0px",
        marginBottom: "0px",
    },
}))(AccordionSummary);
