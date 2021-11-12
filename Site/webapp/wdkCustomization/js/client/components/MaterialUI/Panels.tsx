import React from "react";

import Grid, { GridItemsAlignment } from "@material-ui/core/Grid";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import { lighten } from "@material-ui/core/styles";
import { DownArrowRow } from "@components/MaterialUI";

export interface PanelProps {
    webAppUrl?: string;    
    children?: React.ReactNode
    hasBaseArrow?: boolean
    background?: string;
    classes?: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.main,
        },
        lightBackground: {
            background: lighten(theme.palette.primary.main, 0.95),
        },
        defaultBackgroundPanel: {
            background: "white"
            //paddingTop: theme.spacing(6),
        }
    })
);

interface Custom { className: string, alignItems?: GridItemsAlignment };
export const CustomPanel: React.FC<PanelProps & Custom> = ({ className, children, hasBaseArrow=false }) => { 
    return (
        <Grid item container justifyContent="center" className={className} xs={12}>
            {children}
            {hasBaseArrow && <DownArrowRow color="primary" />}
        </Grid>
    );
};

export const DefaultBackgroundPanel: React.FC<PanelProps> = ({ classes, children, hasBaseArrow=false }) => { 
    let clx = classes ? classes : useStyles();
    return (
        <Grid item container justifyContent="center" className={clx.defaultBackgroundPanel} xs={12}>
            {children}
            {hasBaseArrow && <DownArrowRow color="primary" />}
        </Grid>
    );
};

export const LightBackgroundPanel: React.FC<PanelProps> = ({ classes, children, hasBaseArrow=false }) => { 
    let clx = classes ? classes : useStyles();
    return (
        <Grid item container justifyContent="center" className={`${clx.lightBackground} ${clx.defaultBackgroundPanel}`} xs={12}>
            {children}
            {hasBaseArrow && <DownArrowRow color="primary" />}
        </Grid>
    );
};

export const PrimaryBackgroundPanel: React.FC<PanelProps> = ({ classes, children, hasBaseArrow = true }) => {
    let clx = classes ? classes : useStyles();
    return (
        <Grid item container justifyContent="center" xs={12} className={`${clx.primaryBackground} ${clx.defaultBackgroundPanel}`}>
            {children}
            {hasBaseArrow && <DownArrowRow />}
        </Grid>
    );
};
