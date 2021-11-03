import React from "react";
import { makeStyles, useTheme, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

export const DRAWER_WIDTH = 240;
export interface DrawerState {
    isOpen: boolean;
    handleClose?: any;
    handleOpen?: any;
}

export const useDrawerStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            marginTop: "90px"
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

export interface DrawerProps {
    children?: React.ReactNode;
}

export const PersistentDrawerLeft: React.FC<DrawerProps & DrawerState> = ({ children, isOpen, handleClose }) => {
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
            <div className={classes.drawerHeader}>
                <IconButton onClick={onDrawerClose}>
                    {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            {children}
        </Drawer>
    );
};
