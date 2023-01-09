// modified from https://raw.githubusercontent.com/Jon20111/drawer-inside-div/main/src/components/DrawerInsideDiv.jsx

import React, { useEffect, useState, useRef } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";

import clsx from "clsx";

import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";

import { StyledTooltip as Tooltip, DrawerProps, DrawerContentsProps } from "@components/MaterialUI";

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
            maxHeight: MAX_HEIGHT,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: DRAWER_WIDTH,
            maxHeight: MAX_HEIGHT,
        },
        topDrawerContentShift: {},
    })
);

interface StyleProps {
    height?: number;
}

const useDrawerStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
    createStyles({
        topDrawer: {},
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
                //height: ({ height }) => height,
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
                        {toggleIcon && (
                            <Tooltip title={toggleHelp} aria-label={toggleHelp}>
                                <IconButton
                                    className={drawerClasses.button}
                                    style={toggleAnchor === "right" ? { marginLeft: "auto" } : {}}
                                    color="inherit"
                                    aria-label="toggleButton"
                                    onClick={handleToggleClick}
                                >
                                    {toggleIcon}
                                </IconButton>
                            </Tooltip>
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
