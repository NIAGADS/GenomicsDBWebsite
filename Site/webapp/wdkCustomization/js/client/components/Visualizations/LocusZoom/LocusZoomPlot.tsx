import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
    LocusZoom,
    CustomAssociationAdapter,
    CustomGeneAdapter,
    CustomRecombAdapter,
    CustomLDServerAdapter
} from "../LocusZoom";

import { cloneDeep, get, noop } from "lodash";
import { Grid } from "@material-ui/core";

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
}


interface LocusZoomPlotProps {
    chromosome?: string;
    end?: number;
    maxWidthAsRatioToBody?: number;
    population: string;
    variant: string;
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
                population: population
            };
        }

        return initializeLocusZoomStateFromSpan(span ? span : variant, flank, variant);
    }

    const initializeLocusZoomStateFromSpan = (span: string, flank:number, variant: string) => ({
        chr: "chr" + span.split(":")[0],
        start: parseInt(span.split(":")[1]) - (flank ? flank : DEFAULT_FLANK),
        end: parseInt(span.split(":")[1]) + (flank ? flank : DEFAULT_FLANK),
        ldrefvar: variant,
    });

    const buildLocusZoomPlot = () => {
      
    }

    const initializeLocusZoomPlot = () => {
        const lzState = initializeLocusZoomState();
        const plot = _buildLocusZoomPlot(divId, lzState, track, webAppUrl + "/service/locuszoom", width);
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
    width: number
) => {
    // Register Adaptors
    LocusZoom.Adapters.add("NIAGADS_assoc", CustomAssociationAdapter, true); //override if exists
    LocusZoom.Adapters.add("NIAGADS_gene", CustomGeneAdapter, true);
    LocusZoom.Adapters.add("NIAGADS_recomb", CustomRecombAdapter, true);
    LocusZoom.Adapters.add("NIAGADS_ldserver", CustomLDServerAdapter, true);

    // set data sources
    const dataSources = new LocusZoom.DataSources();
    dataSources.add("assoc", ['NIAGADS_assoc', {url: endpoint, initial_state: lzState, track: track}]);
    dataSources.add("ld", ['NIAGADS_ldserver', {url: endpoint, initial_state: lzState}]);
    dataSources.add("gene", ['NIAGADS_gene', {url: endpoint, initial_state: lzState}]);
    dataSources.add("recomb", ['NIAGADS_recomb', {url: endpoint, initial_state: lzState}]);

    const layout = _buildLayout(lzState, width);

    return LocusZoom.populate(`#${selector}`, dataSources, layout);
};

const _buildLayout = (state: LocusZoomPlotState, containerWidth: number) => {
    return LocusZoom.Layouts.get("plot", "standard_association", {
        state: state,
        // Override select fields of a pre-made layout
        responsive_resize: true,
        panels: [
            LocusZoom.Layouts.get("panel", "association", {
                namespace: { assoc: "assoc" },
                height: 400,
                id: "association_panel", // Give each panel a unique ID
            }),
            // Even though genes are part of the original "standard association plot" layout, overriding the panels array means replacing *all* of the panels.
            //LocusZoom.Layouts.get('panel', 'genes', { height: 400 })
            //genesPanel,
        ],
    });
};

/*
const _buildLayout = (state: LocusZoomState, containerWidth: number) => {
    return LocusZoom.Layouts.merge(
        { state },
        {
            id: "association_layout",
            width: containerWidth,
            height: 225,
            min_width: 400,
            min_height: 200,
            proportional_width: 1,
            inner_border: "rgb(210, 210, 210)",
            panels: [
                {
                    id: "association_panel",
                    legend: {
                        orientation: "vertical",
                        origin: { x: 55, y: 40 },
                        hidden: true,
                    },
                    axes: {
                        x: {
                            label: "{{assoc:chromosome}} (Mb)",
                            label_offset: 32,
                            tick_format: "region",
                            extent: "ld:state",
                        },
                        y1: {
                            label: "neg log10(p-value)",
                            label_offset: 32,
                        },
                        y2: {
                            label: "Recombination Rate (cM/Mb)",
                            label_offset: 40,
                        },
                    },
                    margin: { top: 35, right: 50, bottom: 50, left: 50 },
                    interaction: {
                        drag_background_to_pan: true,
                        scroll_to_zoom: true,
                        x_linked: true,
                    },
                    data_layers: [significanceLayer, associationLayer, recombRateLayer],
                    toolbar: (function () {
                        const base = getStandardAssociationToolbar();
                        base.widgets.push({
                            type: "toggle_legend",
                            position: "right",
                        });
                        return base;
                    })(),
                },
                genesPanel,
            ],
        }
    );
};
*/

const standardPanelToolbar = {
    widgets: [
        {
            type: "remove_panel",
            position: "right",
            color: "red",
            group_position: "end",
        },
        {
            type: "move_panel_up",
            position: "right",
            group_position: "middle",
        },
        {
            type: "move_panel_down",
            position: "right",
            group_position: "start",
            style: { "margin-left": "0.75em" },
        },
    ],
};

const recombRateLayer = {
    id: "recomb",
    type: "line",
    fields: ["recomb:position", "recomb:recomb_rate"],
    z_index: 1,
    style: {
        stroke: "#0000FF",
        "stroke-width": "1.5px",
    },
    x_axis: {
        field: "recomb:position",
    },
    y_axis: {
        axis: 2,
        field: "recomb:recomb_rate",
        floor: 0,
        ceiling: 100,
    },
};

const standardsGeneTooltip = {
    closable: true,
    show: { or: ["highlighted", "selected"] },
    hide: { and: ["unhighlighted", "unselected"] },
    html:
        "<h4><strong><i>{{gene_name|htmlescape}}</i></strong></h4>" +
        'Gene: <a href="../gene/{{gene_id|htmlescape}}" target="_blank" rel="noopener">{{gene_id|htmlescape}}</a><br>' +
        "Transcript ID: <strong>{{transcript_id|htmlescape}}</strong><br>",
};

/* custom gene panel needed to bypass "gnomad_constraint" datasource */
const genesLayer = {
    id: "genes",
    id_field: "gene_id",
    type: "genes",
    fields: ["genes:all"],
    behaviors: {
        onmouseover: [{ action: "set", status: "highlighted" }],
        onmouseout: [{ action: "unset", status: "highlighted" }],
        onclick: [{ action: "toggle", status: "selected", exclusive: true }],
    },
    tooltip: cloneDeep(standardsGeneTooltip),
};

const genesPanel = {
    id: "genes",
    min_height: 150,
    height: 225,
    margin: { top: 20, right: 50, bottom: 20, left: 50 },
    axes: {},
    interaction: {
        drag_background_to_pan: true,
        scroll_to_zoom: true,
        x_linked: true,
    },
    toolbar: (function () {
        const base = cloneDeep(standardPanelToolbar) as any;
        base.widgets.push({
            type: "resize_to_data",
            position: "right",
            button_html: "Resize",
        });
        //base.widgets.push(cloneDeep(geneSelectorMenu));
        return base;
    })(),
    data_layers: [cloneDeep(genesLayer)],
};

const LZ_SIG_THRESHOLD_LOGP = 7.301; // -log10(.05/1e6)

const significanceLayer = {
    id: "significance",
    type: "orthogonal_line",
    orientation: "horizontal",
    offset: LZ_SIG_THRESHOLD_LOGP,
};

const associationLayer = {
    id: "association_pvalues",
    id_field: "assoc:id",
    type: "scatter",
    point_shape: {
        scale_function: "if",
        field: "ld:isrefvar",
        parameters: {
            field_value: 1,
            then: "diamond",
            else: "circle",
        },
    },
    legend: [
        {
            shape: "diamond",
            color: "#9632b8",
            size: 40,
            label: "LD Ref Var",
            class: "lz-data_layer-scatter",
        },
        {
            shape: "circle",
            color: "#d43f3a",
            size: 40,
            label: "1.0 > r² ≥ 0.8",
            class: "lz-data_layer-scatter",
        },
        {
            shape: "circle",
            color: "#eea236",
            size: 40,
            label: "0.8 > r² ≥ 0.6",
            class: "lz-data_layer-scatter",
        },
        {
            shape: "circle",
            color: "#5cb85c",
            size: 40,
            label: "0.6 > r² ≥ 0.4",
            class: "lz-data_layer-scatter",
        },
        {
            shape: "circle",
            color: "#46b8da",
            size: 40,
            label: "0.4 > r² ≥ 0.2",
            class: "lz-data_layer-scatter",
        },
        {
            shape: "circle",
            color: "#B8B8B8",
            size: 40,
            label: "r² < 0.2 or no data",
            class: "lz-data_layer-scatter",
        },
    ],
    point_size: {
        scale_function: "if",
        field: "ld:isrefvar",
        parameters: {
            field_value: 1,
            then: 80,
            else: 40,
        },
    },
    color: [
        {
            scale_function: "if",
            field: "ld:isrefvar",
            parameters: {
                field_value: 1,
                then: "#9632b8",
            },
        },
        {
            scale_function: "numerical_bin",
            field: "ld:state",
            parameters: {
                breaks: [0, 0.2, 0.4, 0.6, 0.8],
                values: ["#357ebd", "#46b8da", "#5cb85c", "#eea236", "#d43f3a"],
            },
        },
        "#B8B8B8",
    ],
    fields: [
        "assoc:id",
        "assoc:position",
        "assoc:pvalue",
        "assoc:testAllele",
        "assoc:neg_log10_pvalue",
        "ld:state",
        "ld:isrefvar",
    ],
    z_index: 2,
    x_axis: { field: "assoc:position" },
    y_axis: {
        axis: 1,
        field: "assoc:neg_log10_pvalue",
        floor: 0,
        upper_buffer: 0.1,
        min_extent: [0, 1],
    },
    behaviors: {
        onmouseover: [{ action: "set", status: "highlighted" }],
        onmouseout: [{ action: "unset", status: "highlighted" }],
        onclick: [{ action: "toggle", status: "selected", exclusive: true }],
        onshiftclick: [{ action: "toggle", status: "selected" }],
    },

    tooltip: {
        namespace: { assoc: "assoc" },
        closable: true,
        show: { or: ["highlighted", "selected"] },
        hide: { and: ["unhighlighted", "unselected"] },
        html:
            "<strong>{{assoc:id}}</strong><br>" +
            "P Value: <strong>{{assoc:pvalue}}</strong><br>" +
            "Test Allele: <strong>{{assoc:testAllele}}</strong><br>" +
            '<a href="javascript:void(0);" onclick="LocusZoom.default.getToolTipDataLayer(this).makeLDReference(LocusZoom.default.getToolTipData(this));">Make LD Reference</a><br>',
    },
};

const getStandardAssociationToolbar = () => getRegionNavPlotToolbar();

const getStandardPlotToolbar = () => ({
    // Title and download buttons.
    widgets: [
        {
            type: "download",
            position: "right",
            group_position: "end",
        },
        {
            type: "download_png",
            position: "right",
            group_position: "start",
        },
    ] as any[],
});

const getRegionNavPlotToolbar = () => {
    // Generic region nav buttons
    const base = getStandardPlotToolbar();
    base.widgets.push(
        {
            type: "shift_region",
            step: 500000,
            button_html: ">>",
            position: "right",
            group_position: "end",
        },
        {
            type: "shift_region",
            step: 50000,
            button_html: ">",
            position: "right",
            group_position: "middle",
        },
        {
            type: "zoom_region",
            step: 0.2,
            position: "right",
            group_position: "middle",
        },
        {
            type: "zoom_region",
            step: -0.2,
            position: "right",
            group_position: "middle",
        },
        {
            type: "shift_region",
            step: -50000,
            button_html: "<",
            position: "right",
            group_position: "middle",
        },
        {
            type: "shift_region",
            step: -500000,
            button_html: "<<",
            position: "right",
            group_position: "start",
        }
    );
    return base;
};

/* LZ Layouts LocusZoom 0.14.0
{
  "tooltip": [
    "standard_association",
    "standard_association_with_label",
    "standard_genes",
    "catalog_variant",
    "coaccessibility"
  ],
  "toolbar_widgets": [
    "ldlz2_pop_selector",
    "gene_selector_menu"
  ],
  "toolbar": [
    "standard_panel",
    "standard_plot",
    "standard_association",
    "region_nav_plot"
  ],
  "data_layer": [
    "significance",
    "recomb_rate",
    "association_pvalues",
    "coaccessibility",
    "association_pvalues_catalog",
    "phewas_pvalues",
    "genes",
    "genes_filtered",
    "annotation_catalog"
  ],
  "panel": [
    "association",
    "coaccessibility",
    "association_catalog",
    "genes",
    "phewas",
    "annotation_catalog"
  ],
  "plot": [
    "standard_association",
    "association_catalog",
    "standard_phewas",
    "coaccessibility"
  ]
}
*/
