import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";


import {
    LocusZoom,
    CustomAssociationAdapter,
    CustomGeneAdapter,
    CustomRecombAdapter,
    CustomLDServerAdapter,
    standard_association_toolbar,
    standard_association_tooltip,
    standard_genes_tooltip,
    _ldColorScale,
    _ldLegend
} from "../LocusZoom";

import Grid from "@material-ui/core/Grid";

import { useDynamicWidth } from "genomics-client/hooks";
import { RootState } from "wdk-client/Core/State/Types";

import "locuszoom/dist/locuszoom.css";


export const DEFAULT_FLANK = 100000;

interface LocusZoomPlotState {
    chr?: string;
    start?: number;
    end?: number;
    ldrefvar?: string;
    build?: string;
}

interface LocusZoomPlotProps {
    chromosome?: string;
    end?: number;
    maxWidthAsRatioToBody?: number;
    population: string;
    variant: string;
    genomeBuild: string;
    divId?: string;
    start?: number;
    span?: string;
    flank?: number;
    track: string;
    setPlotState?: any
    className?: string;
}


export const LocusZoomPlot: React.FC<LocusZoomPlotProps> = ({
    chromosome,
    end,
    maxWidthAsRatioToBody,
    population,
    variant,
    divId,
    start,
    track,
    span,
    flank,
    genomeBuild,
    setPlotState,
    className
}) => {
    const [plot, setPlot] = useState<any>(null);
    //const interval: NodeJS.Timeout = useRef().current;
    const layoutRendered = useRef(false);

    const width = useDynamicWidth() * (maxWidthAsRatioToBody || 0.5);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);

    useLayoutEffect(() => {
        initializeLocusZoomPlot();
        layoutRendered.current = true;
    }, []);


    useEffect(() => {
        plot && setPlotState(plot);
    }, [plot]);

    function initializeLocusZoomState() {
        if (chromosome && start && end) {
            return {
                chr: chromosome.includes("chr") ? chromosome : "chr" + chromosome,
                start: start,
                end: end,
                ldrefvar: variant,
                population: population,
                build: genomeBuild,
            };
        }

        return initializeLocusZoomStateFromSpan(span ? span : variant, flank, variant);
    }

    const initializeLocusZoomStateFromSpan = (span: string, flank: number, variant: string) => ({
        chr: "chr" + span.split(":")[0],
        start: parseInt(span.split(":")[1]) - (flank ? flank : DEFAULT_FLANK),
        end: parseInt(span.split(":")[1]) + (flank ? flank : DEFAULT_FLANK),
        ldrefvar: variant,
        build: genomeBuild,
    });

    const initializeLocusZoomPlot = () => {
        const lzState = initializeLocusZoomState();
        const plot = _buildLocusZoomPlot(divId, lzState, track, webAppUrl + "/service/locuszoom", width, genomeBuild);
        setPlot(plot);
    };

    return (
        <Grid container alignItems="center" direction="column">
            <div id={divId ? divId : "locus-zoom"} className={className ? className : null}/>
        </Grid>
    );
};

const _buildLocusZoomPlot = (
    selector: string,
    lzState: LocusZoomPlotState,
    track: string,
    endpoint: string,
    width: number,
    genomeBuild: string
) => {
    // Register Adaptors
    LocusZoom.Adapters.add("NIAGADS_assoc", CustomAssociationAdapter, true); //override if exists
    LocusZoom.Adapters.add("NIAGADS_gene", CustomGeneAdapter, true);
    LocusZoom.Adapters.add("NIAGADS_recomb", CustomRecombAdapter, true);
    LocusZoom.Adapters.add("NIAGADS_ldserver", CustomLDServerAdapter, true);

    // set data sources
    const dataSources = new LocusZoom.DataSources();
    dataSources.add("assoc", ["NIAGADS_assoc", { url: endpoint, initial_state: lzState, track: track }]);
    dataSources.add("ld", ["NIAGADS_ldserver", { url: endpoint, initial_state: lzState }]);
    dataSources.add("gene", ["NIAGADS_gene", { url: endpoint, initial_state: lzState }]);
    dataSources.add("recomb", ["NIAGADS_recomb", { url: endpoint, initial_state: lzState }]);

    // LocusZoomshould ignore if build is GRCh38, will decide later if to host locally for GRCh37
    // see https://statgen.github.io/locuszoom/docs/api/data_adapters.js.html#line403
    dataSources.add("constraint", [
        "GeneConstraintLZ",
        { url: "https://gnomad.broadinstitute.org/api/", build: genomeBuild },
    ]);

    const layout = _buildLayout(lzState, width);

    return LocusZoom.populate(`#${selector}`, dataSources, layout);
};

const _buildLayout = (state: LocusZoomPlotState, containerWidth: number) => {
    let layout = LocusZoom.Layouts.get("plot", "standard_association", {
        state: state,
        responsive_resize: true,
        min_region_scale: 20000,
        max_region_scale: 1000000,
        toolbar: standard_association_toolbar,
        panels: [
            LocusZoom.Layouts.get("panel", "association", {
                namespace: { assoc: "assoc" },
                height: 400,
                id: "association_panel", // Give each panel a unique ID
            }),
            LocusZoom.Layouts.get("panel", "genes", {
                height: 225,
            }),
        ],
    });

    // data layer customizations
    for (const [pindex, panel] of layout.panels.entries()) {
        if (panel.id == 'association_panel') {
            for (const [dindex, dataLayer] of panel.data_layers.entries()) {
                if (dataLayer.id == 'associationpvalues') {
                    layout.panels[pindex].data_layers[dindex].legend = _ldLegend;
                    layout.panels[pindex].data_layers[dindex].tooltip = standard_association_tooltip;
                }
            }
        }
        
        if (panel.id == 'genes') {
            for (const [dindex, dataLayer] of panel.data_layers.entries()) {
                if (dataLayer.id == 'genes') {
                    layout.panels[pindex].data_layers[dindex].tooltip = standard_genes_tooltip;
                }
            }
        }
    } 

    return layout;
};


