import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";

import { ColumnAccessor } from "@viz/Table/ColumnAccessors";

const useStyles = makeStyles((theme) => ({
    endIcon: {
        margin: "0px"
    },
    button: {
        minWidth: "30px",
        padding: "0px"
    }
  }));

export const RowSelectButtonAccessor: React.SFC<ColumnAccessor> = ({ value, userProps }) => {
    const classes = useStyles();
    return (
        <Box component="span">
            <Button
                className="button"
                color="primary"
                variant="text"
                title={`${userProps.tooltip} ${value}`}
                aria-label={`${userProps.tooltip} ${value}`}
                onClick={() => userProps.action(value)}
                endIcon={<OpenInBrowserIcon className={classes.endIcon}/>}
            >
            </Button>
        </Box>
    );
};
