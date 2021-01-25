import React, { useState } from "react";
import Slide from "@material-ui/core/Slide";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import { TransitionProps } from "@material-ui/core/transitions";
import { TableCell, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { flatMap, get, memoize, startCase, truncate, uniq as unique } from "lodash";
import { NiagadsBrowserTrackConfig } from "./../../GenomeBrowserPage/GenomeBrowserPage";
import { BaseIconButton, UnlabeledTextField } from "../../Shared";

const useBrowserStyles = makeStyles((theme) =>
    createStyles({
        Accordion: {
            flexGrow: 1,
        },
        AccordionDetails: {
            flexDirection: "column",
        },
        DialogContent: {
            display: "flex",
        },
        TableContainer: {
            height: "65vh", //sticky header needs fixed height, this jibes best w/ out of the box mui style
        },
    })
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="right" ref={ref} {...props} />;
});

interface TrackBrowser {
    activeTracks: string[];
    handleClose: () => void;
    loadingTrack: string;
    isOpen: boolean;
    toggleTracks: (t: IgvTrackConfig[]) => void;
    trackList: NiagadsBrowserTrackConfig[];
}

const TrackBrowser: React.FC<TrackBrowser> = ({
    activeTracks,
    handleClose,
    isOpen,
    loadingTrack,
    toggleTracks,
    trackList,
}) => {
    const [searchTerm, setSearchTerm] = useState(""),
        [sources, setSources] = useState<string[]>([]),
        [types, setTypes] = useState<string[]>([]),
        classes = useBrowserStyles(),
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
        tracksToTrackConfigs = (tracks: NiagadsBrowserTrackConfig[]): IgvTrackConfig[] => {
            return tracks.map((track) => ({
                displayMode: "expanded",
                format: track.format,
                url: track.url,
                indexURL: `${track.url}.tbi`,
                name: track.name,
                type: track.trackType,
                id: track.trackType,
                visibilityWindow: -1,
            }));
        };

    return trackList ? (
        <Dialog
            onBackdropClick={handleClose}
            onEscapeKeyDown={handleClose}
            maxWidth={false}
            fullWidth={true}
            open={isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            <DialogContent className={classes.DialogContent}>
                <Grid container alignItems="flex-start" direction="row" spacing={3}>
                    <Grid item container direction="column" spacing={2} xs={2}>
                        <Grid container>
                            <Typography variant="h4">Browse Tracks</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5">Filters</Typography>
                        </Grid>
                        <Grid item>
                            <Accordion className={classes.Accordion}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Loaded Tracks</Typography>
                                </AccordionSummary>
                                <AccordionDetails className={classes.AccordionDetails}>
                                    <List>
                                        {activeTracks.map((a) => (
                                            <ListItem key={a}>{startCase(a)}</ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.Accordion}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Source</Typography>
                                </AccordionSummary>
                                <AccordionDetails className={classes.AccordionDetails}>
                                    <List>
                                        {unique(trackList.map((t) => t.source)).map((a: string) => (
                                            <ListItem key={a}>
                                                <Checkbox
                                                    color="primary"
                                                    checked={sources.includes(a)}
                                                    onChange={toggleSource.bind(null, a)}
                                                />{" "}
                                                {a}
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.Accordion}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Type</Typography>
                                </AccordionSummary>
                                <AccordionDetails className={classes.AccordionDetails}>
                                    <List>
                                        {unique(trackList.map((t) => t.trackType)).map((a: string) => (
                                            <ListItem key={a}>
                                                <Checkbox
                                                    color="primary"
                                                    checked={types.includes(a)}
                                                    onChange={toggleType.bind(null, a)}
                                                />{" "}
                                                {a}
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                    <Grid item container direction="column" xs={10} spacing={2}>
                        <Grid item container direction="row" wrap="nowrap" alignItems="center">
                            <UnlabeledTextField
                                fullWidth={false}
                                onChange={(e) => setSearchTerm(e.currentTarget.value.toLowerCase())}
                                placeholder="Search for a track"
                                startAdornment={<SearchIcon />}
                                value={searchTerm}
                            />
                            <Grid container item justify="flex-end">
                                <BaseIconButton onClick={handleClose} size={"small"}>
                                    <CloseIcon />
                                </BaseIconButton>
                            </Grid>
                        </Grid>
                        <TableContainer className={classes.TableContainer}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography>Select</Typography>
                                        </TableCell>
                                        {getTableHeadings().map((t) => (
                                            <TableCell key={t}>{startCase(t)}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {trackList
                                        .filter(
                                            (t) =>
                                                t.url.toLowerCase().includes(searchTerm) ||
                                                (t.description || "").toLowerCase().includes(searchTerm) ||
                                                (t.name || "").toLowerCase().includes(searchTerm)
                                        )
                                        .filter((t) => {
                                            if (
                                                sources.includes(t.source) ||
                                                types.includes(t.trackType) ||
                                                (!sources.length && !types.length)
                                            ) {
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        })
                                        .map((t, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    {loadingTrack === t.track ? (
                                                        <CircularProgress size={25} />
                                                    ) : (
                                                        <Checkbox
                                                            color="primary"
                                                            checked={activeTracks.includes(t.name)}
                                                            onChange={toggleTracks.bind(
                                                                null,
                                                                tracksToTrackConfigs([t])
                                                            )}
                                                            disabled={!!loadingTrack}
                                                        />
                                                    )}
                                                </TableCell>
                                                {getTableHeadings().map((h) => {
                                                    const v =
                                                        h in t
                                                            ? transformTableContent(
                                                                  t[h as keyof NiagadsBrowserTrackConfig]
                                                              )
                                                            : null;
                                                    return <TableCell key={`${h}${i}`}>{v}</TableCell>;
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
    ) : null;
};

const _truncateLongStrings = (str: string) =>
    str
        .split(" ")
        .map((s) => truncate(s))
        .join(" ");

export default TrackBrowser;

export interface IgvTrackConfig {
    name: string;
    format?: string;
    displayMode: string;
    height?: number;
    url: string;
    indexURL?: string;
    visibilityWindow: number;
}

/* todo: reduce table size */

const getTableHeadings = () => ["name", "source", "featureType", "description"];

const transformTableContent = (el: string) => <ShowMore str={el ? _truncateLongStrings(el) : ""} />;

const ShowMore: React.FC<{ str: string }> = ({ str }) => {
    const [fullStringVisible, setFullStringVisible] = useState(false);

    if (str.length < 50) return <span>{str}</span>;

    return fullStringVisible ? (
        <span>
            {str}&nbsp;
            <span className="link" onClick={() => setFullStringVisible(false)}>
                less
            </span>
        </span>
    ) : (
        <span>
            {truncate(str, { length: 50 })}{" "}
            <span className="link" onClick={() => setFullStringVisible(true)}>
                more
            </span>
        </span>
    );
};
