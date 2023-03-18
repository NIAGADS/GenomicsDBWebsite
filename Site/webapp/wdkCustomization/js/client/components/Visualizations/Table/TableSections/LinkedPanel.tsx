import React, { useState, useCallback, useEffect, useRef } from "react";

import { LocusZoomPlot, DEFAULT_FLANK as LZ_DEFAULT_FLANK } from "@viz/LocusZoom";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bordered: {
            border: "2px solid #1f1f1f",
            padding: "20px",
            marginBottom: "10px",
        },
    })
);

interface LinkedPanelSection {
    isOpen: boolean;
    type: "LocusZoom";
    initialState: { [key: string]: any };
    className?: string;
    handleClose?: any;
    setCallback: any;
}

export const LinkedPanel: React.FC<LinkedPanelSection> = ({ isOpen, type, initialState, className, handleClose, setCallback }) => {
    const [actionTarget, setActionTarget] = useState<any>(null);
    const classes = useStyles();

    const firstUpdate = useRef(true);

    const updateActionTarget = useCallback(
        (target: any) => {
            target && setActionTarget(target);
        },
        [actionTarget]
    );

    useEffect(() => {
          // this should keep the update from running on the initial render
          if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        actionTarget && setCallback(updatePanelContents);
    }, [actionTarget]);

    const updatePanelContents = useCallback((value: any) => {
        if (value && type === "LocusZoom") {
            const [chrm, position, ...rest] = value.split(":"); // chr:pos:ref:alt
            const start = parseInt(position) - LZ_DEFAULT_FLANK;
            const end = parseInt(position) + LZ_DEFAULT_FLANK;
            actionTarget &&
                actionTarget.applyState({
                    chr: "chr" + chrm,
                    start: start,
                    end: end,
                    ldrefvar: value,
                });
        }
    }, []);

    // const classes = useStyles();
    return (
        <>
            <Collapse in={isOpen} style={{ marginTop: "20px" }} className={className ? className : null}>
                {type === "LocusZoom" && (
                    <LocusZoomPlot
                        genomeBuild={initialState.genomeBuild}
                        variant={initialState.variant}
                        track={initialState.track}
                        divId="record-table-locus-zoom"
                        population="ADSP"
                        setPlotState={updateActionTarget}
                        className={classes.bordered}
                    />
                )}
            </Collapse>
            {handleClose && (
                <Grid container alignContent="flex-end">
                    <Button
                        variant="contained"
                        endIcon={<CloseIcon />}
                        onClick={handleClose}
                    >{`Hide ${type} view`}</Button>
                </Grid>
            )}
        </>
    );
};
