import { isString, isObject, get, toNumber } from 'lodash'

export const parseFieldValue = (value: any): any => {
    return isString(value) || !value
    ? value
    : get(value, "props.dangerouslySetInnerHTML.__html")
    ? value.props.dangerouslySetInnerHTML.__html
    : value.type && value.type.name === "CssBarChart"
    ? toNumber(value.props.original)
    : isObject(value) && (value as { displayText: string }).displayText
    ? (value as { displayText: string }).displayText
    : value.value
    ? value.value
    : value.props && value.props.children
    ? parseFieldValue(value.props.children)
    : "";
};
