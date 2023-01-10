import { makeStyles, createStyles, Theme } from "@material-ui/core";

export const useHeadingStyles = makeStyles((theme: Theme) =>
    createStyles({
        panel: {
            background: "transparent",
            position: "relative",
            top: "10px",
            paddingLeft: "50px",
        },
    })
);
