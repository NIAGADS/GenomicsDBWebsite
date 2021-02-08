import { createStyles, lighten, Typography, TypographyProps, withStyles } from "@material-ui/core";
import React from "react";

export const LightSecondaryText = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: theme.typography.fontWeightLight,
        },
    })
)(Typography);

/* dark contrast typography */

export const DarkContrastText = withStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.primary.contrastText,
        },
    })
)((props: TypographyProps) => <Typography variant="body1" {...props} />);

export const DarkContrastGreyText = withStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.grey[400],
        },
    })
)((props: TypographyProps) => <Typography variant="body1" {...props} />);

/* light contrast typography */

export const LightContrastText = (props: TypographyProps) => <Typography variant="body1" {...props} />;

export const LightContrastTextBold = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: theme.typography.fontWeightBold,
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="body1" />);

export const LightContrastTextHeading = withStyles((theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(4),
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="h4" />);

export const LightContrastTextSubheading = withStyles((theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="h5" />);

export const LightContrastCaptionTextItalic = withStyles(() =>
    createStyles({
        root: {
            fontStyle: "italic",
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="caption" />);
