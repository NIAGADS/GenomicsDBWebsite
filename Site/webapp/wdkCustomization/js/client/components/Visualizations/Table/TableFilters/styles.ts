import { makeStyles, createStyles, Theme, alpha } from "@material-ui/core";
import { green, blue } from "@material-ui/core/colors";

export const useFilterStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
        },
        limitedWidthPaper: {
            width: 400,
        },
        select: {
            width: 230,
            marginTop: theme.spacing(1),
        },
        checkBox: {
            padding: 4
        },
        selectListbox: {
            fontSize: "12px"
        },
        formControl: {
            border: "2px solid lightgray",
            borderRadius: "8px",
            padding: theme.spacing(2)
          
        },
        infoChip: {
            backgroundColor: blue[200],
            color: theme.palette.getContrastText(blue[200])
        },
        formControlLabel: {
            fontSize: "12px",
            minWidth: 180
        },
        formLabel: {
            fontWeight: "bold",
            fontSize: "14px",
            paddingBottom: theme.spacing(1),
            color: "inherit"
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
        pieChartContainer: {
            width: 250,
            height: 130,
        },
    })
);

export const useGlobalFilterStyles = makeStyles((theme: Theme) =>
    createStyles({
        search: {
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.grey[100]}`,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(1),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                width: "12ch",
                "&:focus": {
                    width: "20ch",
                },
            },
        },
    })
);

export const useFilterPanelStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            //maxHeight: 1000,
            //overflowY: "scroll"
            //width: "100%"
            //borderRight: `3px solid  ${theme.palette.primary.dark}`,
        },
        filterGroup: {
            //padding: theme.spacing(1),
        },
        collapsibleFilterGroup: {
            //padding: theme.spacing(1),
        },
        collapsiblePanelFilterGroupPanel: {
            width: theme.breakpoints.values.md * .80,
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
        header: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.getContrastText(theme.palette.primary.light),
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
        filterCell: {},
        hidden: {
            display: "none",
        },
    })
);
