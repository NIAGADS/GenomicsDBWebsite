import React, { useState } from "react";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
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
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import { TransitionProps } from "@material-ui/core/transitions";
import { Track } from "./tempTracklist";
import { TableCell, Typography } from "@material-ui/core";
import { startCase, get, truncate, uniq as unique } from "lodash";
import { TrackConfig } from "./IgvBrowser";
import { ThemeProvider, makeStyles, createStyles } from "@material-ui/core/styles";
import { theme } from "./mui-theme";

const useBrowserStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        input: {
            marginLeft: theme.spacing(1),
            flexGrow: 1,
        },
        canGrow: {
            flexGrow: 1,
        },
        CheckBoxCell: {
            textAlign: "center",
        },
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
        DialogPaper: {},
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
    tracks: Track[];
    toggleTracks: (t: TrackConfig[]) => void;
}

const TrackBrowser: React.FC<TrackBrowser> = ({
    activeTracks,
    handleClose,
    isOpen,
    loadingTrack,
    toggleTracks,
    tracks,
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
        tracksToTrackConfigs = (tracks: Track[]): TrackConfig[] => {
            return tracks.map((track) => ({
                name: track.track,
                format: track.format,
                displayMode: "expanded",
                url: track.url,
                indexURL: track.url + ".tbi",
                visibilityWindow: -1,
            }));
        };

    return (
        <ThemeProvider theme={theme}>
            <Dialog
                onBackdropClick={handleClose}
                onEscapeKeyDown={handleClose}
                maxWidth={false}
                fullWidth={true}
                open={isOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                classes={{ paper: classes.DialogPaper }}
            >
                <DialogTitle disableTypography>
                    <Grid container justify="space-between">
                        <Typography variant="h4">Browse Tracks</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </DialogTitle>

                <DialogContent className={classes.DialogContent}>
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item container direction="column" wrap="nowrap" spacing={2} xs={2}>
                            <Grid container alignItems="center" item xs={12}>
                                <SearchIcon />
                                <Input
                                    className={classes.input}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5">Filters</Typography>
                            </Grid>
                            <Grid item xs={12}>
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
                                            {unique(tracks.map((t) => t.source)).map((a: string) => (
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
                                            {unique(tracks.map((t) => t.type)).map((a: string) => (
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
                        <Grid item container xs={10}>
                            <TableContainer className={classes.TableContainer}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography>Select</Typography>
                                            </TableCell>
                                            {Object.keys(get(tracks, "[0]", [])).map((t) => (
                                                <TableCell key={t}>{startCase(t)}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tracks
                                            .filter(
                                                (t) =>
                                                    t.track.toLowerCase().includes(searchTerm) ||
                                                    t.description.toLowerCase().includes(searchTerm)
                                            )
                                            .filter((t) => {
                                                if (
                                                    sources.includes(t.source) ||
                                                    types.includes(t.type) ||
                                                    (!sources.length && !types.length)
                                                ) {
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            })
                                            .map((t, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className={classes.CheckBoxCell}>
                                                        {loadingTrack === t.track ? (
                                                            <CircularProgress size={25} />
                                                        ) : (
                                                            <Checkbox
                                                                color="primary"
                                                                checked={activeTracks.includes(t.track)}
                                                                onChange={toggleTracks.bind(
                                                                    null,
                                                                    tracksToTrackConfigs([t])
                                                                )}
                                                                disabled={!!loadingTrack}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    {Object.values(t).map((p, i) => (
                                                        <TableCell key={i}>{_truncateLongStrings(p)}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Dismiss
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

const _truncateLongStrings = (str: string) =>
    str
        .split(" ")
        .map((s) => truncate(s))
        .join(" ");

export default TrackBrowser;
