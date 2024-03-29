import React from "react";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";

import { DrawerProps } from "@components/MaterialUI";
import { Box } from "@material-ui/core";


export const DRAWER_WIDTH = 300;
export const SHIFT_X = 250;
export interface DrawerState {
    isOpen: boolean;
    handleClose?: any;
    handleOpen?: any;
}

export const contentStyles = (theme: Theme) => ({
    content: {
        flexGrow: 1,
        paddingTop: theme.spacing(1) ,
        //paddingLeft: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: SHIFT_X,
    },
});

const useDrawerStyles = makeStyles((theme: Theme) =>
    createStyles({
        actionButton: {
            marginTop: theme.spacing(1),
            justifyContent: "right",
        },
        divider: {
            marginTop: theme.spacing(1)
        },
        children: {
            marginTop: 100,
        },
        drawer: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
        drawerPaper: {
            width: DRAWER_WIDTH,
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: "flex-end",
            marginTop: "90px",
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -DRAWER_WIDTH,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    })
);

export const PersistentDrawerLeft: React.FC<DrawerProps & DrawerState> = ({ title, children, isOpen, handleClose }) => {
    const classes = useDrawerStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(isOpen);

    const onDrawerOpen = () => {
        setOpen(true);
    };

    const onDrawerClose = () => {
        setOpen(false);
        handleClose();
    };

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={isOpen}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Box className={classes.children}>{children}</Box>
            <Divider className={classes.divider}/>
            <Button
                variant="text"
                color="primary"
                endIcon={<ChevronLeftIcon />}
                onClick={onDrawerClose}
                fullWidth={true}
                size="small"
                className={classes.actionButton}
            >
                {title ? title : "Hide"}
            </Button>
        </Drawer>
    );
};
