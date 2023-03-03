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
    type: 'set_state',
    tag: 'ld_population',
    position: 'right',
    color: 'blue',
    button_html: 'LD Population: ',
    show_selected: true,
    button_title: 'Select LD Population: ',
    custom_event_name: 'widget_set_ldpop',
    state_field: 'ld_pop',
    options: _ldPopulationChoices,
};

export const standard_association_toolbar = function () {
    // Suitable for association plots (adds a button for LD data)
    const base = LocusZoom.Layouts.get('toolbar', 'standard_association');
    for (const [index, widget] of base.widgets.entries()) {
        if (widget.hasOwnProperty("tag") && widget.tag == "ld_population") {
            base.widgets[index].options = _ldPopulationChoices;
        }
    }
    // base.widgets.push(deepCopy(ldlz2_pop_selector_menu));
    return base;
}();

