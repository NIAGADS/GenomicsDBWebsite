import { isString, isObject,get } from 'lodash'

export const parseFieldValue = (value: any): any => {
    return isString(value) || !value
    ? value
    : get(value, "props.dangerouslySetInnerHTML.__html")
    ? value.props.dangerouslySetInnerHTML.__html
    : isObject(value)
    ? parseFieldValue(value)
    : "";
};
