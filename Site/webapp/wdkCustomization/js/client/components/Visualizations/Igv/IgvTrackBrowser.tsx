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
import Checkbox from "@material-ui/core/Checkbox";
import { TransitionProps } from "@material-ui/core/transitions";
import { Box, Typography } from "@material-ui/core";
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles";
import { groupBy, startCase, truncate, uniq as unique } from "lodash";
import { NiagadsBrowserTrackConfig } from "./../../GenomeBrowserPage/GenomeBrowserPage";
import { BaseIconButton, UnlabeledTextField } from "@components/MaterialUI";
import ReactTable, { Column } from "react-table";
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
        },
        tracksToTrackConfigs = (tracks: NiagadsBrowserTrackConfig[]): IgvTrackConfig[] => {
            return tracks.map((track) => {
                const base = {
                    displayMode: "expanded",
                    format: track.format,
                    url: track.url,
                    indexURL: `${track.url}.tbi`,
                    name: track.name,
                    type: track.trackType,
                    id: track.trackType,
                    visibilityWindow: -1,
                } as IgvTrackConfig;
                if (track.reader) {
                    base.reader = track.reader;
                }
                return base;
            });
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
                                        {activeTracks
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
                        <Box className="browser-table">
                            {/*<ReactTable
                                style={{
                                    height: "500px", // This will force the table body to overflow and scroll
                                }}
                                columns={[
                                    {
                                        id: "select",
                                        accessor: (row: any) => {
                                            return (
                                                <UnpaddedCheckbox
                                                    color="primary"
                                                    checked={activeTracks.includes(row.name)}
                                                    onChange={toggleTracks.bind(null, tracksToTrackConfigs([row]))}
                                                    disabled={!!loadingTrack}
                                                />
                                            );
                                        },
                                        Header: () => "Select",
                                        width: 50,
                                    } as Column,
                                ].concat(
                                    getColumns().map((col: Column) => {
                                        col.Header = () => startCase(col.id);
                                        col.accessor = (row: any) => {
                                            if (col.id === "description") {
                                                return <ShowMore str={row[col.id] ? row[col.id] : ""} />;
                                            } else {
                                                return row[col.id];
                                            }
                                        };
                                        return col;
                                    })
                                )}
                                data={trackList}
                                //PaginationComponent={PaginationComponent}
                                minRows={0}
                                />*/}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    ) : null;
};

export default TrackBrowser;

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

const getColumns = (): Column[] => [
    { id: "name", maxWidth: 300 } as Column,
    { id: "description" },
    { id: "source", width: 100 },
    { id: "featureType", width: 120 },
];

const ShowMore: React.FC<{ str: string }> = ({ str }) => {
    const [fullStringVisible, setFullStringVisible] = useState(false);

    if (str.length < 150) return <span>{str}</span>;

    return fullStringVisible ? (
        <span>
            {str}&nbsp;
            <span className="link" onClick={() => setFullStringVisible(false)}>
                less
            </span>
        </span>
    ) : (
        <span>
            {truncate(str, { length: 150 })}{" "}
            <span className="link" onClick={() => setFullStringVisible(true)}>
                more
            </span>
        </span>
    );
};

const UnpaddedCheckbox = withStyles(() => ({
    root: {
        padding: "0px",
    },
}))(Checkbox);

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
