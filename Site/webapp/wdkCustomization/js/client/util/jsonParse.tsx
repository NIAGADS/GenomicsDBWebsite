import React from "react";
import {Link as RouterLink } from "react-router-dom";
import { isString, isPlainObject, isNull } from "lodash";

import { safeHtml } from "wdk-client/Utils/ComponentUtils";

import { withTooltip } from "@components/MaterialUI";
import Link from "@material-ui/core/Link";


export interface LinkType {
    url: string;
    type: "link" | "badge";
    value: string;
    tooltip?: string;
}

export const resolveJsonInput = (input: string): React.ReactElement<any> => {
    if (isNull(input)) return null;
    //hack for now, need to solve upstream
    if (!isJson(input) && isPlainObject(input)) {
        return resolveObjectInput((input as unknown) as { [key: string]: any });
    }
    if (!isJson(input as string)) {
        throw new Error("Trying to resolve bad input!");
    }
    return resolveObjectInput(JSON.parse(input));
};

export const resolveObjectInput = (
    obj:
        | {
              [key: string]: any;
          }
        | {
              [key: string]: any;
          }[]
): React.ReactElement<any> | React.ReactElement<any[]> => {
    if (!obj) return null;

    if (Array.isArray(obj)) {
        return (
            <>
                {obj
                    .map((item) => resolveObjectInput(item))
                    .reduce((acc, curr, i) => {
                        return acc.length ? [...acc, <span key={i}>&nbsp;//&nbsp;</span>, curr] : [curr];
                    }, [])}
            </>
        );
    }

    let className;
    switch (obj.type) {
        case "badge": //not sure we're still using this: cf. http://fermi.pmacs.upenn.edu/redmine/projects/gus4-code-migration/wiki/GUS4-React
            //badge can be a link or not, and css will change accordingly, pobably best treat this as a decorator as another 'type'
            //i.e., {style : badge}, since really all it means is some color, hover, and padding.
            className = obj.color ? `badge ${obj.color}` : "badge";
            const href = obj.url ? { href: obj.url } : null,
                props = href ? Object.assign({}, href, { className }) : { className },
                element = React.createElement(obj.url ? "a" : "span", props, obj.text);
            return withTooltip(element, obj.tooltip);
        case "link":
            //probably need to designate outlinks and routelinks formally, but for now using a regex
            const el = /^http/.test(obj.url) ? (
                <Link key={obj.url} href={obj.url} color="initial">
                    {obj.value}
                </Link>
            ) : (
                <RouterLink key={obj.url} to={obj.url}>
                    {obj.value}
                </RouterLink>
            );
            return withTooltip(el, obj.tooltip);
        case "text":
            className = obj.color ? obj.color : "";
            return withTooltip(
                <span key={Math.random().toString(36).slice(2)} className={className}>
                    {safeHtml(obj.value)}
                </span>,
                obj.tooltip
            );
        case "icon":
            className = obj.color ? `${obj.color} fa ${obj.icon}` : `fa ${obj.icon}`;
            return withTooltip(<span className={className}>{obj.text}</span>, obj.tooltip);
        case "dictionary":
            /*	
				this comes with style property, but need to decide whether we want to return component here
				or just parse, if element, probably want something more specific than current 'description_list'
				somethiing more like 'page_heading_out_links' so we know exactly what component to return
			*/
            return <>{obj}</>;
    }
    throw new Error(`no parser for object of type ${obj.type}!`);
};


export const isJson = (item: any) => {
    //not reallly a json test, more like a check to see if the backend is sending us something we assume we can treat as json
    if (!item) return false;
    if (!isString(item)) return false;
    if (item.startsWith("[") || item.startsWith("[{") || item.startsWith("{")) {
        try {
            JSON.parse(item);
            return true;
        } catch ($e) {
            return false;
        }
    }
    return false;
};
