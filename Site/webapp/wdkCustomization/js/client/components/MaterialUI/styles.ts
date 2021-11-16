import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const useTypographyStyles = makeStyles((theme: Theme) =>
    createStyles({
        pass: {
            color: "red",
        },
        fail: {
            color: theme.palette.primary.main,
        },
        small: {
            fontSize: "14px",
        },
        withTooltip: {
            borderBottom: "1px dashed",
            borderBottomColor: theme.palette.secondary.dark,
        },
    })
);

export const useLayoutStyles = makeStyles((theme: Theme) =>
    createStyles({
        noPadding: { padding: 0 },
    })
);
