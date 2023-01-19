import React from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface LocusZoomSection {
    datasets: { [key: string]: string };
    isOpen: boolean;
}

export const LocusZoomPanel: React.FC<LocusZoomSection> = ({ datasets, isOpen }) => {
    const classes = useStyles();
    return <Collapse in={isOpen}><h1 className="red">TESTING</h1></Collapse>;
};
