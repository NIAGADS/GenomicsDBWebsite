import { isString, isObject, toNumber, get } from 'lodash';

/*
   utility function to extract display text from the various datatypes that might be passed to our table
 */

export const extractDisplayText = (value: any): any => {
	return isString(value) || !value ? value :
		get(value, 'props.dangerouslySetInnerHTML.__html') ? value.props.dangerouslySetInnerHTML.__html :
			value.type && value.type.name === "CssBarChart" ? toNumber(value.props.original) :
				isObject(value) && (value as { displayText: string }).displayText ? (value as { displayText: string }).displayText :
					value.props && value.props.children ? extractDisplayText(value.props.children) : ''
}