import React from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import Theme from "./../../theme";

//base resset of wdk non-button inputs
const useBaseStyles = makeStyles((theme: typeof Theme) =>
    createStyles({
        root: {
            backgroundColor: "white!important",
            "&:hover": { backgroundColor: "white!important" },
        },
        input: {
            padding: "6px 0 7px 4px!important",
            border: "none!important",
            backgroundColor: "none!important",
            background: "none!important",
        },
    })
);

export const StandardTextField = (props: TextFieldProps) => {
    const classes = useBaseStyles();

    return (
        <TextField {...props} InputProps={{ ...props.InputProps, classes, disableUnderline: true }} variant="filled" />
    );
};
