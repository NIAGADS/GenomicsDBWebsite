import React from "react";

import { Grid, Box } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { SearchPanel, PanelProps } from "../Panels";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.dark,
            paddingBottom: theme.spacing(6),
            paddingTop: theme.spacing(6),
        },
    })
);

export const WelcomePanel: React.FC<PanelProps> = ({ webAppUrl }) => {
    const classes = useStyles();
    return (
        <Grid item container direction="row" className={classes.primaryBackground}>
            <SearchPanel webAppUrl={webAppUrl} />
        </Grid>
    );
};
