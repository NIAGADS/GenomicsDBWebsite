import React from "react";
import { useGoto } from "../../../../hooks";

import { Grid, Box, Typography } from "@material-ui/core";
import { fade, makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { SiteSearch, SearchResult } from "../../../Tools";

import { buildRouteFromResult, buildSummaryRoute } from "../../../../util/util";

import { PanelProps } from "../Panels";
import { BoldPrimaryLink } from "../../../MaterialUI";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.dark,
            paddingBottom: theme.spacing(6),
            paddingTop: theme.spacing(6),
        },
        heading: {
            color: theme.palette.secondary.main,
            fontWeight: "bold",
        },
    })
);

export const SearchPanel: React.FC<PanelProps> = ({ webAppUrl }) => {
    const goto = useGoto();
    const classes = useStyles();
    return (
        <Grid item container direction="column" alignContent="center">
            <Typography variant="h3" className={classes.heading}>
                NIAGADS
            </Typography>
            <Typography variant="h2" className={classes.heading}>
                Alzheimer's Genomics Database
            </Typography>
            <Typography color="textPrimary" variant="body1">
                An interactive knowledgebase for Alzheimer's disease (AD) genetics that provides a platform for data
                sharing, discovery, and analysis to help advance the understanding of the complex genetic underpinnings
                of AD neurodegeneration and accelerate the progress of research on AD and AD related dementias (ADRD).
            </Typography>
        </Grid>
    );
};
