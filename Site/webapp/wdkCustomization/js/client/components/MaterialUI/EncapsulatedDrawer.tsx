// modified from https://raw.githubusercontent.com/Jon20111/drawer-inside-div/main/src/components/DrawerInsideDiv.jsx

import React, { useEffect, useState, useRef } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";

import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";

import { withHtmlTooltip } from "@components/MaterialUI";

import clsx from "clsx";
import Grid from "@material-ui/core/Grid";

const DRAWER_WIDTH = 400;
const MAX_HEIGHT = 750;

const useContentStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
            //maxHeight: MAX_HEIGHT,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: DRAWER_WIDTH,
            //maxHeight: MAX_HEIGHT,
        },
    })
);

interface StyleProps {
    height: number;
}

const useDrawerStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
    createStyles({
        drawer: {
            width: DRAWER_WIDTH,
            borderRight: `1px solid ${theme.palette.primary.light}`,
            flexShrink: 0,
            "& .MuiBackdrop-root": {
                display: "none",
            },
            "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                position: "absolute",
                height: ({ height }) => height,
                maxHeight: MAX_HEIGHT,
                //transition: "none !important",
            },
        },
        button: {
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: "20%",
            padding: "4.5px",
            "&:hover": {
                backgroundColor: theme.palette.grey[100],
            },
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: "flex-end",
            marginTop: "10px",
            minHeight: "32px",
        },
        title: {
            fontSize: theme.typography.pxToRem(12),
        },
        content: {
            overflowY: "scroll",
        },
    })
);

interface DrawerProps {
    navigation: React.ReactNode;
    drawerContents: React.ReactNode;
    drawerProps?: any;
    navigationProps?: any; //appBarProps
    toggleAnchor: string;
    toggleIcon: React.ReactNode;
    toggleHelp: string;
    drawerCloseLabel: string;
    drawerHeaderContents?: React.ReactNode;
    handleClose?: any;
    handleOpen?: any;
}

interface DrawerContentsProps {
    children?: React.ReactNode; // what goes in the div (e.g., a table)
}

const DrawerContents: React.FC<DrawerContentsProps> = ({ children }) => {
    return <>{children}</>;
};

export const EncapsulatedDrawer: React.FC<DrawerProps & DrawerContentsProps> = ({
    navigation,
    navigationProps,
    drawerContents,
    drawerProps,
    drawerCloseLabel,
    drawerHeaderContents,
    toggleAnchor,
    toggleIcon,
    toggleHelp,
    children,
}) => {
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState(0);

    const containerRef = useRef();

    const theme = useTheme();
    const drawerClasses = useDrawerStyles({ height: height });
    const contentClasses = useContentStyles();

    useEffect(() => {
        if (open) {
            //@ts-ignore
            setHeight(containerRef.current.clientHeight - 64);
        } else {
            setHeight(0);
        }
    }, [useRef, open]);

    const handleToggleClick = () => {
        setOpen(!open);
    };

    const onDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div ref={containerRef} style={{ width: "100%" }}>
                <AppBar position="static" elevation={0} {...navigationProps}>
                    <Toolbar /*style={{ display: "flex" }} */ variant="dense">
                        {toggleIcon &&
                            withHtmlTooltip(
                                <IconButton
                                    className={drawerClasses.button}
                                    style={toggleAnchor === "right" ? { marginLeft: "auto" } : {}}
                                    color="inherit"
                                    aria-label="toggleButton"
                                    onClick={handleToggleClick}
                                >
                                    {toggleIcon}
                                </IconButton>,
                                toggleHelp
                            )}

                        {navigation}
                    </Toolbar>
                </AppBar>
                <Drawer
                    open={open}
                    className={drawerClasses.drawer}
                    variant="persistent"
                    style={
                        toggleAnchor === "left"
                            ? { position: "relative", marginRight: "auto" }
                            : { position: "relative", marginLeft: "auto" }
                    }
                    {...drawerProps}
                >
                    {/*
                    <div className={drawerClasses.drawerHeader}>
                        <Toolbar>
                            {drawerHeaderContents}
                            <IconButton onClick={onDrawerClose}>
                                {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </Toolbar>
                        <Divider />
                    </div>
                    */}

                    <div className={drawerClasses.content}>{drawerContents}</div>
                </Drawer>
                <div className={clsx(contentClasses.content, { [contentClasses.contentShift]: open })}>{children}</div>
            </div>
        </>
    );
};
