import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
//the below would expose lz (as lz.default) in the window for tooltip, but it seems latest lz has drooped the functionality altogether?
//import * as lz from "expose-loader?lz!locuszoom";
import * as lz from "locuszoom";
import "locuszoom/dist/locuszoom.css";
import { connect } from "react-redux";
import registry from "locuszoom/esm/registry/adapters";
import { cloneDeep, get, noop } from "lodash";
import { Grid } from "@material-ui/core";
import { selectAll } from "d3";
import { useDynamicWidth } from "../../../hooks";

const LZ = lz.default as any;

const AssociationLZ = registry.get("AssociationLZ"),
    LDLZ2 = registry.get("LDLZ2"),
    GeneLZ = registry.get("GeneLZ"),
    RecombLZ = registry.get("RecombLZ");

interface LzProps {
    chromosome?: string;
    end?: number;
    endpoint: string;
    maxWidthAsRatioToBody?: number;
    population: string;
    refVariant: string;
    selectClass: string;
    start?: number;
    track: string;
}

const LzPlot: React.FC<LzProps> = ({
    chromosome,
    end,
    endpoint,
    maxWidthAsRatioToBody,
    population,
    refVariant,
    selectClass,
    start,
    track,
}) => {
    const [loading, setLoading] = useState(false),
        interval: NodeJS.Timeout = useRef().current,
        layoutRendered = useRef(false);

    const width = useDynamicWidth() * (maxWidthAsRatioToBody || 0.5);

    useEffect(() => {
        if (layoutRendered.current) {
            initPlot();
            return () => clearInterval(interval);
        }
        return noop;
    }, [refVariant, population, track, width]);

    useLayoutEffect(() => {
        initPlot();
        layoutRendered.current = true;
    }, []);

    const initPlot = () => {
        const state = buildPlotState(chromosome, start, end, refVariant),
            plot = buildPlot(selectClass, state, population, track, endpoint, width);
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
            <LoadingIndicator loading={loading} />
            <div id={selectClass} />
        </Grid>
    );
};

interface LzState {
    chromosome: string;
    end: number;
    ldrefvar?: string;
    start: number;
}

export default connect((state: any) => ({
    endpoint: state.globalData.siteConfig.endpoint,
}))(LzPlot);

const buildPlotState = (chromosome: string, start: number, end: number, refVariant: string) => ({
    //seems like we might not need chromosome if it will always be derivable from refVar
    chromosome: chromosome ? chromosome : "chr" + refVariant.split(":")[0],
    ldrefvar: refVariant,
    start: start ? start : +refVariant.split(":")[1] - 100000,
    end: end ? end : +refVariant.split(":")[1] + 100000,
});

interface LoadingIndicator {
    loading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicator> = (props) => {
    const { loading } = props;
    return loading ? (
        <div className="alert alert-warning" style={{ position: "absolute" }}>
            Loading!
        </div>
    ) : null;
};

const buildPlot = (
    selector: string,
    state: LzState,
    population: string,
    track: string,
    endpoint: string,
    width: number
) => {
    class AssocSource extends AssociationLZ {
        //typescript boilerplate
        constructor(...args: any[]) {
            super(...args);
        }
    }

    AssocSource.prototype.getURL = function (state: LzState, chain: any, fields: string[]) {
        return `${endpoint}/locuszoom/gwas?track=${track}&chromosome=${state.chromosome}&start=${state.start}&end=${state.end}`;
    };

    class LDLZSource extends LDLZ2 {
        constructor(...args: any[]) {
            super(...args);
        }
    }

    class RecombSource extends RecombLZ {
        constructor(...args: any[]) {
            super(...args);
        }
    }

    RecombSource.prototype.getURL = function (state: LzState, chain: any, fields: string[]) {
        return `${endpoint}/locuszoom/recomb?chromosome=${state.chromosome}&start=${Math.trunc(state.start)}&end=${Math.trunc(state.end)}`;
    };

    AssocSource.prototype.getURL = function (state: LzState, chain: any, fields: string[]) {
        return `${endpoint}/locuszoom/gwas?track=${track}&chromosome=${state.chromosome}&start=${Math.trunc(state.start)}&end=${Math.trunc(state.end)}`;
    };

    //note that other sources have to be transformed into array of objects, but not ld source....
    LDLZSource.prototype.normalizeResponse = function (data: { value: number[]; id2: string[] }) {
        const position = data.id2.map((datum) => +/\:(\d+):/.exec(datum)[1]),
            chr = state.chromosome.replace("chr", ""),
            chromosome = data.id2.map(() => chr);
        return {
            variant1: data.id2.map(() => state.ldrefvar),
            variant2: data.id2,
            chromosome1: chromosome,
            chromosome2: chromosome,
            correlation: data.value,
            position1: position,
            position2: position,
        };
    };

    LDLZSource.prototype.getURL = function (state: LzState, chain: any, fields: string[]) {
        const refVar = this.getRefvar(state, chain, fields);
        chain.header.ldrefvar = refVar;
        return `${endpoint}/locuszoom/linkage?population=${population}&variant=${refVar}`;
    };

    class GeneSource extends GeneLZ {
        constructor(...args: any[]) {
            super(...args);
        }
    }

    GeneSource.prototype.getURL = function (state: LzState, chain: any, fields: string[]) {
        return `${endpoint}/locuszoom/gene?chromosome=${state.chromosome}&start=${Math.trunc(state.start)}&end=${Math.trunc(state.end)}`;
    };

    const layout = _buildLayout(state, width);

    const dataSources = new LZ.DataSources();
    dataSources.add("assoc", new AssocSource({ url: "asdf" }));
    dataSources.add("ld", new LDLZSource({ url: "asdf" }));
    dataSources.add("genes", new GeneSource({ url: "asdf" }));
    dataSources.add("recomb", new RecombSource({ url: "asdf" }));

    return LZ.populate(`#${selector}`, dataSources, layout);
};

const _buildLayout = (state: LzState, containerWidth: number) => {
    return LZ.Layouts.merge(
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
            '<a href="javascript:void(0);" onclick="lz.default.getToolTipDataLayer(this).makeLDReference(lz.default.getToolTipData(this));">Make LD Reference</a><br>',
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
