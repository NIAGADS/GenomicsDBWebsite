import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const useTableStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 500
        },
        table: {
            
        },
        navigationToolbar: {
            color: theme.palette.primary.dark,
            backgroundColor: "transparent"
        },
        fullWidth: {
            width: "100%",
            overflowX: "scroll"
        },
        hide: {
            display: "none"
        },
        pagination: {
            fontFamily: "Roboto"
        },
        tableHead: {
            backgroundColor: "#edeeef" 
        },
        tableBody: {
            backgroundColor: "#fbfbfb"
        },
        tableHeadCell: {
            fontSize: theme.typography.pxToRem(14),
            padding: theme.spacing(2),
            fontFamily: "Roboto",
            borderRight: "1px solid rgba(224, 224, 224, 1)",
            "&:last-child": {
                borderRight: "none",
            },
        },
        resizeHandle: {
            position: "absolute",
            cursor: "col-resize",
            zIndex: 100,
            opacity: 0,
            borderLeft: `1px solid ${theme.palette.primary.light}`,
            borderRight: `1px solid ${theme.palette.primary.light}`,
            height: "50%",
            top: "25%",
            transition: "all linear 100ms",
            right: -2,
            width: 3,
            "&.handleActive": {
                opacity: "1",
                border: "none",
                backgroundColor: theme.palette.primary.light,
                height: "calc(100% - 4px)",
                top: "2px",
                right: -1,
                width: 1,
            },
        },
        /* tableRow: {
            color: "inherit",
            outline: 0,
            verticalAlign: "middle",
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.07)",
            },
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
            "&:last-child": {
                borderBottom: "none",
            },
            "&.rowSelected": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.07)",
                },
            },
        }, */
        tableCell: {
            fontSize: theme.typography.pxToRem(12),
            fontFamily: "Roboto",
            /*padding: 16,
            textAlign: "left",
            fontWeight: 300,
            lineHeight: 1.43,
            verticalAlign: "inherit",
            color: theme.palette.text.primary, */
            borderRight: "1px solid rgba(224, 224, 224, 1)",
            "&:last-child": {
                borderRight: "none",
            },
        },
        tableSortLabel: {
            opacity: 1.0
        }
    })
);
