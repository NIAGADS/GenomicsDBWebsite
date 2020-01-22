import React from 'react';
import { Tooltip, Link } from 'wdk-client/Components';
import { isString, isPlainObject, isNull } from 'lodash';
import { safeHtml } from 'wdk-client/Utils/ComponentUtils';
import { json } from 'd3';

export interface LinkType {
	url: string,
	type: 'link' | 'badge';
	value: string;
	tooltip?: string;
}

export const resolveJsonInput = (input: string | { [key: string]: any }): React.ReactElement<any> => {
	if (isNull(input)) return null;
	if (!isJson(input as string) && !(isPlainObject(input) && (input as { [key: string]: any }).type)) {
		throw new Error('Trying to resolve bad input!');
	}
	const obj = isString(input) ? JSON.parse(input) : input;
	let className;
	switch (obj.type) {
		case ('badge'): //not sure we're still using this: cf. http://fermi.pmacs.upenn.edu/redmine/projects/gus4-code-migration/wiki/GUS4-React
			//badge can be a link or not, and css will change accordingly, pobably best treat this as a decorator as another 'type'
			//i.e., {style : badge}, since really all it means is some color, hover, and padding.
			className = obj.color ? `badge ${obj.color}` : 'badge';
			const href = obj.url ? { href: obj.url } : null,
				props = href ? Object.assign({}, href, { className }) : { className },
				element = React.createElement(obj.url ? 'a' : 'span', props, obj.text);
			return withTooltip(element, obj.tooltip);
			break;
		case ('link'):
			//probably need to dseignate outlinks and routelinks formally, but for now using a regex
			const el = /^http/.test(obj.url) ? <a href={obj.url}>{obj.value}</a> : <Link to={obj.url}>{obj.value}</Link>;
			return withTooltip(el, obj.tooltip);
			break;
		case ('text'):
			className = obj.color ? obj.color : '';
			return withTooltip(<span className={className}>{safeHtml(obj.value)}</span>, obj.tooltip, 'wdk-tooltip');
			break;
		case ('icon'):
			className = obj.color ? `${obj.color} fa ${obj.icon}` : `fa ${obj.icon}`;
			return withTooltip(<span className={className}>{obj.text}</span>, obj.tooltip);
			break;
		case ('dictionary'):
			/*	
				this comes with style property, but need to decide whether we want to return component here
				or just parse, if element, probably want something more specific than current 'description_list'
				somethiing more like 'page_heading_out_links' so we know exactly what component to return
			*/
			return obj;
			break;
	}
	throw new Error(`no parser for object of type ${obj.type}!`);
}

export const withTooltip = (element: React.ReactElement<any>, content: string, classes?: string) => {
	const className = classes ? classes : ''; //removing wdk-tooltip class, caller will need to be explicit!
	if (content) {
		return <Tooltip content={safeHtml(content)} showDelay={0}>
			<span className={className}>{element}</span>
		</Tooltip>
	}
	return element;
}

export const isJson = (item: any) => {
	//not reallly a json test, more like a check to see if the backend is sending us something we assume we can treat as json
	if (!item) return false;
	if (!isString(item)) return false;
	try{
		JSON.parse(item);
	} catch (e){
		return false;
	}
	return true;
}
