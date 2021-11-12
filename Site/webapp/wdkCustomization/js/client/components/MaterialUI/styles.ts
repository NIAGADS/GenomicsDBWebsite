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
            fontSize: "12px",
        },
        withTooltip: {
            borderBottom: "1px dashed",
            borderBottomColor: theme.palette.secondary.dark,
        },
     
    })
);
