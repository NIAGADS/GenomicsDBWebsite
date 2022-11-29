import { isString } from "lodash";

export const resolveJSONFieldValue = (value: string) => {
    try {
        const jsonValue = JSON.parse(value);
        if (Array.isArray(jsonValue)) {
            throw new Error(`DEBUG ERROR: TODO JSON Array: ${JSON.stringify(jsonValue)}`);
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

export const parseFieldValue = (value: any, returnNA: boolean = false, isBooleanFlag: boolean = false): any => {
    if (isBooleanFlag || (value.type && value.type.name.includes("Boolean"))) {
        return value ? "Yes" : "No";
    }

    if (!value || isString(value)) {
        return resolveNullFieldValue(value, returnNA);
    }

    switch (value.type.name) {
        case "NASpan":
            return resolveNullFieldValue("N/A", returnNA);
        default:
            if (value.props && value.props.value) {
                return resolveNullFieldValue(value.props.value, returnNA);
            }
            throw new Error(`ERROR: Unable to parse field value - unknown ColumnAccessor type: ${value.type.name}`);
    }
};
