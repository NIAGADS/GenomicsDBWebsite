import React from "react";

import Grid from "@material-ui/core/Grid";
import { PanelProps } from ".";
import { DownArrowRow } from "../../../MaterialUI";

export const PrimaryBackgroundPanel: React.FC<PanelProps> = ({ classes, children, hasBaseArrow = true }) => {
    return (
        <Grid item container direction="row" justifyContent="center" className={`${classes.primaryBackground} ${classes.defaultBackgroundPanel}`}>
            {children}
            {hasBaseArrow && <DownArrowRow />}
        </Grid>
    );
};
