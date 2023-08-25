import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";

import { RootState } from "wdk-client/Core/State/Types";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import { SearchPanel, AvailableDataPanel, StatsPanel, AboutPanel,  TutorialPanel } from "./Panels";
import useHomePageStyles from "./styles";

import "./HomePage.scss";



 export const HomePage: React.FC<any> = ({}) => {
    //const endpoint = useSelector((state: RootState) => state.globalData?.siteConfig?.endpoint);
    const projectId = useSelector((state: RootState) => state.globalData?.config?.projectId);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);
    const classes = useHomePageStyles();
    const [project, setProject ] = useState(null);

    useEffect(() => {
        if (projectId) {
           setProject(projectId)
        }
    }, [projectId]);

    return (
        project ? <Grid container direction="column" alignItems="center">
            <SearchPanel />
            <TutorialPanel />
            <AvailableDataPanel webAppUrl={webAppUrl} projectId={project} />
            <StatsPanel projectId={project} />
            <AboutPanel webAppUrl={webAppUrl} />
            <Box pb={4} />
        </Grid>: <CircularProgress color="secondary"/> 
    );
};
