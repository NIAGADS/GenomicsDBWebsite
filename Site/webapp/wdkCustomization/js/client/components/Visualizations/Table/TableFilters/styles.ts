import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const useFilterStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
        },
        limitedWidthPaper: {
            width: 400
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    })
);


export const useFilterPanelStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        icon: {
            verticalAlign: "bottom",
            height: 20,
            width: 20,
        },
        details: {
            alignItems: "center",
        },
        column: {
            flexBasis: "33.33%",
        },
        helper: {
            borderLeft: `2px solid ${theme.palette.divider}`,
            padding: theme.spacing(1, 2),
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
                textDecoration: "underline",
            },
        },
        filtersResetButton: {
            position: "absolute",
            top: 18,
            right: 21,
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 218px)",
            "@media (max-width: 600px)": {
                gridTemplateColumns: "repeat(1, 180px)",
            },
            gridColumnGap: 24,
            gridRowGap: 24,
        },
        cell: {
            width: "100%",
            display: "inline-flex",
            flexDirection: "column",
        },
        hidden: {
            display: "none",
        },
    })
);
