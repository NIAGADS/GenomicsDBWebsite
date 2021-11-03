/** Navigation panel for record page */
import React from "react";

import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";

import { PersistentDrawerLeft, DrawerState, HtmlTooltip, DrawerProps } from "../../../MaterialUI";

/* import PropTypes from 'prop-types';
import { includes, memoize, throttle } from 'lodash';

import CategoriesCheckboxTree from 'wdk-client/Components/CheckboxTree/CategoriesCheckboxTree';
import { getId, getTargetType, isIndividual } from 'wdk-client/Utils/CategoryUtils';
import { Seq } from 'wdk-client/Utils/IterableUtils';
import { preorderSeq, pruneDescendantNodes } from 'wdk-client/Utils/TreeUtils';
import RecordNavigationItem from 'wdk-client/Views/Records/RecordNavigation/RecordNavigationItem';
import { constant } from 'wdk-client/Utils/Json'; */

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerContents: {
            padding: theme.spacing(1)
        },
        menuButton: {
            //marginRight: 36,
            borderRadius: "10%",
            color: "white", 
            fontSize: "2rem",    
            padding: "8px",
            background: "rgba(0, 0, 0, 0.19) none repeat scroll 0% 0%",
            "&:hover": {
                background: "rgba(0, 0, 0, 0.5) none repeat scroll 0% 0% !important"
            }
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
          zIndex: 1
        }
    })
);

export const RecordNavigationButton: React.FC<DrawerState> = ({ isOpen, handleOpen }) => {
    const classes = useStyles();
    return (
        <Toolbar disableGutters={true} className={classes.menu}>
            <HtmlTooltip
                arrow
                title={
                    <React.Fragment>
                        <Typography color="inherit" variant="caption">Show table of contents panel</Typography>
                    </React.Fragment>
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
            </HtmlTooltip>
        </Toolbar>
    );
};

export const RecordNavigationSection: React.FC<DrawerProps & DrawerState> = ({ children, isOpen, handleClose }) => {
    const classes = useStyles();
    return (
        <PersistentDrawerLeft isOpen={isOpen} handleClose={handleClose} title="Contents">
            <Box className={classes.drawerContents}>
                {children}
            </Box>
        </PersistentDrawerLeft>
    );
};
