import { createStyles, Theme, Typography, TypographyProps, withStyles } from "@material-ui/core";
import React from "react";

const baseGrey = 600,
    lightGrey = 400;

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
            color: theme.palette.grey[lightGrey],
        },
    })
)((props: TypographyProps) => <Typography variant="body1" {...props} />);

/* light contrast typography */

export const LightContrastText = withStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.grey[baseGrey],
        },
    })
)((props: TypographyProps) => <Typography variant="body1" {...props} />);

export const LightContrastTextBold = withStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.grey[baseGrey],
            fontWeight: theme.typography.fontWeightBold,
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="body1" />);

export const LightContrastTextHeading = withStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.grey[baseGrey],
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="h4" />);

export const LightContrastTextSubheading = withStyles((theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            color: theme.palette.grey[baseGrey],
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="h5" />);

export const LightContrastCaptionTextStyle = (theme: Theme) =>
    createStyles({
        root: {
            color: theme.palette.grey[baseGrey],
            fontStyle: "italic",
        },
    });

export const LightContrastCaptionTextItalic = withStyles((theme) =>
    createStyles({
        root: {
            ...LightContrastCaptionTextStyle(theme).root,
            fontStyle: "italic",
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="caption" />);
