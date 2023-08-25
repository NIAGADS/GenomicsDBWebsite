import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { lighten } from "@material-ui/core/styles";

export const useTypographyStyles = makeStyles((theme: Theme) =>
    createStyles({
        largeBody: {
            fontSize: "1.2rem",
        },
    })
);

export const useCardStyles = makeStyles((theme:Theme) => 
    createStyles({
        card: {
            width: "300px"
        },
        label: {
            height: "80px"
        },
        media: {
            height: "250px"
        }
    })
);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBackground: {
            background: theme.palette.primary.main,
        },
        lightBackground: {
            background: lighten(theme.palette.primary.main, 0.95),
        },
        defaultBackgroundPanel: {
            paddingTop: theme.spacing(6),
        },
        darkContrastText: {
            color: theme.palette.primary.contrastText,
        },
        lightContrastText: {
            color: theme.palette.primary.light,
        },
        secondaryText: {
            color: theme.palette.secondary.main,
        },
        bold: {
            fontWeight: theme.typography.fontWeightBold,
        },
        primaryText: {
            color: theme.palette.primary.main,
        },
        largeIcon: {
            fontSize: 65,
        },
        largeButton: {
            fontSize: "1.1rem",
        },
        noTopPadding: {
            paddingTop: "0px",
        },
        extraTopPadding: {
            paddingTop: theme.spacing(6),
        },
        highlightStat: {
            fontSize: "2rem",
        },
        donutChart: {
            maxWidth: 900,
            /*[theme.breakpoints.down("sm")]: {
                maxHeight: 300,
                maxWidth: 500,
            },*/
        },
        smallCaps: {
            fontVariant: "all-small-caps",
        },
        secondaryLink: {
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
        inset: {
            marginLeft: "auto",
            marginRight: "auto",
            width: "75%",
            color: theme.palette.primary.light
        }
      
    })
);

export default useStyles;
