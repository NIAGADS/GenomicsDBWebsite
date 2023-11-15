/** Navigation panel for record page */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import Icon from "@material-ui/core/Icon";
import MenuIcon from "@material-ui/icons/Menu";
import ShareIcon from "@material-ui/icons/Share";
import BookIcon from "@material-ui/icons/Book";
import LineStyleIcon from "@material-ui/icons/LineStyle";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { DrawerState, StyledTooltip as Tooltip, DrawerProps } from "@components/MaterialUI";
import { PersistentDrawerRight as PersistentDrawer} from "@components/MaterialUI/Drawer/PersistentDrawerRight";

import { RootState } from "wdk-client/Core/State/Types";
import { RecordClass } from "wdk-client/Utils/WdkModel";

export interface RecordActions {
    primaryKey: string;
    recordClass: RecordClass;
    browserLocus?: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerContents: {
            padding: theme.spacing(1),
        },
        menuButton: {
            //marginRight: 36,
            borderRadius: "10%",
            color: "white",
            fontSize: "2rem",
            padding: "8px",
            background: "rgba(0, 0, 0, 0.19) none repeat scroll 0% 0%",
            "&:hover": {
                background: "rgba(0, 0, 0, 0.5) none repeat scroll 0% 0% !important",
            },
        },
        actionButton: {
            marginTop: theme.spacing(1),
            justifyContent: "left",
        },
        shareLink: {
            fontSize: "1rem",
        },
        hide: {
            display: "none",
        },
        menuIcon: {
            fill: "white",
            //background: theme.palette.grey[50],
        },
        menu: {
            position: "fixed",
            height: "80px",
            zIndex: 1,
        },
    })
);

export const RecordNavigationButton: React.FC<DrawerState> = ({ isOpen, handleOpen }) => {
    const classes = useStyles();
    return (
        <Toolbar disableGutters={true} className={classes.menu}>
            <Tooltip
                arrow
                title={
                    <Typography color="inherit" variant="caption">
                        Show page navigation and contents panel
                    </Typography>
                }
            >
                <Button
                    aria-label="open record navigation / table of contents panel on the left"
                    onClick={handleOpen}
                    className={clsx(classes.menuButton, isOpen && classes.hide)}
                    endIcon={ <MenuIcon className={classes.menuIcon} />}
                >
                    Contents
                </Button>
            </Tooltip>
        </Toolbar>
    );
};

/* genome browser, export, share, bookmark */
export const RecordActionButtons: React.FC<RecordActions> = ({ primaryKey, recordClass, browserLocus }) => {
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const isGuest = useSelector((state: RootState) => state.globalData?.user?.isGuest);
    const [exportUrl, setExportUrl] = useState<string>("loading");
    const [canBookmark, setCanBookmark] = useState<boolean>(false);
    const [shareIsOpen, setShareIsOpen] = useState<boolean>(false);

    const classes = useStyles();

    useEffect(() => {
        if (webAppUrl) {
            const url = webAppUrl + "/app/record/" + recordClass.urlSegment + "/download/" + primaryKey;
            setExportUrl(url);
        }
        if (isGuest) {
            setCanBookmark(isGuest);
        }
    }, [webAppUrl, isGuest]);

    const toggleShareModal = () => {
        setShareIsOpen(!shareIsOpen);
    };

    const handleCopyClick = (event: React.MouseEvent<HTMLElement>) => {
        const shareLink = window.location.toString().split("#")[0]; // remove anchors
        navigator.clipboard.writeText(shareLink);
        toggleShareModal();
    };

    const roiLabel = primaryKey.startsWith("ENS")
        ? primaryKey
        : primaryKey.includes(":rs")
        ? "rs" + primaryKey.split(":rs")[1]
        : primaryKey;

    let additionalParams = '&roiLabel=' + roiLabel;
    if (primaryKey.includes(":rs")) {
        additionalParams += '&track=dbSNP';
    }

    return (
        <>
            <Grid item>
                {browserLocus && (
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<LineStyleIcon />}
                        href={`${webAppUrl}/app/visualizations/browser?locus=${browserLocus}${additionalParams}`}
                        fullWidth={true}
                        size="small"
                        className={classes.actionButton}
                        target="_blank"
                    >
                        View on genome browser
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="default"
                    startIcon={<Icon className="fa fa-download" />}
                    href={exportUrl}
                    disabled={exportUrl === "loading"}
                    fullWidth={true}
                    size="small"
                    className={classes.actionButton}
                >
                    Export record
                </Button>
                <Tooltip
                    arrow
                    title={
                        <Typography color="inherit" variant="caption">
                            Click to copy share permalink to cliboard
                        </Typography>
                    }
                >
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<ShareIcon />}
                        onClick={handleCopyClick}
                        fullWidth={true}
                        size="small"
                        className={classes.actionButton}
                    >
                        Share this page
                    </Button>
                </Tooltip>
                {/* span allow tooltip to fire, since button is disabled */}
                {/* <Tooltip
                    arrow
                    title={
                        <Typography color="inherit" variant="caption">
                            Features for registered users coming soon.
                        </Typography>
                    }
                >
                    <span>
                        <Button
                            variant="contained"
                            color="default"
                            startIcon={<BookIcon />}
                            disabled={canBookmark}
                            fullWidth={true}
                            size="small"
                            className={classes.actionButton}
                        >
                            Bookmark
                        </Button>
                    </span>
                </Tooltip>*/}
            </Grid>
            <Dialog open={shareIsOpen} onClose={() => toggleShareModal()} aria-labelledby="alert-dialog-description">
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Share link for this record copied to clipboard.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => toggleShareModal()} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const RecordNavigationSection: React.FC<DrawerProps & DrawerState> = ({ children, isOpen, handleClose }) => {
    const classes = useStyles();
    return (
        <PersistentDrawer isOpen={isOpen} handleClose={handleClose} title="Hide Navigation">
            <Box className={classes.drawerContents}>{children}</Box>
        </PersistentDrawer>
    );
};
