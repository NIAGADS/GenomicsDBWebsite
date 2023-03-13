import { LocusZoom } from "@viz/LocusZoom";
import { _ldPopulationChoices } from "genomics-client/data/locus_zoom/_locusZoomProperties";

// copied from https://github.com/statgen/locuszoom/blob/a271a0321339fb223721476244ece2fa7dec9820/esm/helpers/layouts.js#L106
// fossilfriend: b/c I couldn't figure out how to import it from the node_modules!! ... even though it is there, so
// TODO: fix this / import
function deepCopy(item: any) {
    // FIXME: initial attempt to replace this with a more efficient deep clone method caused merge() to break; revisit in future.
    //   Replacing this with a proper clone would be the key blocker to allowing functions and non-JSON values (like infinity) in layout objects
    return JSON.parse(JSON.stringify(item));
}

/**
 * A dropdown menu that can be used to control the LD population used with the LDServer Adapter.
 * Modified from https://github.com/statgen/locuszoom/blob/a271a0321339fb223721476244ece2fa7dec9820/esm/layouts/index.js#L558
 * @name ldlz2_pop_selector
 * @type toolbar_widgets
 */
const ldlz2_pop_selector_menu = {
    type: "set_state",
    tag: "ld_population",
    position: "right",
    color: "blue",
    button_html: "LD Population: ",
    show_selected: true,
    button_title: "Select LD Population: ",
    custom_event_name: "widget_set_ldpop",
    state_field: "ld_pop",
    options: _ldPopulationChoices,
};

export const standard_association_toolbar = (function () {
    // Suitable for association plots (adds a button for LD data)
    const base = LocusZoom.Layouts.get("toolbar", "standard_association");
    for (const [index, widget] of base.widgets.entries()) {
        if (widget.hasOwnProperty("tag") && widget.tag == "ld_population") {
            base.widgets[index].options = _ldPopulationChoices;
        }
    }
    // base.widgets.push(deepCopy(ldlz2_pop_selector_menu));
    return base;
})();

export const standard_association_tooltip = {
    closable: true,
    show: { or: ["highlighted", "selected"] },
    hide: { and: ["unhighlighted", "unselected"] },
    html: `<a href="../../record/variant/{{assoc:variant|htmlescape}}" target="_blank" rel="noopener">{{assoc:variant|htmlescape}}</a><br>
        <em>p</em>-value: <strong>{{assoc:log_pvalue|logtoscinotation|htmlescape}}</strong><br>
        {{#if lz_is_ld_refvar}}<strong>LD Reference Variant</strong>{{#else}}
        <a href="javascript:void(0);" 
        onclick="var data = this.parentNode.__data__;
                 data.getDataLayer().makeLDReference(data);"
                 >Make LD Reference</a>{{/if}}<br>`,
};

export const standard_genes_tooltip = {
    closable: true,
    show: { or: ["highlighted", "selected"] },
    hide: { and: ["unhighlighted", "unselected"] },
    html:
        "<h4><strong><i>{{gene_name|htmlescape}}</i></strong></h4><br>" +
        '<a href="../../record/gene/{{gene_id|htmlescape}}" target="_blank" rel="noopener">{{gene_id|htmlescape}}</a><br>'
};

export const _ldLegend = [
    { label: "LD (r²)", label_size: 14 },
    {
        shape: "ribbon",
        orientation: "vertical",
        width: 10,
        height: 15,
        color_stops: ["#B8B8B8", "rgb(38, 188, 225)", "rgb(110, 254, 104)", "rgb(248, 195, 42)", "rgb(219, 61, 17)"],
        tick_labels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
];

export const _ldColorScale = [
    {
        // Name of a function specified in `LocusZoom.ScaleFunctions`
        scale_function: "if",
        // The field whose value will be passed to the scale function
        field: "lz_is_ld_refvar",
        // Options that will be passed to the scale function; see documentation for available options
        parameters: {
            field_value: 1,
            then: "#9632b8",
        },
    },
    {
        scale_function: "numerical_bin",
        field: "ld:correlation",
        parameters: {
            breaks: [0, 0.2, 0.4, 0.6, 0.8],
            values: ["#B8B8B8", "#46b8da", "#5cb85c", "#eea236", "#d43f3a"],
        },
    },
    "#B8B8B8",
];
