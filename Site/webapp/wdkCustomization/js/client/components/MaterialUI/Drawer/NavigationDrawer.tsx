/* drawer tied to navigation toolbar */
import React, { useState } from "react";
import clsx from "clsx";

import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import {
    CustomTooltip as Tooltip,
    DrawerProps,
    MaterialUIThemedButton,
    DRAWER_WIDTH
} from "@components/MaterialUI";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useDrawerStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerHeader: {
            //display: "flex",
            //alignItems: "center",
            //padding: theme.spacing(0, 3),
            // necessary for content to be below app bar
            //...theme.mixins.toolbar,
            //justifyContent: "flex-end",
            //marginTop: theme.spacing(1),
        },
        title: {
            fontSize: theme.typography.pxToRem(12),
        },
        actionButton: {
            marginTop: theme.spacing(1),
            // justifyContent: "left"
        },
        divider: {
            marginTop: theme.spacing(1),
        },
        children: {
            marginTop: theme.spacing(1),
        },
        content: {
            //padding: theme.spacing(3),
        },
        sideDrawer: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
        sideDrawerPaper: {
            width: DRAWER_WIDTH,
        },
        fullWidth: {
            margin: "auto",
        },
    })
);

export const NavigationDrawer: React.FC<DrawerProps> = ({
    navigation,
    navigationProps,
    drawerContents,
    drawerSections,
    drawerProps,
    drawerHeaderContents,
    toggleAnchor,
    toggleIcon,
    toggleHelp,
    toggleText,
    children,
    className,
    drawerCloseLabel,
}) => {
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(false);

    const handleToggleClick = () => {
        setOpen(!open);
    };

    const renderDrawerHeader = (
        <Grid container className={classes.drawerHeader} justifyContent="center" spacing={2}>
            <Grid item>
                <Button
                    variant="text"
                    color="primary"
                    endIcon={<ChevronLeftIcon />}
                    onClick={handleToggleClick}
                    fullWidth={true}
                    size="small"
                    className={classes.actionButton}
                >
                    {drawerCloseLabel ? drawerCloseLabel : "Close"}
                </Button>
            </Grid>
            <Grid item>{drawerHeaderContents}</Grid>
        </Grid>
    );

    const renderDrawerSections = (
        <>
            {drawerSections?.map((section, index) => {
                return (
                    <div key={index}>
                        {section}
                    </div>
                );
            })}
        </>
    );


return (
    <React.Fragment key={toggleAnchor}>
        <AppBar position="static" elevation={0} {...navigationProps} className={className} disableGutters={true}>
            <Toolbar /*style={{ display: "flex" }} */ variant="dense" disableGutters={true}>
                {toggleIcon &&
                    <Tooltip title={toggleHelp} aria-label={toggleHelp}>
                        <MaterialUIThemedButton
                            style={toggleAnchor === "right" ? { marginLeft: "auto" } : {}}
                            color="primary"
                            variant="text"
                            aria-label="toggle-secondary-navigation"
                            onClick={handleToggleClick}
                            endIcon={toggleIcon}
                        >
                            {toggleText}
                        </MaterialUIThemedButton>
                   </Tooltip>}
                {navigation}
            </Toolbar>
        </AppBar>
        <Drawer
            anchor={toggleAnchor}
            open={open}
            classes={{
                paper: clsx(classes.sideDrawerPaper, {
                    "": toggleAnchor === "top" || toggleAnchor === "bottom",
                }),
            }}
            className={clsx(classes.sideDrawer, {
                [classes.fullWidth]: toggleAnchor === "top" || toggleAnchor === "bottom",
            })}
            variant="temporary"
            onClose={(event, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                    setOpen(false);
                }
            }}
            {...drawerProps}
        >
            {renderDrawerHeader}
            <Divider className={classes.divider}></Divider>
            {drawerContents && <Box className={classes.content}>{drawerContents}</Box>}
            {drawerSections && <Box className={classes.content}>{renderDrawerSections}</Box>}
        </Drawer>

        {children}
    </React.Fragment>
);
};
