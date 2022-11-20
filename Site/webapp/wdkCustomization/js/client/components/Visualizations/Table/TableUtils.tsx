import { isString, isObject, get } from 'lodash'

export const parseFieldValue = (value: any, returnNA:boolean=false): any => {
    return isString(value) || !value
    ? value
    : get(value, "props.dangerouslySetInnerHTML.__html")
    ? value.props.dangerouslySetInnerHTML.__html
    : isObject(value) && (value as { displayText: string }).displayText
    ? (value as { displayText: string }).displayText
    : value.value
    ? value.value
    : value.props && value.props.children
    ? parseFieldValue(value.props.children, returnNA)
    : value.props 
    ? parseFieldValue(value.props, returnNA)
    : returnNA 
    ? "n/a" 
    : "";
};
