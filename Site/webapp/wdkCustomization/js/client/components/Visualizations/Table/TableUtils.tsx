import { isString } from "lodash";

export const resolveJSONFieldValue = (value: string) => {
    try {
        const jsonValue = JSON.parse(value);
        if (Array.isArray(jsonValue)) {
            return jsonValue.map((item) => item.value).join(' // ');
        }
        // JSON parse yields scientific notation parsed correctly, so this will return
        // correctly formatted numbers
        return "value" in jsonValue ? jsonValue.value : jsonValue;
    } catch (e) {
        // regular string
        return value;
    }
};

export const resolveNullFieldValue = (value: string, returnNA: boolean) => {
    return value === null || value === "N/A" ? (returnNA ? "N/A" : "") : resolveJSONFieldValue(value);
};


export const parseFieldValue = (value: any, returnNA: boolean = false): any => {
    if (!value) {
        return resolveNullFieldValue(null, returnNA);
    }

    const accessorType = value.type
        ? value.type.name.includes("Boolean")
            ? "BooleanCheckAccessor"
            : value.type.name
        : "String";

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
