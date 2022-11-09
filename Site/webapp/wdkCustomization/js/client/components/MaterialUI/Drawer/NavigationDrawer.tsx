import React, { useState } from "react";
import clsx from "clsx";

import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";

import { withHtmlTooltip, DrawerProps, DrawerContentsProps } from "@components/MaterialUI";
import Button from "@material-ui/core/Button";

const useDrawerStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            border: `1px solid ${theme.palette.grey[300]}`,
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
        content: {},
        fullWidth: {
            width: "auto",
        },
    })
);

export const NavigationDrawer: React.FC<DrawerProps> = ({
    navigation,
    navigationProps,
    drawerContents,
    drawerProps,
    drawerCloseLabel,
    drawerHeaderContents,
    toggleAnchor,
    toggleIcon,
    toggleHelp,
    toggleText,
    children,
    className
}) => {
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(false);

    const handleToggleClick = () => {
        setOpen(!open);
    };


    const drawerClasses = useDrawerStyles();
    return (
        <div>
            <React.Fragment key={toggleAnchor}>
                <AppBar position="static" elevation={0} {...navigationProps} className={className}>
                    <Toolbar /*style={{ display: "flex" }} */ variant="dense">
                        {toggleIcon &&
                            withHtmlTooltip(
                                <Button
                                    className={drawerClasses.button}
                                    style={toggleAnchor === "right" ? { marginLeft: "auto" } : {}}
                                    color="inherit"
                                    aria-label="open-close-filter-menu"
                                    onClick={handleToggleClick}
                                    endIcon={toggleIcon}>
                                    {toggleText}
                                </Button>,
                                toggleHelp
                            )}

                        {navigation}
                    </Toolbar>
                </AppBar>
                <Drawer
                    anchor={toggleAnchor}
                    open={open}
                    className={clsx("", {
                        [classes.fullWidth]: toggleAnchor === "top" || toggleAnchor === "bottom",
                    })}
                    variant="temporary"
                    onClose={(event, reason) => {if (reason === 'backdropClick' || reason === 'escapeKeyDown') {setOpen(false);}}}
                    {...drawerProps}
                >
                    <Grid container justifyContent="flex-start" alignItems="center">
                        {drawerHeaderContents}
                        <Grid item></Grid>
                        <Grid item>
                            {withHtmlTooltip(
                                <IconButton
                                    className={drawerClasses.button}
                                    color="inherit"
                                    aria-label="close-filter-menu"
                                    onClick={handleToggleClick}
                                >
                                    <CloseIcon></CloseIcon>
                                </IconButton>,
                                "Close advanced filters"
                            )}
                        </Grid>
                    </Grid>
                    <Divider></Divider>
                    {drawerContents}
                </Drawer>
                {children} {/*} && <Box className={drawerClasses.drawerHeader}>{children}</Box>}*/}
            </React.Fragment>
        </div>
    );
};
