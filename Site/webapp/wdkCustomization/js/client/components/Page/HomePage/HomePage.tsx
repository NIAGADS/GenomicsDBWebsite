import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "wdk-client/Core/State/Types";

import { ThemeProvider } from "@material-ui/styles";
import { theme } from "../../MaterialUI";

import Grid from "@material-ui/core/Grid";

import { SearchPanel } from "./Panels";

import "./HomePage.scss";

export const HomePage: React.FC<any> = ({}) => {
    const endpoint = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);

    return (
        <ThemeProvider theme={theme}>
            <Grid container direction="column" justifyContent="center" alignItems="center">
                <SearchPanel webAppUrl={webAppUrl} />

            </Grid>
        </ThemeProvider>
    );
};
