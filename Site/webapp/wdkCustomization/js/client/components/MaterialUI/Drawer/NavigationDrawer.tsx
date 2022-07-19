import React, { useState } from "react";
import clsx from "clsx";

import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";


import { withHtmlTooltip, DrawerProps, DrawerContentsProps } from "@components/MaterialUI";

const useDrawerStyles = makeStyles((theme: Theme) =>
    createStyles({
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
         
        },
        fullWidth: {
            width: "auto",
        }
        
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
    children,
}) => {
    const classes = useDrawerStyles();
    const [open, setOpen] = useState(false);

    const handleToggleClick = () => {
        setOpen(!open);
    };

    const onDrawerClose = () => {
        setOpen(false);
    };

    const drawerClasses = useDrawerStyles();
    return (
        <div>
            <React.Fragment key={toggleAnchor}>
                
                <AppBar position="static" elevation={0} {...navigationProps}>
                    <Toolbar /*style={{ display: "flex" }} */ variant="dense">
                        {toggleIcon &&
                            withHtmlTooltip(
                                <IconButton
                                    className={drawerClasses.button}
                                    style={toggleAnchor === "right" ? { marginLeft: "auto" } : {}}
                                    color="inherit"
                                    aria-label="open-close-submenu"
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
                    anchor={toggleAnchor}
                    open={open}
                    className={clsx("", {
                        [classes.fullWidth]: toggleAnchor === 'top' || toggleAnchor === 'bottom',
                      })}
                    variant="temporary"
                    onBackdropClick={onDrawerClose}
                    onEscapeKeyDown={onDrawerClose}
                    {...drawerProps}
                >        
                    {drawerHeaderContents}
                    <Divider></Divider>
                    {drawerContents}
                </Drawer>
                {children}
            </React.Fragment>
        </div>
    );
};
