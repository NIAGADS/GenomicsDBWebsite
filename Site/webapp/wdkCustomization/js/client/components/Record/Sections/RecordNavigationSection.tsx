/** Navigation panel for record page */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Icon from "@material-ui/core/Icon";
import MenuIcon from "@material-ui/icons/Menu";
import ShareIcon from "@material-ui/icons/Share";
import BookIcon from "@material-ui/icons/Book";
import LineStyleIcon from "@material-ui/icons/LineStyle";
import Grid from "@material-ui/core/Grid";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { PersistentDrawerLeft, DrawerState, StyledTooltip as Tooltip, DrawerProps } from "@components/MaterialUI";

import { RootState } from "wdk-client/Core/State/Types";
import { RecordClass } from "wdk-client/Utils/WdkModel";

export interface RecordActions {
    primaryKey: string;
    recordClass: RecordClass;
    browserSpan?: string;
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
                        Show table of contents panel
                    </Typography>
                }
            >
                <IconButton
                    aria-label="open record navigation / table of contents panel on the left"
                    onClick={handleOpen}
                    edge="start"
                    className={clsx(classes.menuButton, isOpen && classes.hide)}
                >
                    <MenuIcon className={classes.menuIcon} />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
};

/* genome browser, export, share, bookmark */
export const RecordActionButtons: React.FC<RecordActions> = ({ primaryKey, recordClass, browserSpan }) => {
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

    const toggleShareModal = (event: React.MouseEvent<HTMLElement>) => {
        setShareIsOpen(!shareIsOpen);
    };

    const handleCopyClick = (event: React.MouseEvent<HTMLElement>) => {
        navigator.clipboard.writeText(window.location.toString());
    };

    return (
        <>
            <Grid item>
                {browserSpan && (
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<LineStyleIcon />}
                        href={`${webAppUrl}/app/visualizations/browser?#locus=${browserSpan}`}
                        fullWidth={true}
                        size="small"
                        className={classes.actionButton}
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
                <Tooltip
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
                </Tooltip>
            </Grid>
        </>
    );
};

export const RecordNavigationSection: React.FC<DrawerProps & DrawerState> = ({ children, isOpen, handleClose }) => {
    const classes = useStyles();
    return (
        <PersistentDrawerLeft isOpen={isOpen} handleClose={handleClose} title="Hide Navigation">
            <Box className={classes.drawerContents}>{children}</Box>
        </PersistentDrawerLeft>
    );
};
