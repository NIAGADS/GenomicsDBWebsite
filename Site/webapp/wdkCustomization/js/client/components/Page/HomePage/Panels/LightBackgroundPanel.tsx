import React from "react";

import Grid from "@material-ui/core/Grid";
import { PanelProps } from ".";
import { DownArrowRow } from "../../../MaterialUI";

export const LightBackgroundPanel: React.FC<PanelProps> = ({ classes, children, hasBaseArrow=false }) => { 
    return (
        <Grid item container justifyContent="center" className={`${classes.lightBackground} ${classes.defaultBackgroundPanel}`} xs={12}>
            {children}
            {hasBaseArrow && <DownArrowRow color="primary" />}
        </Grid>
    );
};
