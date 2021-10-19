import React from "react";

import Grid from "@material-ui/core/Grid";
import { PanelProps } from ".";
import { DownArrowRow } from "../../../MaterialUI";

export const TransparentBackgroundPanel: React.FC<PanelProps> = ({ classes, children, hasBaseArrow=false }) => { 
    return (
        <Grid item container justifyContent="center" className={classes.defaultBackgroundPanel} xs={12}>
            {children}
            {hasBaseArrow && <DownArrowRow color="primary" />}
        </Grid>
    );
};
