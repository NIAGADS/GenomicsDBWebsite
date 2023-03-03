import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { cloneDeep, noop } from "lodash";

import {
    LocusZoom,
    CustomAssociationAdapter,
    CustomGeneAdapter,
    CustomRecombAdapter,
    CustomLDServerAdapter,
    standard_association_toolbar
} from "../LocusZoom";


import Grid  from "@material-ui/core/Grid";

import { selectAll } from "d3";

import { useDynamicWidth } from "genomics-client/hooks";
import { RootState } from "wdk-client/Core/State/Types";
import { Loading } from "wdk-client/Components";

import "locuszoom/dist/locuszoom.css";

const DEFAULT_FLANK = 100000;

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
    genomeBuild
}) => {
    const [loading, setLoading] = useState(false);
    const interval: NodeJS.Timeout = useRef().current;
    const layoutRendered = useRef(false);

    const width = useDynamicWidth() * (maxWidthAsRatioToBody || 0.5);
    const webAppUrl = useSelector((state: RootState) => state.globalData?.siteConfig?.webAppUrl);

    useEffect(() => {
        if (layoutRendered.current) {
            initializeLocusZoomPlot();
            return () => clearInterval(interval);
        }
        return noop;
    }, [variant, track, width, span, chromosome, start, end]);

    useLayoutEffect(() => {
        initializeLocusZoomPlot();
        layoutRendered.current = true;
    }, []);

    function initializeLocusZoomState() {
        if (chromosome && start && end) {
            return {
                chr: chromosome.includes("chr") ? chromosome : "chr" + chromosome,
                start: start,
                end: end,
                ldrefvar: variant,
                population: population,
                build: genomeBuild
            };
        }

        return initializeLocusZoomStateFromSpan(span ? span : variant, flank, variant);
    }

    const initializeLocusZoomStateFromSpan = (span: string, flank: number, variant: string) => ({
        chr: "chr" + span.split(":")[0],
        start: parseInt(span.split(":")[1]) - (flank ? flank : DEFAULT_FLANK),
        end: parseInt(span.split(":")[1]) + (flank ? flank : DEFAULT_FLANK),
        ldrefvar: variant,
        build: genomeBuild
    });

    const initializeLocusZoomPlot = () => {
        const lzState = initializeLocusZoomState();
        const plot = _buildLocusZoomPlot(divId, lzState, track, webAppUrl + "/service/locuszoom", width, genomeBuild);
        setLoading(plot.loading_data);
        startPoll(plot);
    };

    //we have to poll b/c plot is outside of react and we can't show loading indicator otherwise
    const startPoll = (val: { loading_data: boolean }) => {
        const initVal = val.loading_data,
            interval = setInterval(() => _checkVal(val), 50);
        const _checkVal = (val: { loading_data: boolean }) => {
            if (val.loading_data != initVal) {
                setLoading(val.loading_data);
                clearInterval(interval);
                startPoll(val);
            }
        };
    };

    selectAll(".lz-data_layer-scatter").on("click", function (d: any) {
        //d.getPlot().panels.association_panel.x_scale(d.position) will give x coordinate
        //leaving this in b/c we can use it to create our own tooltip if we want to keep setNewRef behavior
    });

    return (
        <Grid container alignItems="center" direction="column">
            {loading && <Loading />}
            <div id={divId ? divId : "locus-zoom"} />
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
    dataSources.add("assoc", ['NIAGADS_assoc', { url: endpoint, initial_state: lzState, track: track }]);
    dataSources.add("ld", ['NIAGADS_ldserver', { url: endpoint, initial_state: lzState }]);
    dataSources.add("gene", ['NIAGADS_gene', { url: endpoint, initial_state: lzState }]);
    dataSources.add("recomb", ['NIAGADS_recomb', { url: endpoint, initial_state: lzState }]);

    // LocusZoomshould ignore if build is GRCh38, will decide later if to host locally for GRCh37
    // see https://statgen.github.io/locuszoom/docs/api/data_adapters.js.html#line403
    dataSources.add("constraint", ['GeneConstraintLZ', { url: 'https://gnomad.broadinstitute.org/api/', build: genomeBuild }]);

    const layout = _buildLayout(lzState, width);

    return LocusZoom.populate(`#${selector}`, dataSources, layout);
};

const _buildLayout = (state: LocusZoomPlotState, containerWidth: number) => {
    // TODO: debug statements to help design layout
    // remove when complete
    console.log("Locus Zoom panels, toolbar_widgets, toolbars, tooltips, plot types");
    console.log(LocusZoom.Layouts.list('panel'));
    console.log(LocusZoom.Layouts.list('toolbar_widgets'));
    console.log(LocusZoom.Layouts.list('toolbar'));
    console.log(LocusZoom.Layouts.list('tooltip'));
    console.log(LocusZoom.Layouts.list('plot'));

    // TODO: modify lz pop toolbar widget 
    // see https://github.com/statgen/locuszoom/blob/a271a0321339fb223721476244ece2fa7dec9820/esm/layouts/index.js#L671

    return LocusZoom.Layouts.get("plot", "standard_association", {
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
            LocusZoom.Layouts.get('panel', 'genes', {
                height: 225
            })
        ],
    });
};


