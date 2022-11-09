import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { SearchResult } from "../components/Tools/SiteSearch";

export function isTrue(stringArg: string) {
    return stringArg === "true" ? true : false;
}

export const getKey = (obj: { [key: string]: any }) => Object.keys(obj).pop();

/* converts chr:start-end:strand into chr:start-end with commas in delimiting thousandths */
export const formatSpan = (span: string) => {
    const spanElements = span.split(':');
    const positions = spanElements[1].split('-');
    if (positions.length == 2) {
        return spanElements[0] + ':' + parseInt(positions[0]).toLocaleString() + '-' + parseInt(positions[1]).toLocaleString();
    }
    return spanElements[0] + ':' + parseInt(positions[0]).toLocaleString();
    
    
}

export const convertHtmlEntites = (html: string) => {
    const conv = safeHtml(html),
        proc = conv.props.dangerouslySetInnerHTML.__html;
    return proc;
};

export const buildRouteFromResult = (result: SearchResult) => `/record/${result.record_type}/${result.primary_key}`,
    buildSummaryRoute = (searchTerm: string) => `/search/site?term=${searchTerm}`;

export const toProperCase = function (str: string) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

/*export const abbreviateLargeNumber = function (num: number, precision: number) {
    let x = ("" + num).length,
        p = Math.pow(10, precision);

    x -= x % 3;
    return Math.round(num * (precision / Math.pow(10, x))) / precision +" kMGTPE"[x / 3];
};*/


export const abbreviateLargeNumber = function(n:number) {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    return n;
};