import { NavigateBeforeSharp } from "@material-ui/icons";
import { remove } from "lodash";

interface BasePopUpFieldConfig {
    name: string;
}

interface StringFieldConfig extends BasePopUpFieldConfig {
    type: "string";
    accessor: (ppd: PopUpData[]) => string;
}

//no reason to differentiate b/w internal and external links b/c we have to
//pass in raw html and can't use any react (i.e., router) elements
interface LinkFieldConfig extends BasePopUpFieldConfig {
    type: "link";
    value: {
        target: (ppd: PopUpData[]) => string;
        name: (ppd: PopUpData[]) => string;
    };
}

export interface PopupConfig {
    trackType: string;
    fields: (StringFieldConfig | LinkFieldConfig)[];
    remove?: string[];
}

export interface PopUpData {
    name: string;
    value: string;
}

export const transformConfigToHtml = (config: PopupConfig[], ppd: PopUpData[], track: any) => {
    config.forEach((c) => {
        if (track.config.id === c.trackType)
            c.fields.forEach((conf) => {
                const newEntry = { name: conf.name, value: "" };

                switch (conf.type) {
                    case "link":
                        newEntry.value = `<a href="${conf.value.target(ppd)}">${conf.value.name(ppd)}</a>`;
                        break;
                    case "string":
                        newEntry.value = conf.accessor(ppd).toString();
                        break;
                }
                remove(ppd, (p) => p.name === conf.name);
                ppd.push(newEntry);
            });

        ppd = ppd.filter((p) => !(c.remove || []).includes(p.name));
    });

    let markup = '<table class="igv-popover-table">';

    ppd.forEach((config: { name: string; value: string }) => {
        if (config.name) {
            markup += `<tr>
                    <td class="igv-popover-td">
                        <div class="igv-popover-name-value">
                            <span class="igv-popover-name">
                                ${config.name}:&nbsp;
                            </span> 
                            <span class="igv-popover-value">
                                ${config.value}
                            </span>
                        </div>
                    </td>
                </tr>`;
        } else {
            // not a name/value pair
            markup += "<tr><td>" + config.toString() + "</td></tr>";
        }
    });

    markup += "</table>";

    return markup;
};
