import React from "react";
import {
    Grid,
    GridProps,
    withStyles,
} from "@material-ui/core";

import { useInnerSectionStyles} from '../Styles';

export const Section = (props: GridProps) => {
    const innerClasses = useInnerSectionStyles();

    return (
        <Grid container item xs={12} justify="center" classes={props.classes}>
            <Grid
                alignContent="center"
                alignItems="center"
                item
                container
                classes={innerClasses}
                direction="column"
                wrap="nowrap"
            >
                {props.children}
            </Grid>
        </Grid>
    );
};


export const WhiteBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: 'white',
        paddingBottom: theme.spacing(6),
        paddingTop: theme.spacing(6),
    },
}))(Section);

export const GreyBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[200],
        paddingBottom: theme.spacing(6),
        paddingTop: theme.spacing(6),
    },
}))(Section);

export const BlueBackgroundSection = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark,
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(12),
    },
}))(Section);

