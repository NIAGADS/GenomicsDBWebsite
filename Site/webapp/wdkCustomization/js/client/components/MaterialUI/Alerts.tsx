import React from "react";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import BuildIcon from "@material-ui/icons/Build";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    alert: {
      fontSize: "12px",
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1)
    },
    alertTitle: {
        fontWeight: "bold",
        fontSize: "14px"
    }
  }));


export const InfoAlert: React.SFC<{ title: string, message: string, className?:string }> = ({ title, message, className }) => {
  const classes = useStyles();

  return (
      <Alert severity="info" className={className ? `${className} ${classes.alert}`  : classes.alert}>
          <AlertTitle className={classes.alertTitle}>{title}</AlertTitle>
          {message}
      </Alert>
  );
};

export const ComingSoonAlert: React.SFC<{ message: string }> = ({ message }) => {
  const classes = useStyles();
  return (
      <Alert icon={<BuildIcon fontSize="inherit"/>} severity="warning" className={classes.alert}>
          <AlertTitle className={classes.alertTitle}>Coming Soon</AlertTitle>
          {message}
      </Alert>
  );
};
