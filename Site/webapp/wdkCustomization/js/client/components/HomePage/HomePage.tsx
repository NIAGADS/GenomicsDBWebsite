import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import { useGoto } from "../../hooks";

import { Grid, makeStyles, createStyles, Theme } from "@material-ui/core";

import {
    HighlightStatsSection,
    DatasetReleasesSection,
    SearchSection,
    FeaturesSection,
    AboutSection,
} from "./Sections";

interface HomePage {
    webAppUrl: string;
    endpoint: string;
}

export const usePanelStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.main,
            paddingBottom: theme.spacing(6),
            paddingTop: theme.spacing(6),
        },
        darkContrastText: {
            color: theme.palette.primary.contrastText,
        },
        headingSecondary: {
            color: theme.palette.secondary.main,
            fontWeight: "bold",
        },
        headingPrimary: {
            color: theme.palette.primary.main,
        },
    })
);

const HomePage: React.FC<HomePage> = ({ endpoint, webAppUrl }) => {
    const goto = useGoto();

    useLayoutEffect(() => {
        //remove the padding that's required everywhere but here
        document.querySelectorAll(".wdk-PageContent")[0].setAttribute("style", "padding: 0;");
        return () => document.querySelectorAll(".wdk-PageContent")[0].setAttribute("style", "padding: 0 2em;");
    }, []);

    return (
        <Grid justify="center" container>
            {/* header */}
            <SearchSection webAppUrl={webAppUrl} />
            <FeaturesSection webAppUrl={webAppUrl} endpoint={endpoint} />
            <HighlightStatsSection />
            <DatasetReleasesSection />
            <AboutSection webAppUrl={webAppUrl} />
        </Grid>
    );
};

export default connect((state: any) => ({
    webAppUrl: state.globalData.siteConfig.webAppUrl,
    endpoint: state.globalData.siteConfig.endpoint,
}))(HomePage);
