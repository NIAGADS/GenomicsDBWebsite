import React from "react";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    alert: {
      fontSize: "12px",
      marginBottom: theme.spacing(1)
    },
    alertTitle: {
        fontWeight: "bold",
        fontSize: "14px"
    }
  }));


export const InfoAlert: React.SFC<{ title: string, message: string }> = ({ title, message }) => {
  const classes = useStyles();
  return (
      <Alert severity="info" className={classes.alert}>
          <AlertTitle className={classes.alertTitle}>{title}</AlertTitle>
          {message}
      </Alert>
  );
};
