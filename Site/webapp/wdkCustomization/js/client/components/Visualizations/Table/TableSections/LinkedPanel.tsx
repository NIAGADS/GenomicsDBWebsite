import React from "react";
// import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";

// const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface LinkedPanelSection {
    isOpen: boolean;
    children: React.ReactNode
}

export const LinkedPanel: React.FC<LinkedPanelSection> = ({ isOpen, children }) => {
    // const classes = useStyles();
    return (

            <Collapse in={isOpen} style={{marginTop: "20px"}}>
                {children}
            </Collapse>
    );
};
