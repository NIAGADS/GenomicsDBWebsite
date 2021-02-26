import { Box, createStyles, Typography, TypographyProps, withStyles } from "@material-ui/core";
import React from "react";

export const LightSecondaryText = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: theme.typography.fontWeightLight,
        },
    })
)(Typography);

/* dark contrast base text */

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

/* light contrast base text */

export const BaseText = (props: TypographyProps) => <Typography variant="body1" {...props} />;

export const BaseTextSmall = withStyles({
    root: {
        fontSize: "12px",
    },
})(Typography);

export const BaseTextBold = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: theme.typography.fontWeightBold,
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="body1" />);

export const Heading = withStyles((theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="h4" />);

export const Subheading = withStyles((theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="h5" />);

export const SubheadingSmall = withStyles((theme) =>
    createStyles({
        root: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="h6" />);

export const CaptionTextItalic = withStyles(() =>
    createStyles({
        root: {
            fontStyle: "italic",
        },
    })
)((props: TypographyProps) => <Typography {...props} variant="caption" />);

///badges

export const BaseBadge = withStyles((theme) =>
    createStyles({
        root: {
            fontSize: "inherit",
            color: theme.palette.primary.contrastText,
        },
    })
)(Typography);

interface BadgeProps extends TypographyProps {
    backgroundColor: string;
}

export const SmallBadge = (props: BadgeProps) => {
    const { backgroundColor, ...rest } = props;
    return (
        <Box margin={1} borderRadius="5px" padding={1} component="span" display="inline" style={{ backgroundColor }}>
            <BaseBadge variant="caption" {...rest} />
        </Box>
    );
};
