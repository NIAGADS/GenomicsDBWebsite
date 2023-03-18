import React, { useState, useCallback, useEffect } from "react";

import { LocusZoomPlot, DEFAULT_FLANK as LZ_DEFAULT_FLANK } from "@viz/LocusZoom";

import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";

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
    updatePanelContents: any;
    togglePanel: any;
    className?: string;
}

export const LinkedPanel: React.FC<LinkedPanelSection> = ({
    type,
    initialState,
    className,
    updatePanelContents,
    togglePanel
}) => {
    const [actionTarget, setActionTarget] = useState<any>(null);
    const [isOpen, setIsOpen ] = useState<boolean>(false);
    const classes = useStyles();

    const updateActionTarget = useCallback(
        (target: any) => {
            target && setActionTarget(target);
        },
        [actionTarget]
    );


    const updateActionTargetContents = useCallback(
        (value: any) => {
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
        },
        [actionTarget]
    );

    // const classes = useStyles();
    return (
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
    );
};
