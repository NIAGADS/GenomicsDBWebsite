import { safeHtml } from "wdk-client/Utils/ComponentUtils";

export function isTrue(stringArg: string) {
    return stringArg === "true" ? true : false;
}

export const getKey = (obj: { [key: string]: any }) => Object.keys(obj).pop();

export const convertHtmlEntites = (html: string) => {
    const conv = safeHtml(html),
        proc = conv.props.dangerouslySetInnerHTML.__html;
    return proc;
};
