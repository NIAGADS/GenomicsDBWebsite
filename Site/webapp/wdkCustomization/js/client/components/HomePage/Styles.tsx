import React from "react";
import {
    createStyles,
    makeStyles,
    Typography,
    TypographyProps,
    withStyles,
} from "@material-ui/core";


export const useInnerSectionStyles = makeStyles((theme) =>
createStyles({
    root: {
        maxWidth: theme.breakpoints.width("lg"),
    },
})
);


export const MainText = withStyles({
    root: {
        fontSize: 36,
        fontWeight: 600,
    },
})((props: TypographyProps) => <Typography {...props} variant="h4" color="secondary" />);


export const LargeHighlightText = withStyles((theme) => ({
    root: {
        fontSize: 42,
        fontWeight: 600,
        paddingTop: ".5px",
        paddingBottom: ".5px",
        color: theme.palette.primary.light,
    },
}))((props: TypographyProps) => <Typography {...props} variant="h4" />);