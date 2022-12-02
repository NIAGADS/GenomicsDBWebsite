import React from "react";
import { InfoAlert } from "@components/MaterialUI"

import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
    alert: {
        maxWidth: 321 // no idea but its what looks right
    },
  }));

export const ZeroFilterChoicesMsg: React.SFC<{ label: string }> = ({ label }) => {
    const classes = useStyles();
    return (
        <InfoAlert title={label} className={classes.alert} message="No choices (or only NAs) available with selected filters." />    
    );
};
