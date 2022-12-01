/* drawer tied to navigation toolbar */
import React, { useState } from "react";
import clsx from "clsx";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import {
    CustomTooltip as Tooltip,
    DrawerProps,
    DRAWER_WIDTH
} from "@components/MaterialUI";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useDrawerStyles = (props: any) => makeStyles((theme: Theme) =>
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
            width: props.width || DRAWER_WIDTH,
            flexShrink: 0,
        },
        sideDrawerPaper: {
            width: props.width || DRAWER_WIDTH,
        },
        fullWidth: {
            margin: "auto",
        },
    })
);

export const NavigationDrawer: React.FC<DrawerProps> = (props) => {
    const {
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
        width,
        encapsulated
    } = props;
    const classes = useDrawerStyles(props)();
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

    const renderDrawer = (
        <>
        {renderDrawerHeader}
        <Divider className={classes.divider}></Divider>
        {drawerContents && <Box className={classes.content}>{drawerContents}</Box>}
        {drawerSections && <Box className={classes.content}>{renderDrawerSections}</Box>}
        </>
    );

    const renderEncapsulatedDrawer = (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item style={{ minWidth: DRAWER_WIDTH, width: DRAWER_WIDTH}}>
                {renderDrawer}
            </Grid>
            <Grid item style={{ width: "80%" }}>
                {children}
            </Grid>
        </Grid>
    );


return (
    <React.Fragment key={toggleAnchor}>
        <AppBar position="static" elevation={0} {...navigationProps} className={className}>
            <Toolbar variant="dense" disableGutters>
                {toggleIcon &&
                    <Tooltip title={toggleHelp} aria-label={toggleHelp}>
                        <Button
                            style={toggleAnchor === "right" ? { marginLeft: "auto" } : {}}
                            color="primary"
                            variant="contained"
                            aria-label="toggle-secondary-navigation"
                            onClick={handleToggleClick}
                            startIcon={toggleIcon}
                            size="small"
                            disableElevation={true}
                        >
                            {toggleText}
                        </Button>
                   </Tooltip>}
                {navigation && navigation}
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
            {encapsulated ? renderEncapsulatedDrawer : renderDrawer}
            
        </Drawer>

        {!encapsulated && children}
    </React.Fragment>
);
};
