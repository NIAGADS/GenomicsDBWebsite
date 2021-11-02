import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { SearchResult } from "../components/Tools/SiteSearch";

export function isTrue(stringArg: string) {
    return stringArg === "true" ? true : false;
}

export const getKey = (obj: { [key: string]: any }) => Object.keys(obj).pop();

export const convertHtmlEntites = (html: string) => {
    const conv = safeHtml(html),
        proc = conv.props.dangerouslySetInnerHTML.__html;
    return proc;
};

export const buildRouteFromResult = (result: SearchResult) => `/record/${result.record_type}/${result.primary_key}`,
    buildSummaryRoute = (searchTerm: string) => `/searchResults?searchTerm=${searchTerm}`;

export const toProperCase = function (str: string) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const abbreviateLargeNumber = function (num: number, precision: number) {
    let x = ("" + num).length,
        p = Math.pow(10, precision);

    x -= x % 3;
    return Math.round(num * (precision / Math.pow(10, x))) / precision +" kMGTPE"[x / 3];
};
