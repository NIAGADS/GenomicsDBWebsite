import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "wdk-client/Core/State/Types";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import { SearchPanel, AvailableDataPanel, StatsPanel, AboutPanel } from "./Panels";
import useHomePageStyles from "./styles"
import { Loading } from 'wdk-client/Components'

import "./HomePage.scss";


export const HomePage: React.FC<any> = ({}) => {
    //const endpoint = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    //const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const classes = useHomePageStyles();
    let buildJSON = null

    return (
        <Grid container direction="column" alignItems="center">
            <SearchPanel/>
            <AvailableDataPanel  webAppUrl={webAppUrl} />
            <StatsPanel  />
            <AboutPanel webAppUrl={webAppUrl} />
            <Box pb={4}/>
        </Grid>
    );
};
