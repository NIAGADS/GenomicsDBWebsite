import React from "react";
import { useGoto } from "../../../../hooks";

import { Grid, Box } from "@material-ui/core";
import { fade, makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { SiteSearch, SearchResult } from "../../../Tools";

import { buildRouteFromResult, buildSummaryRoute } from "../../../../util/util";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.dark,
            paddingBottom: theme.spacing(6),
            paddingTop: theme.spacing(6),
        }
    })
);

interface SearchPanelProps {
    webAppUrl: string;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ webAppUrl }) => {
    const goto = useGoto();
    const classes = useStyles();
    return (
        <Grid item container className={classes.primaryBackground}>Hello</Grid>
     
    );
};
