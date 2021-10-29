import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "wdk-client/Core/State/Types";

import { ThemeProvider, lighten } from "@material-ui/core/styles";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";

import { theme } from "../../MaterialUI";
import { SearchPanel, PrimaryBackgroundPanel, DefaultBackgroundPanel, AvailableDataPanel, StatsPanel, AboutPanel } from "./Panels";

import "./HomePage.scss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.main,
        },
        lightBackground: {
            background: lighten(theme.palette.primary.main, 0.95)
        },
        defaultBackgroundPanel: {
            paddingTop: theme.spacing(6),
        },
        darkContrastText: {
            color: theme.palette.primary.contrastText,
        },
        lightContrastText: {
            color: theme.palette.primary.light,
        },
        secondaryText: {
            color: theme.palette.secondary.main,
        },
        bold: {
            fontWeight: theme.typography.fontWeightBold,
        },
        primaryText: {
            color: theme.palette.primary.main,
        },
        largeIcon: {
            fontSize: 65,
        },
        largeButton: {
            fontSize: "1.1rem",
        },
        noTopPadding: {
            paddingTop: "0px",
        },
        extraTopPadding: {
            paddingTop: theme.spacing(6),
        },
        highlightStat: {
            fontSize: "2rem",
        },
        donutChart: {
            maxWidth: 900,
           /*[theme.breakpoints.down("sm")]: {
                maxHeight: 300,
                maxWidth: 500,
            },*/
        },
        smallCaps: {
            fontVariant: "all-small-caps",
        },
        darkBgLink: {
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
        lightBgLink: {
            color: theme.palette.secondary.dark,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
    })
);

export const HomePage: React.FC<any> = ({}) => {
    //const endpoint = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    //const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <Grid container direction="column" alignItems="center">
                <SearchPanel classes={classes} />
                <AvailableDataPanel classes={classes} webAppUrl={webAppUrl} />
                <StatsPanel classes={classes} />
                <AboutPanel classes={classes} webAppUrl={webAppUrl}/>
            </Grid>
        </ThemeProvider>
    );
};
