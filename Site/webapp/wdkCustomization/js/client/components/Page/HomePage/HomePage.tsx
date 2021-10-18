import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "wdk-client/Core/State/Types";

import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";


import { theme } from "../../MaterialUI";
import { SearchPanel, PrimaryBackgroundPanel, DefaultBackgroundPanel, AboutPanel } from "./Panels";


import "./HomePage.scss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.main,      
        },
        defaultBackgroundPanel: {
            paddingTop: theme.spacing(6),
        },
        darkContrastText: {
            color: theme.palette.primary.contrastText,
        },
        lightContrastText: {
            color: theme.palette.primary.light
        },
        secondaryText: {
            color: theme.palette.secondary.main,
        },
        bold: {
            fontWeight: theme.typography.fontWeightBold
        },
        primaryText: {
            color: theme.palette.primary.main,
        },
        largeIcon: {
            fontSize: 65
        },
        noTopPadding: {
            paddingTop: "0px"
        },
        extraTopPadding: {
            paddingTop: theme.spacing(6)
        },
        upperCase: {
            textTransform: "uppercase"
        },
        donutChart: {
            maxWidth: "md"
        }
    })
);


export const HomePage: React.FC<any> = ({}) => {
    const endpoint = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <Grid container direction="column" alignItems="center">
                <PrimaryBackgroundPanel classes={classes}>
                    <SearchPanel classes={classes}/>
                </PrimaryBackgroundPanel>
                <DefaultBackgroundPanel classes={classes} hasBaseArrow={true}>
                    <AboutPanel classes={classes}/>
                </DefaultBackgroundPanel>
            </Grid>
        </ThemeProvider>
    );
};
