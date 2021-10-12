import React from "react";

import Grid from "@material-ui/core/Grid";
import DownArrow from "@material-ui/icons/ArrowDropDown";

import { PanelProps } from ".";

export const PrimaryBackgroundPanel: React.FC<PanelProps> = ({ classes, children }) => {
    return (
        <Grid item container direction="row" justifyContent="center" className={classes.primaryBackground}>
            {children}
            <Grid direction="row" container item xs={12} justify="center" spacing={8}>
                <DownArrow className={`${classes.secondaryText} ${classes.largeIcon}`} />
            </Grid>
        </Grid>
    );
};
