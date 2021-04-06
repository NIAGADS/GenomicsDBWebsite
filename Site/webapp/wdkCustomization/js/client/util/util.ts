import { safeHtml } from "wdk-client/Utils/ComponentUtils";
import { SearchResult } from '../components/Shared/Autocomplete';

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
