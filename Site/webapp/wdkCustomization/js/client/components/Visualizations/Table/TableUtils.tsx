import { isObject } from "lodash";

export const resolveJSONFieldValue = (value: string) => {
    try {
        const jsonValue = JSON.parse(value);
        if (Array.isArray(jsonValue)) {
            return jsonValue.map((item) => item.value).join(' // ');
        }
        // JSON parse yields scientific notation parsed correctly, so this will return
        // correctly formatted numbers
        return jsonValue.hasOwnProperty("value") ? jsonValue.value : jsonValue;
    } catch (e) {
        // regular string
        return value;
    }
};

export const resolveNullFieldValue = (value: string, returnNA: boolean) => {
    return value === null || value === "N/A" ? (returnNA ? "N/A" : "") : resolveJSONFieldValue(value);
};


const getAccessorType = (value: any) => {
    const accessorType = value.type
        ? value.type.hasOwnProperty('type') // when memoized, get type is react.memo, and nested type is the accessor type
            ? value.type.type.name
            : value.type.name
        : "String";
    return accessorType.includes("Boolean") ? "BooleanCheckAccessor" : accessorType;
}

export const parseFieldValue = (value: any, returnNA: boolean = false): any => {
    if (!value) {
        return resolveNullFieldValue(null, returnNA);
    }

    const accessorType = getAccessorType(value);

    switch (accessorType) {
        case "String":
            return resolveNullFieldValue(value, returnNA);
        case "NASpan":
            return resolveNullFieldValue("N/A", returnNA);
        case "BooleanCheckAccessor":
            return value.props.value === "true" ? "Yes" : "No";
        default:
            if (value.props && value.props.value) {
                return resolveNullFieldValue(value.props.value, returnNA);
            }
            throw new Error(`ERROR: Unable to parse field value - unhandled ColumnAccessor type: ${value.type.name}`);
    }
};
