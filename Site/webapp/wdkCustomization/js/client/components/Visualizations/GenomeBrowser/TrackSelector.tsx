import React, { useEffect, useMemo, useState } from "react";
import Slide from "@material-ui/core/Slide";
import DialogContent from "@material-ui/core/DialogContent";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Dialog from "@material-ui/core/Dialog";

import { TransitionProps } from "@material-ui/core/transitions";
import { Box, Typography } from "@material-ui/core";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import { groupBy, uniq as unique } from "lodash";
import { NiagadsBrowserTrackConfig } from "../../GenomeBrowserPage/GenomeBrowserPage";
import { BaseIconButton, UnlabeledTextField } from "@components/MaterialUI";

import { TrackTable, UnpaddedCheckbox, tracksToTrackConfigs } from "@viz/GenomeBrowser";

//import PaginationComponent from "./../../RecordPage/RecordTable-old/RecordTable/PaginationComponent/PaginationComponent";

const useBrowserStyles = makeStyles(() =>
    createStyles({
        Accordion: {
            flexGrow: 1,
            padding: "0px",
        },
        AccordionDetails: {
            padding: "0px",
            flexDirection: "column",
        },
        DialogContent: {
            display: "flex",
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
        [sources, setSources] = useState<string[]>([]),
        [types, setTypes] = useState<string[]>([]),
        [displayTypes, setDisplayTypes] = useState<string[]>([]),
        [trackList, setTrackList] = useState<NiagadsBrowserTrackConfig[]>([]),
        classes = useBrowserStyles(),
        sourceList = useMemo(() => unique((_trackList || []).map((t) => t.source)), [_trackList]),
        typeList = useMemo(() => unique((_trackList || []).map((t) => t.featureType)), [_trackList]),
        displayTypeList = useMemo(() => unique((_trackList || []).map((t) => t.trackTypeDisplay)), [_trackList]),
        sourceCounts = useMemo(() => groupBy(_trackList || [], (t) => t.source), [_trackList]),
        typeCounts = useMemo(() => groupBy(_trackList || [], (t) => t.featureType), [_trackList]),
        displayTypeCounts = useMemo(() => groupBy(_trackList || [], (t) => t.trackTypeDisplay), [_trackList]);

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
                                sources.includes(t.source) ||
                                types.includes(t.featureType) ||
                                displayTypes.includes(t.trackTypeDisplay) ||
                                (!sources.length && !types.length && !displayTypes.length)
                            )
                    )
            );
        }
    }, [searchTerm, _trackList, sources, types, displayTypes]);

    const closeSelf = () => {
            setSearchTerm("");
            setSources([]);
            setTypes([]);
            handleClose();
        },
        toggleSource = (source: string) => {
            if (sources.includes(source)) {
                setSources(sources.filter((s) => s != source));
            } else {
                setSources(sources.concat([source]));
            }
        },
        toggleType = (type: string) => {
            if (types.includes(type)) {
                setTypes(types.filter((s) => s != type));
            } else {
                setTypes(types.concat([type]));
            }
        },
        toggleDisplayType = (type: string) => {
            if (displayTypes.includes(type)) {
                setDisplayTypes(displayTypes.filter((s) => s != type));
            } else {
                setDisplayTypes(displayTypes.concat([type]));
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
            <DialogContent className={classes.DialogContent}>
                <Grid container alignItems="flex-start" direction="row" spacing={3}>
                    <Grid item container direction="column" spacing={2} xs={4} lg={2}>
                        <Grid container>
                            <Typography variant="h4">Browse Tracks</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">Filters</Typography>
                        </Grid>
                        <Grid item>
                            <Accordion className={classes.Accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Loaded Tracks</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.AccordionDetails}>
                                    <FilterList>
                                        {activeTracks &&
                                            activeTracks
                                                .filter((t) => !["ideogram", "ruler", "sequence"].includes(t))
                                                .map((t) => (
                                                    <UnpaddedListItem key={t}>
                                                        <UnpaddedCheckbox
                                                            color="primary"
                                                            checked={true}
                                                            onChange={toggleTracks.bind(
                                                                null,
                                                                tracksToTrackConfigs([
                                                                    _trackList.find((track) => track.name === t),
                                                                ])
                                                            )}
                                                        />
                                                        &nbsp;{t}
                                                    </UnpaddedListItem>
                                                ))}
                                    </FilterList>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.Accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Source</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.AccordionDetails}>
                                    <FilterList>
                                        {sourceList.map((a: string) => (
                                            <UnpaddedListItem key={a}>
                                                <UnpaddedCheckbox
                                                    color="primary"
                                                    checked={sources.includes(a)}
                                                    onChange={toggleSource.bind(null, a)}
                                                />{" "}
                                                {`${a} (${sourceCounts[a].length})`}
                                            </UnpaddedListItem>
                                        ))}
                                    </FilterList>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.Accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Feature Type</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.AccordionDetails}>
                                    <FilterList>
                                        {typeList.map((a: string) => (
                                            <UnpaddedListItem key={a}>
                                                <UnpaddedCheckbox
                                                    color="primary"
                                                    checked={types.includes(a)}
                                                    onChange={toggleType.bind(null, a)}
                                                />{" "}
                                                {`${a} (${typeCounts[a].length})`}
                                            </UnpaddedListItem>
                                        ))}
                                    </FilterList>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.Accordion}>
                                <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Track Type</Typography>
                                </FilterAccordionSummary>
                                <AccordionDetails className={classes.AccordionDetails}>
                                    <FilterList>
                                        {displayTypeList.map((a: string) => (
                                            <UnpaddedListItem key={a}>
                                                <UnpaddedCheckbox
                                                    color="primary"
                                                    checked={displayTypes.includes(a)}
                                                    onChange={toggleDisplayType.bind(null, a)}
                                                />{" "}
                                                {`${a} (${displayTypeCounts[a].length})`}
                                            </UnpaddedListItem>
                                        ))}
                                    </FilterList>
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

const FilterList = withStyles((theme) => ({
    root: {
        paddingTop: "0px",
        paddingBottom: "10px",
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}))(List);

//typescript flaw in material ui prevents this from working
//const UnpaddedListItem = stripPadding(ListItem);
// @ts-ignore
const UnpaddedListItem = (props: ListItemProps) => <ListItem {...props} style={{ padding: "0px" }} />;

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
